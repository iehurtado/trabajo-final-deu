import { Test, TestingModule } from '@nestjs/testing';
import { BalneariosService } from './balnearios.service';

describe('BalneariosService', () => {
  let service: BalneariosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BalneariosService],
    }).compile();

    service = module.get<BalneariosService>(BalneariosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
