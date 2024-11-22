import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Diagnostico } from './diagnostico.entity/diagnostico.entity';
import { Paciente } from 'src/paciente/paciente.entity/paciente.entity';
import { DiagnosticoService } from './diagnostico.service';

@Module({
  imports: [TypeOrmModule.forFeature([Diagnostico, Paciente])],
  providers: [DiagnosticoService],
  exports: [DiagnosticoService],
})
export class DiagnosticoModule {}
