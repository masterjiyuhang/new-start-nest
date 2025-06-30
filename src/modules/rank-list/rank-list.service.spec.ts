import { Test, TestingModule } from '@nestjs/testing';
import { RankListService } from './rank-list.service';

describe('RankListService', () => {
  let service: RankListService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RankListService],
    }).compile();

    service = module.get<RankListService>(RankListService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
