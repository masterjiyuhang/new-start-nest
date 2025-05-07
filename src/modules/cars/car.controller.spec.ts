import { Test, TestingModule } from '@nestjs/testing';
import { CarController } from './car.controller';
import { CarService } from './car.service';
import { Car } from './entities/car.entity';

describe('CarController', () => {
  let carController: CarController;
  let carService: jest.Mocked<CarService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarController],
      providers: [
        {
          provide: CarService,
          useValue: {
            findListByName: jest.fn(),
          },
        },
      ],
    }).compile();

    carController = module.get<CarController>(CarController);
    carService = module.get(CarService) as jest.Mocked<CarService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(carController).toBeDefined();
  });

  it('should initialize with carService dependency', () => {
    expect(carController).toHaveProperty('carService', carService);
  });

  describe('findAll', () => {
    it('should call carService.findListByName with default parameters', async () => {
      const mockResult: [Car[], number] = [[], 0];
      carService.findListByName.mockResolvedValue(mockResult);

      const result = await carController.findAll(
        false, // isOverLoadOnly
        '', // name
        0, // page
        10, // size
      );

      expect(carService.findListByName).toHaveBeenCalledWith(0, 10, '', false);
      expect(result).toEqual({
        list: [],
        total: 0,
        page: 0,
      });
    });
  });
});
