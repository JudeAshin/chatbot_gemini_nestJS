import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { SequelizeModuleOptions } from "@nestjs/sequelize/dist";
import { UsersModule } from './users/users.module';

dotenv.config(); // Explicitly load the .env file
console.log({
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASS: process.env.DB_PASS,
  DB_NAME: process.env.DB_NAME,
  DB_SYNCHRONIZE: process.env.DB_SYNCHRONIZE,
}); // Log variables to debug

const generateSequelizeOptions = async (): Promise<SequelizeModuleOptions> => {
  try {
      const config: SequelizeModuleOptions = {
        dialect: "mysql",
        host: "127.0.0.1",
        timezone: '+05:30', // Indian Standard Time (IST) timezone offset
        port: 3306,
        username: "root",
        password: "",
        database: "sample",
        autoLoadModels: true,
        synchronize: true,
        sync: { alter: true },
      };
      return config;
  } catch (error) {
      console.error("Error generating Sequelize options:", error);
      throw error;
  }
};

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SequelizeModule.forRootAsync({
      useFactory: generateSequelizeOptions,
    }),
    UsersModule,
  ],
})
export class AppModule {}

export default generateSequelizeOptions;
