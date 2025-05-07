import { Test, TestingModule } from '@nestjs/testing';
import { CarTypeService } from './car-type.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CarType } from './entities/car-type.entity';

describe('CarTypeService', () => {
  let service: CarTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<CarTypeService>(CarTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
