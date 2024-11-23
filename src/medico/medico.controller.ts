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
import { MedicoService } from './medico.service';
import { Medico } from './medico.entity';

@Controller('medicos')
export class MedicoController {
  constructor(private readonly medicoService: MedicoService) {}

  @Get()
  async findAll(): Promise<Medico[]> {
    return this.medicoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Medico> {
    return this.medicoService.findOne(id);
  }

  @Post()
  async create(@Body() medico: Medico): Promise<Medico> {
    return this.medicoService.create(medico);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    return this.medicoService.delete(id);
  }
}
