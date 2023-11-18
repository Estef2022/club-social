import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Club } from 'src/clubs/entities/club.entity';

@Entity()
export class Socio {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userName: string;

  @Column()
  email: string;

  @Column()
  fechaNacimiento: string;

  @ManyToMany(() => Club, (club) => club.socios)
  clubs: Club[];
}
