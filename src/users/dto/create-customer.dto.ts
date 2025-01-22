export class CreateCustomerDto {

    id:number;
    email:string;
    phoneNumber:number;
    linkedId:number;
    linkPrecedence:string;
}

export interface ChatContent {
    agent: 'user' | 'chatbot';
    message: string;
}