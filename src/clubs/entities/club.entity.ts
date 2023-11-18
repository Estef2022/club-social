import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Socio } from '../../socios/entities/socio.entity';

@Entity()
export class Club {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  fechaFundacion: string;

  @Column()
  imagen: string;

  @Column({ length: 100 })
  descripcion: string;

  @ManyToMany(() => Socio, (socio) => socio.clubs)
  socios: Socio[];
}
