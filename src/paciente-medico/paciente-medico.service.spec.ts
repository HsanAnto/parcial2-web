import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { PacienteMedicoService } from './paciente-medico.service';
import { Repository } from 'typeorm';
import { Paciente } from '../paciente/paciente.entity';
import { Medico } from '../medico/medico.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('PacienteMedicoService', () => {
  let service: PacienteMedicoService;
  let pacienteRepository: Repository<Paciente>;
  let medicoRepository: Repository<Medico>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PacienteMedicoService,
        {
          provide: getRepositoryToken(Paciente),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Medico),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<PacienteMedicoService>(PacienteMedicoService);
    pacienteRepository = module.get<Repository<Paciente>>(
      getRepositoryToken(Paciente),
    );
    medicoRepository = module.get<Repository<Medico>>(
      getRepositoryToken(Medico),
    );
  });

  // Prueba para el método addMedicoToPaciente
  it('Debe asignar un médico a un paciente correctamente', async () => {
    const paciente = {
      id: '1',
      nombre: 'Juan Pérez',
      genero: 'M',
      diagnosticos: [],
      medicos: [],
    };

    const medico = {
      id: '1',
      nombre: 'Dr. López',
      especialidad: 'Cardiología',
      pacientes: [],
    };

    jest
      .spyOn(pacienteRepository, 'findOne')
      .mockResolvedValue(paciente as Paciente);
    jest.spyOn(medicoRepository, 'findOne').mockResolvedValue(medico as Medico);
    jest.spyOn(pacienteRepository, 'save').mockResolvedValue({
      ...paciente,
      medicos: [medico],
    } as Paciente);

    await service.addMedicoToPaciente('1', '1');
    expect(pacienteRepository.save).toHaveBeenCalledWith({
      ...paciente,
      medicos: [medico],
    });
  });

  it('Debe lanzar excepción si el médico no existe al asignarlo a un paciente', async () => {
    const paciente = {
      id: '1',
      nombre: 'Juan Pérez',
      genero: 'M',
      diagnosticos: [],
      medicos: [],
    };

    jest
      .spyOn(pacienteRepository, 'findOne')
      .mockResolvedValue(paciente as Paciente);
    jest.spyOn(medicoRepository, 'findOne').mockResolvedValue(null);

    await expect(service.addMedicoToPaciente('1', '1')).rejects.toThrow(
      new NotFoundException('El médico con id 1 no existe'),
    );
  });

  it('Debe lanzar excepción si el paciente ya tiene 5 médicos asignados', async () => {
    const medico = {
      id: '1',
      nombre: 'Dr. López',
      especialidad: 'Cardiología',
      pacientes: [],
    };

    const paciente = {
      id: '1',
      nombre: 'Juan Pérez',
      genero: 'M',
      diagnosticos: [],
      medicos: Array(5).fill(medico),
    };

    jest
      .spyOn(pacienteRepository, 'findOne')
      .mockResolvedValue(paciente as Paciente);
    jest.spyOn(medicoRepository, 'findOne').mockResolvedValue(medico as Medico);

    await expect(service.addMedicoToPaciente('1', '2')).rejects.toThrow(
      new BadRequestException(
        'Un paciente no puede tener más de 5 médicos asignados',
      ),
    );
  });
});
