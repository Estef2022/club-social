import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Socio } from '../../entities/socio.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../../../shared/errors/business-errors';
import { NotFoundEntityMessage } from '../../../shared/errors/error-messages';

@Injectable()
export class SociosService {
  constructor(
    @InjectRepository(Socio)
    private readonly socioRepository: Repository<Socio>,
  ) {}

  async findAll(): Promise<Socio[]> {
    return await this.socioRepository.find({
      relations: ['clubs'],
    });
  }

  async findOne(id: string): Promise<Socio> {
    const socio: Socio = await this.socioRepository.findOne({
      where: { id },
      relations: ['clubs'],
    });
    if (!socio)
      throw new BusinessLogicException(
        NotFoundEntityMessage('socio'),
        BusinessError.NOT_FOUND,
      );

    return socio;
  }

  async create(socio: Socio): Promise<Socio> {
    return await this.socioRepository.save(socio);
  }

  async update(id: string, socio: Socio): Promise<Socio> {
    const persistedSocio: Socio = await this.socioRepository.findOne({
      where: { id },
    });
    if (!persistedSocio)
      throw new BusinessLogicException(
        NotFoundEntityMessage('socio'),
        BusinessError.NOT_FOUND,
      );

    return await this.socioRepository.save({
      ...persistedSocio,
      ...socio,
    });
  }

  async delete(id: string) {
    const socio: Socio = await this.socioRepository.findOne({
      where: { id },
    });
    if (!socio)
      throw new BusinessLogicException(
        NotFoundEntityMessage('socio'),
        BusinessError.NOT_FOUND,
      );

    return await this.socioRepository.remove(socio);
  }
}
