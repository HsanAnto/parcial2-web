import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Paciente } from '../paciente/paciente.entity';

@Entity()
export class Medico {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  especialidad: string;

  @Column()
  telefono: string;

  @ManyToMany(() => Paciente, (paciente) => paciente.medicos)
  @JoinTable()
  pacientes: Paciente[];
}
