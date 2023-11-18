import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../../../shared/interceptors/interceptors';
import { ClubsService } from '../../../clubs/services/clubs/clubs.service';
import { plainToInstance } from 'class-transformer';
import { ClubDto } from '../../../clubs/dto/club.dto';
import { Club } from '../../entities/club.entity';

@UseInterceptors(BusinessErrorsInterceptor)
@Controller('clubs')
export class ClubsController {
  constructor(private readonly clubsService: ClubsService) {}

  @Get()
  async findAll() {
    return await this.clubsService.findAll();
  }

  @Get(':clubId')
  async findOne(@Param('clubId') clubId: string) {
    return await this.clubsService.findOne(clubId);
  }

  @Post()
  async create(@Body() clubDto: ClubDto) {
    const club: Club = plainToInstance(Club, clubDto);
    return await this.clubsService.create(club);
  }

  @Put(':clubId')
  async update(@Param('clubId') clubId: string, @Body() clubDto: ClubDto) {
    const club: Club = plainToInstance(Club, clubDto);
    return await this.clubsService.update(clubId, club);
  }

  @Delete(':clubId')
  @HttpCode(204)
  async delete(@Param('clubId') clubId: string) {
    return await this.clubsService.delete(clubId);
  }
}
