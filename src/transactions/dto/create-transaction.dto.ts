import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsString()
  source_currency: string;

  @IsNotEmpty()
  @IsNumber()
  source_value: number;

  @IsNotEmpty()
  @IsString()
  destination_currency: string;

  @IsNotEmpty()
  @IsNumber()
  conversion_rate: number;

  @IsNotEmpty()
  @IsDate()
  date: Date;

  @IsNotEmpty()
  user: any;
}
