import { Test, TestingModule } from '@nestjs/testing';
import { ClubsService } from './clubs.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Club } from '../../entities/club.entity';
import { TypeOrmTestingConfig } from '../../../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { NotFoundEntityMessage } from '../../../shared/errors/error-messages';

describe('ClubsService', () => {
  let service: ClubsService;
  let clubsRepository: Repository<Club>;
  let clubsList: Club[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ClubsService],
    }).compile();

    service = module.get<ClubsService>(ClubsService);
    clubsRepository = module.get<Repository<Club>>(getRepositoryToken(Club));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    await clubsRepository.clear();

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
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all clubs', async () => {
    const clubs: Club[] = await service.findAll();
    expect(clubs).not.toBeNull();
    expect(clubs).toHaveLength(clubsList.length);
  });

  it('findOne should return a club by id', async () => {
    const storedClub: Club = clubsList[0];
    const club: Club = await service.findOne(storedClub.id);
    expect(club).not.toBeNull();
    expect(club.name).toEqual(storedClub.name);
  });

  it('findOne should throw an exception for an invalid club', async () => {
    await expect(() => {
      return service.findOne('00000000-0000-0000-0000-000000000000');
    }).rejects.toHaveProperty('message', NotFoundEntityMessage('club'));
  });

  it('create should return a new club', async () => {
    const club: Club = {
      id: faker.string.uuid(),
      name: faker.word.adjective(),
      fechaFundacion: '1992-12-04',
      imagen: faker.image.abstract(1234, 2345),
      descripcion: faker.commerce.productDescription(),
      socios: [],
    };

    const newClub: Club = await service.create(club);
    expect(newClub).not.toBeNull();

    const storedClub: Club = await clubsRepository.findOne({
      where: { id: newClub.id },
    });
    expect(storedClub).not.toBeNull();
    expect(storedClub.name).toEqual(newClub.name);
  });

  it('update should modify a club', async () => {
    const club: Club = clubsList[0];
    club.name = 'New name';
    const updatedClub: Club = await service.update(club.id, club);
    expect(updatedClub).not.toBeNull();
    const storedClub: Club = await clubsRepository.findOne({
      where: { id: club.id },
    });
    expect(storedClub).not.toBeNull();
    expect(storedClub.name).toEqual(club.name);
  });

  it('update should throw an exception for an invalid club', async () => {
    let club: Club = clubsList[0];
    club = {
      ...club,
      name: 'New bad name',
      fechaFundacion: '1992-12-04',
      imagen: faker.image.abstract(1234, 2345),
      descripcion: faker.commerce.productDescription(),
      socios: [],
    };
    await expect(() =>
      service.update('00000000-0000-0000-0000-000000000000', club),
    ).rejects.toHaveProperty('message', NotFoundEntityMessage('club'));
  });

  it('delete should remove a club', async () => {
    const club: Club = clubsList[0];
    await service.delete(club.id);
    const deletedClub: Club = await clubsRepository.findOne({
      where: { id: club.id },
    });
    expect(deletedClub).toBeNull();
  });

  it('delete should throw an exception for an invalid club', async () => {
    await expect(() =>
      service.delete('00000000-0000-0000-0000-000000000000'),
    ).rejects.toHaveProperty('message', NotFoundEntityMessage('club'));
  });
});
