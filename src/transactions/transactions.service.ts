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

  async create(createTransactionDto: CreateTransactionDto, user_id) {
    try {
      const newUser = this.transactionRepository.create({
        ...createTransactionDto,
        user: { id: user_id },
      });
      return await this.transactionRepository.save(newUser);
    } catch (err) {
      throw err;
    }
  }

  async findAll() {
    return await this.transactionRepository.find({ relations: ['users'] });
  }
}
