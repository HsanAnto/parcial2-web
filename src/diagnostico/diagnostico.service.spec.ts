import { Test, TestingModule } from '@nestjs/testing';
import { DiagnosticoService } from './diagnostico.service';
import { Repository } from 'typeorm';
import { Diagnostico } from './diagnostico.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('DiagnosticoService', () => {
  let service: DiagnosticoService;
  let diagnosticoRepository: Repository<Diagnostico>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DiagnosticoService,
        {
          provide: getRepositoryToken(Diagnostico),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<DiagnosticoService>(DiagnosticoService);
    diagnosticoRepository = module.get<Repository<Diagnostico>>(
      getRepositoryToken(Diagnostico),
    );
  });

  it('Debe crear un diagnóstico correctamente', async () => {
    const diagnostico = {
      id: '1',
      descripcion: 'Diagnóstico inicial',
      paciente: null,
    };

    jest
      .spyOn(diagnosticoRepository, 'save')
      .mockResolvedValue(diagnostico as Diagnostico);

    const result = await service.create(diagnostico as Diagnostico);
    expect(result).toEqual(diagnostico);
    expect(diagnosticoRepository.save).toHaveBeenCalledWith(diagnostico);
  });

  it('Debe lanzar una excepción si la descripción supera los 200 caracteres', async () => {
    const diagnostico = {
      id: '1',
      descripcion: 'a'.repeat(201), // Más de 200 caracteres
      paciente: null,
    };

    await expect(service.create(diagnostico as Diagnostico)).rejects.toThrow(
      new BadRequestException(
        'La descripción no puede superar los 200 caracteres',
      ),
    );
  });

  it('Debe retornar un diagnóstico por su ID', async () => {
    const diagnostico = {
      id: '1',
      descripcion: 'Diagnóstico inicial',
      paciente: null,
    };

    jest
      .spyOn(diagnosticoRepository, 'findOne')
      .mockResolvedValue(diagnostico as Diagnostico);

    const result = await service.findOne('1');
    expect(result).toEqual(diagnostico);
    expect(diagnosticoRepository.findOne).toHaveBeenCalledWith({
      where: { id: '1' },
      relations: ['paciente'],
    });
  });

  it('Debe lanzar una excepción si no se encuentra un diagnóstico por su ID', async () => {
    jest.spyOn(diagnosticoRepository, 'findOne').mockResolvedValue(null);

    await expect(service.findOne('1')).rejects.toThrow(
      new NotFoundException(`El diagnóstico con id 1 no existe`),
    );
  });

  it('Debe retornar todos los diagnósticos', async () => {
    const diagnosticos = [
      {
        id: '1',
        descripcion: 'Diagnóstico 1',
        paciente: null,
      },
      {
        id: '2',
        descripcion: 'Diagnóstico 2',
        paciente: null,
      },
    ];

    jest
      .spyOn(diagnosticoRepository, 'find')
      .mockResolvedValue(diagnosticos as Diagnostico[]);

    const result = await service.findAll();
    expect(result).toEqual(diagnosticos);
    expect(diagnosticoRepository.find).toHaveBeenCalledWith({
      relations: ['paciente'],
    });
  });

  it('Debe eliminar un diagnóstico correctamente', async () => {
    const diagnostico = {
      id: '1',
      descripcion: 'Diagnóstico inicial',
      paciente: null,
    };

    jest
      .spyOn(service, 'findOne')
      .mockResolvedValue(diagnostico as Diagnostico);
    jest.spyOn(diagnosticoRepository, 'delete').mockResolvedValue(undefined);

    await service.delete('1');
    expect(diagnosticoRepository.delete).toHaveBeenCalledWith('1');
  });

  it('Debe lanzar una excepción al intentar eliminar un diagnóstico inexistente', async () => {
    jest
      .spyOn(service, 'findOne')
      .mockRejectedValue(
        new NotFoundException(`El diagnóstico con id 1 no existe`),
      );

    await expect(service.delete('1')).rejects.toThrow(
      new NotFoundException(`El diagnóstico con id 1 no existe`),
    );
  });
});
