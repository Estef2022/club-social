import { TypeOrmModule } from '@nestjs/typeorm';
import { Socio } from '../../socios/entities/socio.entity';
import { Club } from '../../clubs/entities/club.entity';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [Socio, Club],
    synchronize: true,
    keepConnectionAlive: true,
  }),
  TypeOrmModule.forFeature([Socio, Club]),
];
