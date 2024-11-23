import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Diagnostico } from './diagnostico.entity';

@Injectable()
export class DiagnosticoService {
  constructor(
    @InjectRepository(Diagnostico)
    private readonly diagnosticoRepository: Repository<Diagnostico>,
  ) {}

  async create(diagnostico: Diagnostico): Promise<Diagnostico> {
    if (diagnostico.descripcion.length > 200) {
      throw new BadRequestException(
        'La descripción no puede superar los 200 caracteres',
      );
    }
    return this.diagnosticoRepository.save(diagnostico);
  }

  async findOne(id: string): Promise<Diagnostico> {
    const diagnostico = await this.diagnosticoRepository.findOne({
      where: { id },
      relations: ['paciente'],
    });
    if (!diagnostico) {
      throw new NotFoundException(`El diagnóstico con id ${id} no existe`);
    }
    return diagnostico;
  }

  async findAll(): Promise<Diagnostico[]> {
    return this.diagnosticoRepository.find({ relations: ['paciente'] });
  }

  async delete(id: string): Promise<void> {
    const diagnostico = await this.findOne(id);
    await this.diagnosticoRepository.delete(diagnostico.id);
  }
}
