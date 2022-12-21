import { Controller } from '@nestjs/common';
import { Body, Post } from '@nestjs/common/decorators';
import { ApiOperation } from '@nestjs/swagger/dist';
import { ApiBody, ApiResponse } from '@nestjs/swagger/dist/decorators';
import { AppService, ConvertDto } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/convert')
  @ApiOperation({
    summary:
      'Rota de conversão de moedas, são aceitas apenas conversões entre as seguintes moedas: BRL, USD, EUR, JPY',
  })
  @ApiBody({
    type: ConvertDto,
    required: true,
    description: 'Exemplos de possíveis valores',
    examples: {
      a: {
        summary: 'Conversão de Real Brasileiro para Dólar Americano',
        description: 'Conversão de R$2,50 para US$',
        value: {
          from: 'BRL',
          to: 'USD',
          amount: 2.5,
          user_id: 1,
        } as ConvertDto,
      },
      b: {
        summary: 'Conversão de Euro para Iene Japonês',
        description: 'Conversão de €3,50 para ¥',
        value: {
          from: 'EUR',
          to: 'JPY',
          amount: 3.5,
          user_id: 1,
        } as ConvertDto,
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Retorna os dados da transação' })
  async convert(@Body() data: ConvertDto): Promise<any> {
    return await this.appService.convert(data);
  }
}
