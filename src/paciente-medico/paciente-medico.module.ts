import { Module } from '@nestjs/common';
import { PacienteMedicoService } from './paciente-medico.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Paciente } from '../paciente/paciente.entity';
import { Medico } from '../medico/medico.entity';
import { PacienteMedicoController } from './paciente-medico.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Paciente, Medico])],
  providers: [PacienteMedicoService],
  controllers: [PacienteMedicoController],
})
export class PacienteMedicoModule {}
