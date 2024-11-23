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
import { DiagnosticoService } from './diagnostico.service';
import { Diagnostico } from './diagnostico.entity';

@Controller('diagnosticos')
export class DiagnosticoController {
  constructor(private readonly diagnosticoService: DiagnosticoService) {}

  @Get()
  async findAll(): Promise<Diagnostico[]> {
    return this.diagnosticoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Diagnostico> {
    return this.diagnosticoService.findOne(id);
  }

  @Post()
  async create(@Body() diagnostico: Diagnostico): Promise<Diagnostico> {
    return this.diagnosticoService.create(diagnostico);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    return this.diagnosticoService.delete(id);
  }
}
