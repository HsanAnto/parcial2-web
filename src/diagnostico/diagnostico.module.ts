import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Diagnostico } from './diagnostico.entity';
import { DiagnosticoService } from './diagnostico.service';
import { DiagnosticoController } from './diagnostico.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Diagnostico])],
  providers: [DiagnosticoService],
  controllers: [DiagnosticoController],
})
export class DiagnosticoModule {}
