import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Paciente } from '../paciente/paciente.entity';
import { Medico } from '../medico/medico.entity';

@Injectable()
export class PacienteMedicoService {
  constructor(
    @InjectRepository(Paciente)
    private readonly pacienteRepository: Repository<Paciente>,
    @InjectRepository(Medico)
    private readonly medicoRepository: Repository<Medico>,
  ) {}

  async addMedicoToPaciente(
    pacienteId: string,
    medicoId: string,
  ): Promise<void> {
    // Verificar si el paciente existe
    const paciente: Paciente = await this.pacienteRepository.findOne({
      where: { id: pacienteId },
      relations: ['medicos'],
    });
    if (!paciente) {
      throw new NotFoundException(`El paciente con id ${pacienteId} no existe`);
    }

    // Verificar si el médico existe
    const medico: Medico = await this.medicoRepository.findOne({
      where: { id: medicoId },
      relations: ['pacientes'],
    });
    if (!medico) {
      throw new NotFoundException(`El médico con id ${medicoId} no existe`);
    }

    // Verificar que el paciente no tenga más de 5 médicos asignados
    if (paciente.medicos.length >= 5) {
      throw new BadRequestException(
        'Un paciente no puede tener más de 5 médicos asignados',
      );
    }
    // Asignar el médico al paciente
    paciente.medicos.push(medico);
    await this.pacienteRepository.save(paciente);
  }
}
