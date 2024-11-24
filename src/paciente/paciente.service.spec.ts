import { Test, TestingModule } from '@nestjs/testing';
import { PacienteService } from './paciente.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Paciente } from './paciente.entity';
import { Medico } from '../medico/medico.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('PacienteService', () => {
  let service: PacienteService;
  let pacienteRepository: Repository<Paciente>;

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

  it('Debe obtener todos los pacientes correctamente', async () => {
    const pacientes = [
      {
        id: '1',
        nombre: 'Juan Pérez',
        genero: 'M',
        diagnosticos: [{ id: '1', nombre: 'Diagnóstico 1' }],
        medicos: [],
      },
      {
        id: '2',
        nombre: 'Ana Gómez',
        genero: 'F',
        diagnosticos: [],
        medicos: [],
      },
    ];

    jest
      .spyOn(pacienteRepository, 'find')
      .mockResolvedValue(pacientes as Paciente[]);

    const result = await service.findAll();
    expect(result).toEqual(pacientes);
    expect(pacienteRepository.find).toHaveBeenCalledWith({
      relations: ['diagnosticos'],
    });
  });
});
