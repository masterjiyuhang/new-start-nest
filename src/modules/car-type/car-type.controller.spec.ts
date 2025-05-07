import { Test, TestingModule } from '@nestjs/testing';
import { CarTypeController } from './car-type.controller';
import { CarTypeService } from './car-type.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CarType } from './entities/car-type.entity';

describe('CarTypeController', () => {
  let controller: CarTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarTypeController],
      providers: [
        CarTypeService,
        {
          provide: getRepositoryToken(CarType),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            // 添加其他需要的Repository方法
          },
        },
      ],
    }).compile();

    controller = module.get<CarTypeController>(CarTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
