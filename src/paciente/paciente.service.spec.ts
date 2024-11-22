import { Test, TestingModule } from '@nestjs/testing';
import { PacienteService } from './paciente.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Paciente } from './paciente.entity/paciente.entity';
import { Medico } from '../medico/medico.entity/medico.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('PacienteService', () => {
  let service: PacienteService;
  let pacienteRepository: Repository<Paciente>;
  let medicoRepository: Repository<Medico>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PacienteService,
        {
          provide: getRepositoryToken(Paciente),
          useClass: Repository, // Mock del repositorio de Paciente
        },
        {
          provide: getRepositoryToken(Medico),
          useClass: Repository, // Mock del repositorio de Medico
        },
      ],
    }).compile();

    service = module.get<PacienteService>(PacienteService);
    pacienteRepository = module.get<Repository<Paciente>>(
      getRepositoryToken(Paciente),
    );
    medicoRepository = module.get<Repository<Medico>>(
      getRepositoryToken(Medico),
    );
  });

  // Prueba para el método create
  it('Debe crear un paciente correctamente', async () => {
    const paciente = {
      id: '1',
      nombre: 'Juan Pérez',
      genero: 'M',
      diagnosticos: [],
      medicos: [],
    };

    jest
      .spyOn(pacienteRepository, 'save')
      .mockResolvedValue(paciente as Paciente);

    const result = await service.create(paciente as Paciente);
    expect(result).toEqual(paciente);
  });

  it('Debe lanzar excepción si el nombre es menor a 3 caracteres', async () => {
    const paciente = {
      id: '2',
      nombre: 'Jo',
      genero: 'M',
      diagnosticos: [],
      medicos: [],
    };

    await expect(service.create(paciente as Paciente)).rejects.toThrow(
      new BadRequestException('El nombre debe tener al menos 3 caracteres'),
    );
  });

  // Prueba para el método findOne
  it('Debe encontrar un paciente por ID', async () => {
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

    const result = await service.findOne('1');
    expect(result).toEqual(paciente);
  });

  it('Debe lanzar excepción si no encuentra un paciente por ID', async () => {
    jest.spyOn(pacienteRepository, 'findOne').mockResolvedValue(null);

    await expect(service.findOne('1')).rejects.toThrow(
      new NotFoundException('El paciente con id 1 no existe'),
    );
  });

  // Prueba para el método delete
  it('Debe eliminar un paciente correctamente', async () => {
    const paciente = {
      id: '1',
      nombre: 'Juan Pérez',
      genero: 'M',
      diagnosticos: [],
      medicos: [],
    };

    jest.spyOn(service, 'findOne').mockResolvedValue(paciente as Paciente);
    jest.spyOn(pacienteRepository, 'delete').mockResolvedValue(undefined);

    await service.delete('1');
    expect(pacienteRepository.delete).toHaveBeenCalledWith('1');
  });

  it('Debe lanzar excepción al intentar eliminar un paciente con diagnósticos asociados', async () => {
    const paciente = {
      id: '1',
      nombre: 'Juan Pérez',
      genero: 'M',
      diagnosticos: [{ id: '1', nombre: 'Diagnóstico 1' }],
      medicos: [],
    };

    jest.spyOn(service, 'findOne').mockResolvedValue(paciente as Paciente);

    await expect(service.delete('1')).rejects.toThrow(
      new BadRequestException(
        'No se puede eliminar un paciente con diagnósticos asociados',
      ),
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

    jest.spyOn(service, 'findOne').mockResolvedValue(paciente as Paciente);
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

    jest.spyOn(service, 'findOne').mockResolvedValue(paciente as Paciente);
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

    jest.spyOn(service, 'findOne').mockResolvedValue(paciente as Paciente);
    jest.spyOn(medicoRepository, 'findOne').mockResolvedValue(medico as Medico);

    await expect(service.addMedicoToPaciente('1', '2')).rejects.toThrow(
      new BadRequestException(
        'Un paciente no puede tener más de 5 médicos asignados',
      ),
    );
  });
});
