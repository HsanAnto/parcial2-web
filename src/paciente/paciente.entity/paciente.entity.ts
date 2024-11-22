import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { Medico } from '../../medico/medico.entity/medico.entity';
import { Diagnostico } from '../../diagnostico/diagnostico.entity/diagnostico.entity';

@Entity()
export class Paciente {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  genero: string;

  @ManyToMany(() => Medico, (medico) => medico.pacientes)
  medicos: Medico[];

  @OneToMany(() => Diagnostico, (diagnostico) => diagnostico.paciente)
  diagnosticos: Diagnostico[];
}
