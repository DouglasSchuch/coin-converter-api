import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async create(
    createTransactionDto: CreateTransactionDto,
    user_id: number,
  ): Promise<Transaction> {
    try {
      const newTransaction = this.transactionRepository.create({
        ...createTransactionDto,
        user: { id: user_id },
      });
      return await this.transactionRepository.save(newTransaction);
    } catch (err) {
      throw err;
    }
  }

  async findAllByUser(id: number): Promise<Transaction[]> {
    return await this.transactionRepository.find({
      relations: ['user'],
      where: {
        user: { id },
      },
    });
  }
}
