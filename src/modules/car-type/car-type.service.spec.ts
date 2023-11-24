import { Test, TestingModule } from '@nestjs/testing';
import { CarTypeService } from './car-type.service';

describe('CarTypeService', () => {
  let service: CarTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CarTypeService],
    }).compile();

    service = module.get<CarTypeService>(CarTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
