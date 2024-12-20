import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(), // Load .env file or environment variables
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST, // Use environment variables
      port: 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      autoLoadModels: true,
      synchronize: process.env.DB_SYNCHRONIZE === 'true', // For production, set false
    }),
    UsersModule,
  ],
})
export class AppModule {}
