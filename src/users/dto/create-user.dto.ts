import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsArray,
  IsNumberString,
} from 'class-validator';

export class CreateUserDto {
  // 1. Required Fields
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  // 2. Optional String Fields
  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  designation?: string;

  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  Reporting_to?: string;

  @IsOptional()
  @IsString()
  Team_Manager?: string;

  @IsOptional()
  @IsString()
  Project?: string;

  // 3. Arrays (Skills)
  // Validates that it is an array, and every item inside is a string
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  // 4. Mixed Type (Experience)
  // Since this can be number or string, we keep it loose with just @IsOptional
  // If you want to force it to be a number-string, use @IsNumberString()
  @IsOptional()
  experience?: string | number;
}
