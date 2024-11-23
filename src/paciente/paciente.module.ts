import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Paciente } from './paciente.entity';
import { PacienteService } from './paciente.service';
import { PacienteController } from './paciente.controller';
import { Medico } from 'src/medico/medico.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Paciente, Medico])],
  providers: [PacienteService],
  controllers: [PacienteController],
})
export class PacienteModule {}
