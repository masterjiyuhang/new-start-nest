import { Test, TestingModule } from '@nestjs/testing';
import { CarController } from './car.controller';
import { CarService } from './car.service';
import { Car } from './interfaces/car.interface';

describe('CarController', () => {
  let carController: CarController;
  let carService: CarService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [CarController],
      providers: [CarService],
    }).compile();

    carService = moduleRef.get<CarService>(CarService);
    carController = moduleRef.get<CarController>(CarController);
  });

  describe('findAll', () => {
    it('should return an array of cars', async () => {
      const result: Car[] = [
        {
          id: 1,
          name: '小车',
          years: 2,
          color: 'red',
          isOverload: false,
        },
      ];

      jest.spyOn(carService, 'findAll').mockImplementation((): any => result);
      expect(await carController.findAll()).toBe(result);
    });
  });
});
