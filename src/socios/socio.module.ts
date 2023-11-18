import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Socio } from './entities/socio.entity';
import { SociosService } from './services/socios/socios.service';
import { SociosClubsService } from './services/socios-clubs/socios-clubs';
import { SociosController } from './controllers/socios/socios.controller';
import { SociosClubsController } from './controllers/socios-clubs/socios-clubs.controller';
import { Club } from 'src/clubs/entities/club.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Socio, Club])],
  providers: [SociosService, SociosClubsService],
  controllers: [SociosController, SociosClubsController],
})
export class SocioModule {}
