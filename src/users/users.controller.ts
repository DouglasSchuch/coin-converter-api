import { Controller, Logger, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger/dist/decorators';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Rota de cadastro de usuário' })
  @ApiBody({
    type: CreateUserDto,
    required: true,
    description: 'Exemplos de possíveis valores',
    examples: {
      a: {
        summary: 'Objeto de criação de usuário',
        value: {
          email: 'teste@email.com',
          password: '12345',
        } as CreateUserDto,
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Retorna o usuário cadastrado' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService
      .create(createUserDto)
      .catch((err) => this.logger.error(`POST /users - ${err.message}`));
  }
}
