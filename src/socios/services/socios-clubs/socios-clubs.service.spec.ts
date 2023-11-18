import { Test, TestingModule } from '@nestjs/testing';
import { SociosClubsService } from './socios-clubs';
import { TypeOrmTestingConfig } from '../../../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Club } from '../../../clubs/entities/club.entity';
import { Socio } from '../../entities/socio.entity';
import { faker } from '@faker-js/faker';
import { NotFoundEntityMessage } from '../../../shared/errors/error-messages';

describe('SociosClubsService', () => {
  let service: SociosClubsService;
  let sociosRepository: Repository<Socio>;
  let clubsRepository: Repository<Club>;
  let clubsList: Club[];
  let socio: Socio;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SociosClubsService],
    }).compile();

    service = module.get<SociosClubsService>(SociosClubsService);
    sociosRepository = module.get<Repository<Socio>>(getRepositoryToken(Socio));
    clubsRepository = module.get<Repository<Club>>(getRepositoryToken(Club));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await clubsRepository.clear();
    await sociosRepository.clear();

    clubsList = [];
    for (let i = 0; i < 5; i++) {
      const club: Club = await clubsRepository.save({
        id: faker.string.uuid(),
        name: faker.word.adjective(),
        fechaFundacion: '1992-12-04',
        imagen: faker.image.abstract(1234, 2345),
        description: faker.commerce.productDescription(),
        socios: [],
      });
      clubsList.push(club);
    }

    socio = await sociosRepository.save({
      id: faker.string.uuid(),
      userNamename: faker.word.adjective(),
      email: faker.internet.email(),
      fechaNacimiento: '1992-04-10',
      clubs: clubsList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addClubToSocio should add an club to a socio', async () => {
    const newClub: Club = await clubsRepository.save({
      id: faker.string.uuid(),
      name: faker.word.adjective(),
      fechaFundacion: '1992-12-04',
      imagen: faker.image.abstract(1234, 2345),
      description: faker.commerce.productDescription(),
      socios: [],
    });

    const newSocio: Socio = await sociosRepository.save({
      id: faker.string.uuid(),
      userNamename: faker.word.adjective(),
      email: faker.internet.email(),
      fechaNacimiento: '1992-04-10',
      clubs: [],
    });

    const result: Socio = await service.addClubToSocio(newSocio.id, newClub.id);

    expect(result.clubs.length).toBe(1);
    expect(result.clubs[0]).not.toBeNull();
    expect(result.clubs[0].name).toBe(newClub.name);
    expect(result.clubs[0].fechaFundacion).toBe(newClub.fechaFundacion);
    expect(result.clubs[0].imagen).toBe(newClub.imagen);
    expect(result.clubs[0].descripcion).toBe(newClub.descripcion);
  });

  it('addClubToSocio should thrown exception for an invalid club', async () => {
    const newSocio: Socio = await sociosRepository.save({
      id: faker.string.uuid(),
      userName: faker.word.adjective(),
      email: faker.internet.email(),
      fechaNacimiento: '1992-04-10',
      clubs: [],
    });

    await expect(() =>
      service.addClubToSocio(newSocio.id, '0'),
    ).rejects.toHaveProperty('message', NotFoundEntityMessage('club'));
  });

  it('addClubToSocio should throw an exception for an invalid socio', async () => {
    const newClub: Club = await clubsRepository.save({
      id: faker.string.uuid(),
      name: faker.word.adjective(),
      fechaFundacion: '1992-12-04',
      imagen: faker.image.abstract(1234, 2345),
      description: faker.commerce.productDescription(),
      socios: [],
    });

    await expect(() =>
      service.addClubToSocio('0', newClub.id),
    ).rejects.toHaveProperty('message', NotFoundEntityMessage('socio'));
  });

  it('findClubsBySocioId should return clubs by socio', async () => {
    const clubs: Club[] = await service.findClubsBySocioId(socio.id);
    expect(clubs.length).toBe(5);
  });

  it('findClubsBySocioId should throw an exception for an invalid socio', async () => {
    await expect(() => service.findClubsBySocioId('0')).rejects.toHaveProperty(
      'message',
      NotFoundEntityMessage('socio'),
    );
  });

  it('deleteClubOfSocio should remove an club from a socio', async () => {
    const club: Club = clubsList[0];

    await service.deleteClubFromSocio(socio.id, club.id);

    const storedSocio: Socio = await sociosRepository.findOne({
      where: { id: socio.id },
      relations: ['clubs'],
    });
    const deletedClub: Club = storedSocio.clubs.find((a) => a.id === club.id);

    expect(deletedClub).toBeUndefined();
  });

  it('deleteClubOfSocio should thrown an exception for an invalid club', async () => {
    await expect(() =>
      service.deleteClubFromSocio(socio.id, '0'),
    ).rejects.toHaveProperty('message', NotFoundEntityMessage('club'));
  });

  it('deleteClubOfSocio should thrown an exception for an invalid socio', async () => {
    const club: Club = clubsList[0];
    await expect(() =>
      service.deleteClubFromSocio('0', club.id),
    ).rejects.toHaveProperty('message', NotFoundEntityMessage('socio'));
  });

  it('deleteClubOfSocio should thrown an exception for an non associated club', async () => {
    const newClub: Club = await clubsRepository.save({
      id: faker.string.uuid(),
      name: faker.word.adjective(),
      fechaFundacion: '1992-12-04',
      imagen: faker.image.abstract(1234, 2345),
      description: faker.commerce.productDescription(),
      socios: [],
    });

    await expect(() =>
      service.deleteClubFromSocio(socio.id, newClub.id),
    ).rejects.toHaveProperty(
      'message',
      'The club with the given id is not associated to the socio',
    );
  });
});
