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

  constructor(dto?: Partial<CreateTransactionDto>) {
    this.source_currency = dto?.source_currency;
    this.source_value = dto?.source_value;
    this.destination_currency = dto?.destination_currency;
    this.conversion_rate = dto?.conversion_rate;
    this.date = dto?.date;
  }
}
