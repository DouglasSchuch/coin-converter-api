import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ConvertDto {
  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @IsNotEmpty()
  @IsString()
  to: string;

  @IsNotEmpty()
  @IsString()
  from: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;
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

  validateCoin(coin: string) {
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

  async validateDto(dto: ConvertDto) {
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

  async convert(dto: ConvertDto) {
    try {
      await this.validateDto(dto);

      const result = await this.getCoinValue(dto);
      console.log(result.data);
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

      return {
        'Transaction ID': transactionCreated.id,
        'User ID': dto.user_id,
        'Source Currency': dto.to,
        'Source Value': dto.amount,
        'Destination Currency': dto.from,
        'Destination Value': result.data.result,
        'Conversion Rate': result.data.info.rate,
        'Date/Hour UTC': transaction.date,
      };
    } catch (err) {
      throw err;
    }
  }
}
