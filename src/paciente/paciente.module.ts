import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Paciente } from './paciente.entity/paciente.entity';
import { Medico } from 'src/medico/medico.entity/medico.entity';
import { PacienteService } from './paciente.service';

@Module({
  imports: [TypeOrmModule.forFeature([Paciente, Medico])],
  providers: [PacienteService],
  exports: [PacienteService],
})
export class PacienteModule {}
