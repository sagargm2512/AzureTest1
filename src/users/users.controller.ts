import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

// 1. Base Route
// @Controller('users') means all routes in this file start with /users
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 2. POST Endpoint (Create User)
  // URL: http://localhost:3000/users
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    // @Body() extracts the JSON sent from the frontend
    return this.usersService.create(createUserDto);
  }

  // 3. GET Endpoint (List all Users)
  // URL: http://localhost:3000/users
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // 4. GET Single User (Optional)
  // URL: http://localhost:3000/users/6530a... (some-id)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}
