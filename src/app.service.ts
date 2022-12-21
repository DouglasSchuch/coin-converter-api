import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ConvertDto {
  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @IsNotEmpty()
  @IsString()
  from: string;

  @IsNotEmpty()
  @IsString()
  to: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  constructor(dto?: Partial<ConvertDto>) {
    this.user_id = dto?.user_id;
    this.from = dto?.from;
    this.to = dto?.to;
    this.amount = dto?.amount;
  }
}

export class ConvertReturnDto {
  @IsNotEmpty()
  @IsNumber()
  transaction_id: number;

  @IsNotEmpty()
  @IsNumber()
  user_id: number;

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
  destination_value: number;

  @IsNotEmpty()
  @IsNumber()
  conversion_rate: number;

  @IsNotEmpty()
  @IsDate()
  date: Date;

  constructor(dto?: Partial<ConvertReturnDto>) {
    this.transaction_id = dto?.transaction_id;
    this.user_id = dto?.user_id;
    this.source_currency = dto?.source_currency;
    this.source_value = dto?.source_value;
    this.destination_currency = dto?.destination_currency;
    this.destination_value = dto?.destination_value;
    this.conversion_rate = dto?.conversion_rate;
    this.date = dto?.date;
  }
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TransactionsService } from './transactions/transactions.service';
import { CreateTransactionDto } from './transactions/dto/create-transaction.dto';
import { UsersService } from './users/users.service';
import { User } from './users/entities/user.entity';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';

@Injectable()
export class AppService {
  constructor(
    private httpService: HttpService,
    private transactionService: TransactionsService,
    private userService: UsersService,
  ) {}

  validateCoin(coin: string): boolean {
    return ['BRL', 'USD', 'EUR', 'JPY'].includes(coin);
  }

  getCoinValue(dto: ConvertDto): Promise<AxiosResponse<any>> {
    return this.httpService.axiosRef.get(
      `http://api.apilayer.com/exchangerates_data/convert?to=${dto.to}&from=${dto.from}&amount=${dto.amount}`,
      {
        headers: {
          apikey: process.env.ACCESS_API_CONVERTER,
        },
      },
    );
  }

  async validateDto(dto: ConvertDto): Promise<void> {
    try {
      if (
        !dto.from ||
        !dto.to ||
        !dto.amount ||
        dto.amount <= 0 ||
        !dto.user_id
      ) {
        throw new HttpException(
          'Invalid datas',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      if (!this.validateCoin(dto.from) || !this.validateCoin(dto.to)) {
        throw new HttpException(
          'Only allowed conversions: BRL, USD, EUR, JPY',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const user: User = await this.userService.findOne(dto.user_id);
      if (!user) {
        throw new HttpException(
          'User not found',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } catch (err) {
      throw err;
    }
  }

  async convert(dto: ConvertDto): Promise<ConvertReturnDto> {
    try {
      await this.validateDto(dto);

      const result = await this.getCoinValue(dto);

      if (!result.data?.success) {
        throw new HttpException(
          'Error connecting to currency conversion server',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const transaction = new CreateTransactionDto();
      transaction.source_currency = dto.to;
      transaction.source_value = dto.amount;
      transaction.destination_currency = dto.from;
      transaction.conversion_rate = result.data.info.rate;
      transaction.date = new Date();

      const transactionCreated = await this.transactionService.create(
        transaction,
        dto.user_id,
      );

      const convertReturn = new ConvertReturnDto();
      convertReturn.transaction_id = transactionCreated.id;
      convertReturn.user_id = dto.user_id;
      convertReturn.source_currency = dto.to;
      convertReturn.source_value = dto.amount;
      convertReturn.destination_currency = dto.from;
      convertReturn.destination_value = result.data.result;
      convertReturn.conversion_rate = result.data.info.rate;
      convertReturn.date = transaction.date;

      return convertReturn;
    } catch (err) {
      throw err;
    }
  }
}
