import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PacienteService } from './paciente.service';
import { Paciente } from './paciente.entity';

@Controller('pacientes')
export class PacienteController {
  constructor(private readonly pacienteService: PacienteService) {}

  @Get()
  async findAll(): Promise<Paciente[]> {
    return this.pacienteService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Paciente> {
    return this.pacienteService.findOne(id);
  }

  @Post()
  async create(@Body() paciente: Paciente): Promise<Paciente> {
    return this.pacienteService.create(paciente);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    return this.pacienteService.delete(id);
  }
}
