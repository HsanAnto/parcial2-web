import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Paciente } from './paciente.entity/paciente.entity';
import { Medico } from '../medico/medico.entity/medico.entity';

@Injectable()
export class PacienteService {
  constructor(
    @InjectRepository(Paciente)
    private readonly pacienteRepository: Repository<Paciente>,
    @InjectRepository(Medico)
    private readonly medicoRepository: Repository<Medico>,
  ) {}

  async create(paciente: Paciente): Promise<Paciente> {
    if (paciente.nombre.length < 3) {
      throw new BadRequestException(
        'El nombre debe tener al menos 3 caracteres',
      );
    }
    return this.pacienteRepository.save(paciente);
  }

  async findOne(id: string): Promise<Paciente> {
    const paciente = await this.pacienteRepository.findOne({
      where: { id },
      relations: ['diagnosticos'],
    });
    if (!paciente) {
      throw new NotFoundException(`El paciente con id ${id} no existe`);
    }
    return paciente;
  }

  async findAll(): Promise<Paciente[]> {
    return this.pacienteRepository.find({ relations: ['diagnosticos'] });
  }

  async delete(id: string): Promise<void> {
    const paciente = await this.findOne(id);
    if (paciente.diagnosticos && paciente.diagnosticos.length > 0) {
      throw new BadRequestException(
        'No se puede eliminar un paciente con diagnósticos asociados',
      );
    }
    await this.pacienteRepository.delete(id);
  }

  async addMedicoToPaciente(
    pacienteId: string,
    medicoId: string,
  ): Promise<void> {
    const paciente = await this.findOne(pacienteId);
    const medico = await this.medicoRepository.findOne({
      where: { id: medicoId },
      relations: ['pacientes'],
    });

    if (!medico) {
      throw new NotFoundException(`El médico con id ${medicoId} no existe`);
    }

    if (paciente.medicos.length >= 5) {
      throw new BadRequestException(
        'Un paciente no puede tener más de 5 médicos asignados',
      );
    }

    paciente.medicos.push(medico);
    await this.pacienteRepository.save(paciente);
  }
}
