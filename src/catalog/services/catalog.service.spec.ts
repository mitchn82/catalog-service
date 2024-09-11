import { Test, TestingModule } from '@nestjs/testing';
import { CatalogService } from './catalog.service';
import { ServiceRepository } from '../repositories/service.repository';
import { Service } from '../entities/service.entity';
import { Principal } from 'src/auth/entities/principal.entity';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PageRequest } from 'src/pagination/dto/page-request.dto';
import { Page } from 'src/pagination/dto/page.dto';
import { PageMetadata } from 'src/pagination/dto/page-meta.dto';

describe('CatalogService', () => {
  let service: CatalogService;
  let repository: ServiceRepository;

  const mockRepositoryFactory = jest.fn(() => ({
    findOneWithVersionsCount: jest.fn((entity) => entity),
    findOne: jest.fn((entity) => entity),
    save: jest.fn((entity) => entity),
    merge: jest.fn((entity) => entity),
    delete: jest.fn((entity) => entity),
    existsBy: jest.fn((entity) => entity),
    findWithPages: jest.fn((entity) => entity),
    search: jest.fn((entity) => entity),
  }));

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatalogService,
        {
          provide: getRepositoryToken(ServiceRepository),
          useFactory: mockRepositoryFactory,
        },
      ],
    }).compile();

    service = module.get<CatalogService>(CatalogService);
    repository = module.get<ServiceRepository>(ServiceRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a service by id', async () => {
      const principal = new Principal('qwerty-asdfg-zxcvb', 'bob', []);

      const result = new Service();
      result.id = 1;
      result.userId = principal.id;
      result.description = 'description';

      jest
        .spyOn(repository, 'findOneWithVersionsCount')
        .mockResolvedValue(result);

      expect(await service.findOne(principal, result.id)).toBe(result);
    });

    it('should throw an exception if service not found', async () => {
      const principal = new Principal('qwerty-asdfg-zxcvb', 'bob', []);

      const result = new Service();
      result.id = 1;
      result.userId = principal.id;
      result.description = 'description';

      jest
        .spyOn(repository, 'findOneWithVersionsCount')
        .mockResolvedValue(null);

      await expect(service.findOne(principal, result.id)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw an exception if principal not found', async () => {
      const principal = new Principal('qwerty-asdfg-zxcvb', 'bob', []);

      const result = new Service();
      result.id = 1;
      result.userId = 'poiuy-lkjhg-mnbvc';
      result.description = 'description';

      jest
        .spyOn(repository, 'findOneWithVersionsCount')
        .mockResolvedValue(null);

      await expect(service.findOne(principal, result.id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create a new service', async () => {
      const principal = new Principal('qwerty-asdfg-zxcvb', 'bob', []);

      const result = new Service();
      result.id = 1;
      result.userId = principal.id;
      result.description = 'description';

      jest.spyOn(repository, 'save').mockResolvedValue(result);

      expect(await service.create(principal, result)).toBe(result);
    });
  });

  describe('update', () => {
    it('should update an existing service', async () => {
      const principal = new Principal('qwerty-asdfg-zxcvb', 'bob', []);

      const mock = new Service();
      mock.id = 1;
      mock.userId = principal.id;
      mock.description = 'description';

      const result = new Service();
      result.id = 1;
      result.userId = principal.id;
      result.description = 'new description';

      const request = new Service();
      request.description = 'new description';

      jest
        .spyOn(repository, 'findOneWithVersionsCount')
        .mockResolvedValue(mock);
      jest.spyOn(repository, 'save').mockResolvedValue(result);

      expect(await service.update(principal, mock.id, request)).toBe(result);
    });

    it('should throw an exception if service not found', async () => {
      const principal = new Principal('qwerty-asdfg-zxcvb', 'bob', []);

      const mock = new Service();
      mock.id = 1;
      mock.userId = principal.id;
      mock.description = 'description';

      const result = new Service();
      result.id = 1;
      result.userId = principal.id;
      result.description = 'new description';

      const request = new Service();
      request.description = 'new description';

      jest
        .spyOn(repository, 'findOneWithVersionsCount')
        .mockResolvedValue(null);

      await expect(service.update(principal, mock.id, request)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should delete an existing service', async () => {
      const principal = new Principal('qwerty-asdfg-zxcvb', 'bob', []);

      const result = new Service();
      result.id = 1;
      result.userId = principal.id;
      result.description = 'description';

      jest.spyOn(repository, 'existsBy').mockResolvedValue(true);
      jest.spyOn(repository, 'delete').mockResolvedValue(null);

      await expect(service.delete(principal, result.id)).resolves.not.toThrow();
    });

    it('should throw an exception if service not found', async () => {
      const principal = new Principal('qwerty-asdfg-zxcvb', 'bob', []);

      const result = new Service();
      result.id = 1;
      result.userId = principal.id;
      result.description = 'description';

      jest.spyOn(repository, 'existsBy').mockResolvedValue(false);
      jest.spyOn(repository, 'delete').mockResolvedValue(null);

      await expect(service.delete(principal, result.id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('search', () => {
    it('should search for services', async () => {
      const principal = new Principal('qwerty-asdfg-zxcvb', 'bob', []);

      const result = new Service();
      result.id = 1;
      result.userId = principal.id;
      result.description = 'description';

      const pageRequest = new PageRequest();
      const page = new Page<Service>(
        [result],
        new PageMetadata(pageRequest, 1),
      );

      const query = 'query';

      jest.spyOn(repository, 'search').mockResolvedValue(page);

      expect(await service.search(principal, query, pageRequest)).toBe(page);
    });
  });

  describe('find', () => {
    it('should find services', async () => {
      const principal = new Principal('qwerty-asdfg-zxcvb', 'bob', []);

      const result = new Service();
      result.id = 1;
      result.userId = principal.id;
      result.description = 'description';

      const pageRequest = new PageRequest();
      const page = new Page<Service>(
        [result],
        new PageMetadata(pageRequest, 1),
      );

      jest.spyOn(repository, 'findWithPages').mockResolvedValue(page);

      expect(await service.find(principal, pageRequest)).toBe(page);
    });
  });
});
