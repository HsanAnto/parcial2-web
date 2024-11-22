import { Test, TestingModule } from '@nestjs/testing';
import { PacienteService } from './paciente.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Paciente } from './paciente.entity/paciente.entity';

describe('PacienteService', () => {
  let service: PacienteService;
  let repository: Repository<Paciente>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PacienteService,
        {
          provide: getRepositoryToken(Paciente),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<PacienteService>(PacienteService);
    repository = module.get<Repository<Paciente>>(getRepositoryToken(Paciente));
  });

  it('Debe crear un paciente correctamente', async () => {
    const paciente = {
      id: '1',
      nombre: 'Juan',
      genero: 'M',
      medicos: [],
      diagnosticos: [],
    };
    jest.spyOn(repository, 'save').mockResolvedValue(paciente as Paciente);

    expect(await service.create(paciente as Paciente)).toEqual(paciente);
  });

  it('Debe lanzar excepción si el nombre es menor a 3 caracteres', async () => {
    const paciente = {
      id: '2',
      nombre: 'Jo',
      genero: 'M',
      medicos: [],
      diagnosticos: [],
    };
    await expect(service.create(paciente as Paciente)).rejects.toThrow(
      'El nombre debe tener al menos 3 caracteres',
    );
  });
});
