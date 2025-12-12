import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schemas/user.schema';
import { NotFoundException } from '@nestjs/common';
@Injectable()
export class UsersService {
  // 1. Dependency Injection
  // We ask NestJS to give us the 'User' model we defined in the Module earlier
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  // 2. Create Logic
  async create(createUserDto: CreateUserDto): Promise<User> {
    // Create a new "instance" of the model using the data sent from Frontend
    const createdUser = new this.userModel(createUserDto);

    // Save it to MongoDB and return the result
    return createdUser.save();
  }

  // 3. Find All Logic
  async findAll(): Promise<User[]> {
    // .find() gets all documents
    // .exec() turns it into a real Promise we can await
    return this.userModel.find().exec();
  }

  // 4. Find One by ID (Optional but useful)
  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }
}
