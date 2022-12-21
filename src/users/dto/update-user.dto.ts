import { IsEmail, IsNotEmpty, IsNumber, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(1)
  password: string;
}
