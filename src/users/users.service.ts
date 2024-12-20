import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Customer } from './entities/customer.entity';
import { UpdateCustomerDto } from './dto/update-user.dto';
import { CreateCustomerDto } from './dto/create-customer.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Customer)
    private customerModel: typeof Customer,
  ){}

  async createCustomer(customerDto:CreateCustomerDto):Promise<ApiResponse>{
    const customer =  await this.customerModel.create(customerDto)
    return responseMessageGenerator('success', 'New customer Created successfully', customer)

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