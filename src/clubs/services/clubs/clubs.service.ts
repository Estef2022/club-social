import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Club } from 'src/clubs/entities/club.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../../../shared/errors/business-errors';
import { NotFoundEntityMessage } from '../../../shared/errors/error-messages';

@Injectable()
export class ClubsService {
  constructor(
    @InjectRepository(Club)
    private readonly clubRepository: Repository<Club>,
  ) {}

  async findOne(id: string): Promise<Club> {
    const club: Club = await this.clubRepository.findOne({
      where: { id },
      relations: ['socio'],
    });
    if (!club)
      throw new BusinessLogicException(
        NotFoundEntityMessage('club'),
        BusinessError.NOT_FOUND,
      );

    return club;
  }

  async findAll(): Promise<Club[]> {
    return await this.clubRepository.find({
      relations: ['socio'],
    });
  }

  async create(club: Club): Promise<Club> {
    return await this.clubRepository.save(club);
  }

  async update(id: string, club: Club): Promise<Club> {
    const persistedClub: Club = await this.clubRepository.findOne({
      where: { id },
    });
    if (!persistedClub)
      throw new BusinessLogicException(
        NotFoundEntityMessage('club'),
        BusinessError.NOT_FOUND,
      );

    return await this.clubRepository.save({
      ...persistedClub,
      ...club,
    });
  }

  async delete(id: string) {
    const club: Club = await this.clubRepository.findOne({
      where: { id },
    });
    if (!club)
      throw new BusinessLogicException(
        NotFoundEntityMessage('club'),
        BusinessError.NOT_FOUND,
      );

    await this.clubRepository.remove(club);
  }
}
