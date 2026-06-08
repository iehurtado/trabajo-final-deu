import { Test, TestingModule } from '@nestjs/testing';
import { BalneariosController } from './balnearios.controller';

describe('BalneariosController', () => {
  let controller: BalneariosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BalneariosController],
    }).compile();

    controller = module.get<BalneariosController>(BalneariosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
