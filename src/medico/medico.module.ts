import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Medico } from './medico.entity';
import { MedicoService } from './medico.service';
import { MedicoController } from './medico.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Medico])],
  providers: [MedicoService],
  controllers: [MedicoController],
})
export class MedicoModule {}
