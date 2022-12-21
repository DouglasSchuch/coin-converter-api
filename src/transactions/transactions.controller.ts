import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger/dist/decorators';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get('/user/:id')
  @ApiOperation({
    summary: 'Rota de retorno de todas as transações realizadas por um usuário',
  })
  @ApiQuery({
    name: 'id',
    description: 'Identificador do usuário',
    required: true,
    type: 'int',
  })
  @ApiResponse({
    status: 200,
    description:
      'Retorna a lista de todas as transações realizadas por um usuário',
  })
  findAllByUser(@Param('id') id: number) {
    return this.transactionsService.findAllByUser(id);
  }
}
