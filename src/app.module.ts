import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Medico } from './medico/medico.entity/medico.entity';
import { Paciente } from './paciente/paciente.entity/paciente.entity';
import { Diagnostico } from './diagnostico/diagnostico.entity/diagnostico.entity';
import { MedicoModule } from './medico/medico.module';
import { PacienteModule } from './paciente/paciente.module';
import { DiagnosticoModule } from './diagnostico/diagnostico.module';

@Module({
  imports: [
    MedicoModule,
    PacienteModule,
    DiagnosticoModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5434,
      username: 'postgres',
      password: 'postgres',
      database: 'diagnosticos-medicos',
      entities: [Medico, Paciente, Diagnostico],
      synchronize: true,
      dropSchema: true,
      keepConnectionAlive: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
