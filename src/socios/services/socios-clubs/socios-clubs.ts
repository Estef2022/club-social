import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Club } from '../../../clubs/entities/club.entity';
import { Socio } from '../../entities/socio.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../../../shared/errors/business-errors';
import { NotFoundEntityMessage } from '../../../shared/errors/error-messages';

@Injectable()
export class SociosClubsService {
  constructor(
    @InjectRepository(Socio)
    private readonly sociosRepository: Repository<Socio>,

    @InjectRepository(Club)
    private readonly clubsRepository: Repository<Club>,
  ) {}

  async addClubToSocio(socioId: string, clubId: string): Promise<Socio> {
    const socio: Socio = await this.sociosRepository.findOne({
      where: { id: socioId },
      relations: ['clubs'],
    });

    if (!socio)
      throw new BusinessLogicException(
        NotFoundEntityMessage('socio'),
        BusinessError.NOT_FOUND,
      );

    const club: Club = await this.clubsRepository.findOne({
      where: { id: clubId },
    });
    if (!club)
      throw new BusinessLogicException(
        NotFoundEntityMessage('club'),
        BusinessError.NOT_FOUND,
      );

    socio.clubs = [...socio.clubs, club];
    return await this.sociosRepository.save(socio);
  }

  async findClubsBySocioId(socioId: string): Promise<Club[]> {
    const socio: Socio = await this.sociosRepository.findOne({
      where: { id: socioId },
      relations: ['clubs'],
    });
    if (!socio)
      throw new BusinessLogicException(
        NotFoundEntityMessage('socio'),
        BusinessError.NOT_FOUND,
      );

    return socio.clubs;
  }

  async deleteClubFromSocio(socioId: string, clubId: string) {
    const club: Club = await this.clubsRepository.findOne({
      where: { id: clubId },
    });
    if (!club)
      throw new BusinessLogicException(
        NotFoundEntityMessage('club'),
        BusinessError.NOT_FOUND,
      );

    const socio: Socio = await this.sociosRepository.findOne({
      where: { id: socioId },
      relations: ['clubs'],
    });

    if (!socio)
      throw new BusinessLogicException(
        NotFoundEntityMessage('socio'),
        BusinessError.NOT_FOUND,
      );

    const recipeClub: Club = socio.clubs.find((e) => e.id === club.id);

    if (!recipeClub)
      throw new BusinessLogicException(
        'The club with the given id is not associated to the socio',
        BusinessError.PRECONDITION_FAILED,
      );

    socio.clubs = socio.clubs.filter((e) => e.id !== clubId);
    await this.sociosRepository.save(socio);
  }
}
