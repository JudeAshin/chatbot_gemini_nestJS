import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UseInterceptors, UploadedFile, ParseFilePipe } from '@nestjs/common';
import { ApiResponse, UsersService } from './users.service';
import { UpdateCustomerDto } from './dto/update-user.dto';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { Customer } from './entities/customer.entity';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Normal post methos to create a user
  @Post('/identify')
  createCustomer(customerDto:CreateCustomerDto):Promise<ApiResponse>{
    return this.usersService.createCustomer(customerDto)
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateCustomerDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
