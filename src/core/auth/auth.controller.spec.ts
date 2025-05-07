import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { RsaService } from '../rsa/rsa.service';
describe('AuthController', () => {
  let authController: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(), // Mock登录方法
            register: jest.fn(), // Mock注册方法
          },
        },
        {
          provide: JwtService, // 如果使用了JWT
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: RsaService,
          useValue: {
            decryptData: jest.fn().mockImplementation((data) => data),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });
});
