import { Test, TestingModule } from '@nestjs/testing';
import { PacienteMedicoController } from './paciente-medico.controller';

describe('PacienteMedicoController', () => {
  let controller: PacienteMedicoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PacienteMedicoController],
    }).compile();

    controller = module.get<PacienteMedicoController>(PacienteMedicoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
