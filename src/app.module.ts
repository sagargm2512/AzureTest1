import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(), // load .env + Azure App Settings
    MongooseModule.forRoot(process.env.MONGODB_URI || "", {
      // optional: safer config
      dbName: 'EmployeeData',
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],

})
export class AppModule { }
