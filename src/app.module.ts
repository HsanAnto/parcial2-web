import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Medico } from './medico/medico.entity';
import { Paciente } from './paciente/paciente.entity';
import { Diagnostico } from './diagnostico/diagnostico.entity';
import { MedicoModule } from './medico/medico.module';
import { PacienteModule } from './paciente/paciente.module';
import { DiagnosticoModule } from './diagnostico/diagnostico.module';
import { PacienteMedicoModule } from './paciente-medico/paciente-medico.module';

@Module({
  imports: [
    MedicoModule,
    PacienteModule,
    DiagnosticoModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'diagnosticos-medicos',
      entities: [Medico, Paciente, Diagnostico],
      synchronize: true,
      dropSchema: true,
      keepConnectionAlive: true,
    }),
    PacienteMedicoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
