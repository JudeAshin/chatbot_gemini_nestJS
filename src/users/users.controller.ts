import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UseInterceptors, UploadedFile, ParseFilePipe } from '@nestjs/common';
import { ApiResponse, UsersService } from './users.service';
import { UpdateCustomerDto } from './dto/update-user.dto';
import { ChatContent, CreateCustomerDto } from './dto/create-customer.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Normal post methos to create a user
  @Post('/identify')
  createCustomer(@Body()customerDto:CreateCustomerDto):Promise<ApiResponse>{
    return this.usersService.identifyCustomer(customerDto)
  }

  @Post('chat')
  chat(@Body() chatContent: ChatContent) {
    return this.usersService.chat(chatContent);
  }
  
  @Post('text')
  text(@Body() chatContent: ChatContent) {
    return this.usersService.generateText(chatContent.message);
  }

  @Post('vision')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File, @Body() body: {message: string}) {
    return this.usersService.vision(body.message, file);
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
