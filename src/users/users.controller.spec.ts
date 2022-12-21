import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

const newUser = new User({ email: 'test@test.com', password: '123' });

describe('UsersController', () => {
  let userController: UsersController;
  let userService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn().mockResolvedValue(newUser),
          },
        },
      ],
    }).compile();

    userController = module.get<UsersController>(UsersController);
    userService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
    expect(userService).toBeDefined();
  });

  describe('save', () => {
    it('should save a new user with success', async () => {
      const data: CreateUserDto = { email: 'test@test.com', password: '123' };
      const userMock = { ...data } as User;
      jest.spyOn(userService, 'create').mockResolvedValueOnce(userMock);

      const result = await userController.create(data);

      expect(result).toBeDefined();
      expect(userService.create).toBeCalledTimes(1);
    });
  });
});
