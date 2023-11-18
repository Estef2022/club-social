import { Test, TestingModule } from '@nestjs/testing';
import { SociosService } from './socios.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Socio } from '../../entities/socio.entity';
import { TypeOrmTestingConfig } from '../../../shared/testing-utils/typeorm-testing-config';

import { faker } from '@faker-js/faker';
import { NotFoundEntityMessage } from '../../../shared/errors/error-messages';

describe('SociosService', () => {
  let service: SociosService;
  let socioRepository: Repository<Socio>;
  let sociosList: Socio[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SociosService],
    }).compile();

    service = module.get<SociosService>(SociosService);
    socioRepository = module.get<Repository<Socio>>(getRepositoryToken(Socio));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await socioRepository.clear();
    sociosList = [];
    for (let i = 0; i < 5; i++) {
      const socio: Socio = await socioRepository.save({
        id: faker.string.uuid(),
        name: faker.commerce.productAdjective(),
      });
      sociosList.push(socio);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all socios', async () => {
    const socios: Socio[] = await service.findAll();
    expect(socios).not.toBeNull();
    expect(socios).toHaveLength(sociosList.length);
  });

  it('findOne should return a socio by id', async () => {
    const storedSocio: Socio = sociosList[0];
    const socio: Socio = await service.findOne(storedSocio.id);
    expect(socio).not.toBeNull();
    expect(socio.userName).toEqual(storedSocio.userName);
  });

  it('findOne should throw an exception for an invalid socio', async () => {
    await expect(() =>
      service.findOne('00000000-0000-0000-0000-000000000000'),
    ).rejects.toHaveProperty('message', NotFoundEntityMessage('socio'));
  });

  it('create should return a new socio', async () => {
    const socio: Socio = {
      id: faker.string.uuid(),
      userName: faker.commerce.productAdjective(),
      clubs: [],
      email: faker.string.uuid(),
      fechaNacimiento: '1992-11-05',
    };

    const newSocio: Socio = await service.create(socio);
    expect(newSocio).not.toBeNull();

    const storedSocio: Socio = await socioRepository.findOne({
      where: { id: newSocio.id },
    });
    expect(storedSocio).not.toBeNull();
    expect(storedSocio.userName).toEqual(newSocio.userName);
  });

  it('update should modify a socio', async () => {
    const socio: Socio = sociosList[0];
    socio.userName = 'New name';
    const updatedSocio: Socio = await service.update(socio.id, socio);
    expect(updatedSocio).not.toBeNull();
    const storedSocio: Socio = await socioRepository.findOne({
      where: { id: socio.id },
    });
    expect(storedSocio).not.toBeNull();
    expect(storedSocio.userName).toEqual(socio.userName);
  });

  it('update should throw an exception for an invalid socio', async () => {
    let socio: Socio = sociosList[0];
    socio = {
      ...socio,
      userName: 'New name',
      clubs: [],
    };
    await expect(() =>
      service.update('00000000-0000-0000-0000-000000000000', socio),
    ).rejects.toHaveProperty('message', NotFoundEntityMessage('socio'));
  });

  it('delete should remove a socio', async () => {
    const socio: Socio = sociosList[0];
    await service.delete(socio.id);
    const deletedSocio: Socio = await socioRepository.findOne({
      where: { id: socio.id },
    });
    expect(deletedSocio).toBeNull();
  });

  it('delete should throw an exception for an invalid socio', async () => {
    await expect(() =>
      service.delete('00000000-0000-0000-0000-000000000000'),
    ).rejects.toHaveProperty('message', NotFoundEntityMessage('socio'));
  });
});
