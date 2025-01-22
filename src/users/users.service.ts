import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Customer } from './entities/customer.entity';
import { UpdateCustomerDto } from './dto/update-user.dto';
import { ChatContent, CreateCustomerDto } from './dto/create-customer.dto';
import { Op } from 'sequelize';
import {
  ChatSession,GenerativeModel,GoogleGenerativeAI,InlineDataPart} from '@google/generative-ai';
@Injectable()
export class UsersService {
  model: GenerativeModel;
  imagemodel: GenerativeModel;
  chatSession: ChatSession;
  constructor(
    @InjectModel(Customer)
    private customerModel: typeof Customer ,
  ){
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    this.model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    this.imagemodel = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
    this.chatSession = this.model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: "You're a poet. Respond to all questions with a rhyming poem. What is the capital of California?" }],
        },
        {
          role: 'model',
          parts:[{text: "If the capital of California is what you seek, Sacramento is where you ought to peek."}],
        },
      ],
    });
  }

  async identifyCustomer(customerDto: CreateCustomerDto): Promise<ApiResponse> {
    const { email, phoneNumber } = customerDto;

    // Fetch contacts with matching email or phoneNumber
    const matchingContacts = await this.customerModel.findAll({
      where: {
        [Op.or]: [
          { email },
          { phoneNumber }
        ]
      }
    });

    let primaryContactId: number;
    let emails: Set<string> = new Set();
    let phoneNumbers: Set<string> = new Set();
    let secondaryContactIds: Set<number> = new Set();

    if (matchingContacts.length === 0) {
      // No matching contacts, create a new primary contact
      const newContact = await this.customerModel.create({
        email,
        phoneNumber,
        linkedId: null,
        linkPrecedence: "primary",
      });

      primaryContactId = newContact.id;
      if (email) emails.add(email);
      if (phoneNumber) phoneNumbers.add(phoneNumber.toString());
    } else {
      // Consolidate information from matching contacts
      const primaryContact = matchingContacts.find(contact => !contact.linkedId) || matchingContacts[0];
      primaryContactId = primaryContact.id;

      for (const contact of matchingContacts) {
        if (contact.id !== primaryContactId) {
          secondaryContactIds.add(contact.id);
        }
        if (contact.email) emails.add(contact.email);
        if (contact.phoneNumber) phoneNumbers.add(contact.phoneNumber.toString());
      }

      // If the new data is unique, create a secondary contact
      if (!matchingContacts.some(contact => contact.email === email && contact.phoneNumber === phoneNumber)) {
        const newSecondaryContact = await this.customerModel.create({
          email,
          phoneNumber,
          linkedId: primaryContactId,
          linkPrecedence: "secondary",
        });

        secondaryContactIds.add(newSecondaryContact.id);
        if (email) emails.add(email);
        if (phoneNumber) phoneNumbers.add(phoneNumber.toString());
      }
    }

    return responseMessageGenerator('success', 'Customer identified successfully', {
      contact: {
        primaryContactId,
        emails: Array.from(emails),
        phoneNumbers: Array.from(phoneNumbers),
        secondaryContactIds: Array.from(secondaryContactIds),
      }
    });
  }

  async chat(chatContent: ChatContent): Promise<ChatContent> {
    const result = await this.chatSession.sendMessage(chatContent.message);
    const response = await result.response;
    const text = response.text();

    return {
      message: text,
      agent: 'chatbot',
    };
  }

  async generateText(message: string): Promise<ChatContent> {
    const result = await this.model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    return {
      message: text,
      agent: 'chatbot',
    };
  }

  async vision(message: string, file: Express.Multer.File): Promise<ChatContent> {
    const imageDataPart: InlineDataPart = {
        inlineData: {
          data: file.buffer.toString('base64'),
          mimeType: file.mimetype,
        },
      };
    const result = await this.imagemodel.generateContent([message, imageDataPart]);
    const response = await result.response;
    const text = response.text();

    return {
      message: text,
      agent: 'chatbot',
    };
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateCustomerDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}

// Helper Service

export const responseMessageGenerator = async (status: string, message: string, data?: any): Promise<ApiResponse> => {
  // if (data) {

  const format = {
      status,
      message,
      data: data
  }

  return format
  // }
}

export interface ApiResponse {
  status: string,
  message: string,
  data: any,
}