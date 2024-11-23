import { Test, TestingModule } from '@nestjs/testing';
import { MedicoService } from './medico.service';
import { Repository } from 'typeorm';
import { Medico } from './medico.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('MedicoService', () => {
  let service: MedicoService;
  let medicoRepository: Repository<Medico>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MedicoService,
        {
          provide: getRepositoryToken(Medico),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<MedicoService>(MedicoService);
    medicoRepository = module.get<Repository<Medico>>(
      getRepositoryToken(Medico),
    );
  });

  it('Debe crear un médico correctamente', async () => {
    const medico = {
      id: '1',
      nombre: 'Dr. López',
      especialidad: 'Cardiología',
      telefono: '123456789',
      pacientes: [],
    };

    jest.spyOn(medicoRepository, 'save').mockResolvedValue(medico as Medico);

    const result = await service.create(medico as Medico);
    expect(result).toEqual(medico);
    expect(medicoRepository.save).toHaveBeenCalledWith(medico);
  });

  it('Debe lanzar una excepción si el nombre o la especialidad están vacíos', async () => {
    const medico = {
      id: '1',
      nombre: '',
      especialidad: '',
      telefono: '123456789',
      pacientes: [],
    };

    await expect(service.create(medico as Medico)).rejects.toThrow(
      new BadRequestException(
        'El nombre y la especialidad no pueden estar vacíos',
      ),
    );
  });

  it('Debe retornar un médico por su ID', async () => {
    const medico = {
      id: '1',
      nombre: 'Dr. López',
      especialidad: 'Cardiología',
      telefono: '123456789',
      pacientes: [],
    };

    jest.spyOn(medicoRepository, 'findOne').mockResolvedValue(medico as Medico);

    const result = await service.findOne('1');
    expect(result).toEqual(medico);
    expect(medicoRepository.findOne).toHaveBeenCalledWith({
      where: { id: '1' },
      relations: ['pacientes'],
    });
  });

  it('Debe lanzar una excepción si no se encuentra un médico por su ID', async () => {
    jest.spyOn(medicoRepository, 'findOne').mockResolvedValue(null);

    await expect(service.findOne('1')).rejects.toThrow(
      new NotFoundException(`El médico con id 1 no existe`),
    );
  });

  it('Debe retornar todos los médicos', async () => {
    const medicos = [
      {
        id: '1',
        nombre: 'Dr. López',
        especialidad: 'Cardiología',
        telefono: '123456789',
        pacientes: [],
      },
      {
        id: '2',
        nombre: 'Dr. Pérez',
        especialidad: 'Neurología',
        telefono: '987654321',
        pacientes: [],
      },
    ];

    jest.spyOn(medicoRepository, 'find').mockResolvedValue(medicos as Medico[]);

    const result = await service.findAll();
    expect(result).toEqual(medicos);
    expect(medicoRepository.find).toHaveBeenCalledWith({
      relations: ['pacientes'],
    });
  });

  it('Debe eliminar un médico sin pacientes asociados', async () => {
    const medico = {
      id: '1',
      nombre: 'Dr. López',
      especialidad: 'Cardiología',
      telefono: '123456789',
      pacientes: [],
    };

    jest.spyOn(service, 'findOne').mockResolvedValue(medico as Medico);
    jest.spyOn(medicoRepository, 'delete').mockResolvedValue(undefined);

    await service.delete('1');
    expect(medicoRepository.delete).toHaveBeenCalledWith('1');
  });

  it('Debe lanzar una excepción al intentar eliminar un médico con pacientes asociados', async () => {
    const medico = {
      id: '1',
      nombre: 'Dr. López',
      especialidad: 'Cardiología',
      telefono: '123456789',
      pacientes: [{ id: '1', nombre: 'Juan Pérez', genero: 'M' }],
    };

    jest.spyOn(service, 'findOne').mockResolvedValue(medico as Medico);

    await expect(service.delete('1')).rejects.toThrow(
      new BadRequestException(
        'No se puede eliminar un médico con pacientes asociados',
      ),
    );
  });
});
