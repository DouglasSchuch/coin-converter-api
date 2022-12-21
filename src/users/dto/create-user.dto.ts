import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(1)
  password: string;

  constructor(dto?: Partial<CreateUserDto>) {
    this.email = dto?.email;
    this.password = dto?.password;
  }
}
