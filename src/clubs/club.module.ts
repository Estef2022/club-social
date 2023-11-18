import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Club } from './entities/club.entity';
import { ClubsController } from './controllers/clubs/clubs.controller';
import { ClubsService } from './services/clubs/clubs.service';

@Module({
  imports: [TypeOrmModule.forFeature([Club])],
  providers: [ClubsService],
  controllers: [ClubsController],
})
export class ClubModule {}
