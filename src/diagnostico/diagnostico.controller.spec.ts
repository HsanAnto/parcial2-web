import { Test, TestingModule } from '@nestjs/testing';
import { DiagnosticoController } from './diagnostico.controller';

describe('DiagnosticoController', () => {
  let controller: DiagnosticoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DiagnosticoController],
    }).compile();

    controller = module.get<DiagnosticoController>(DiagnosticoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
