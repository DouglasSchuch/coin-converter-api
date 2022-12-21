import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger/dist/decorators';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  @ApiOperation({
    summary: 'Rota de retorno de todas as transações realizadas',
  })
  @ApiResponse({
    status: 200,
    description: 'Retorna a lista de todas as transações',
  })
  findAll() {
    return this.transactionsService.findAll();
  }
}
