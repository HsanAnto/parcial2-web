import {
  Controller,
  Post,
  Param,
  HttpCode,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import { PacienteMedicoService } from './paciente-medico.service';

@Controller('pacientes')
export class PacienteMedicoController {
  constructor(private readonly pacienteMedicoService: PacienteMedicoService) {}

  /**
   * Agregar un médico a un paciente
   * @param pacienteId - ID del paciente
   * @param medicoId - ID del médico
   */
  @Post(':pacienteId/medicos/:medicoId')
  @HttpCode(HttpStatus.CREATED)
  async addMedicoToPaciente(
    @Param('pacienteId') pacienteId: string,
    @Param('medicoId') medicoId: string,
  ): Promise<void> {
    return this.pacienteMedicoService.addMedicoToPaciente(pacienteId, medicoId);
  }

  @Delete(':pacienteId/medicos/:medicoId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeMedicoFromPaciente(
    @Param('pacienteId') pacienteId: string,
    @Param('medicoId') medicoId: string,
  ): Promise<void> {
    return this.pacienteMedicoService.removeMedicoFromPaciente(
      pacienteId,
      medicoId,
    );
  }
}
