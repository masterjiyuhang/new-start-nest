import { Test, TestingModule } from '@nestjs/testing';
import { RankListController } from './rank-list.controller';
import { RankListService } from './rank-list.service';

describe('RankListController', () => {
  let controller: RankListController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RankListController],
      providers: [RankListService],
    }).compile();

    controller = module.get<RankListController>(RankListController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
