import { Test, TestingModule } from '@nestjs/testing';
import { BeatsController } from './beats.controller';

describe('BeatsController', () => {
  let controller: BeatsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BeatsController],
    }).compile();

    controller = module.get<BeatsController>(BeatsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
