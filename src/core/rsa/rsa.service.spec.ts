import { Test, TestingModule } from '@nestjs/testing';
import { RsaService } from './rsa.service';

describe('RsaService', () => {
  let service: RsaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RsaService],
    }).compile();

    service = module.get<RsaService>(RsaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
