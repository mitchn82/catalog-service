import { Test, TestingModule } from '@nestjs/testing';
import { VersionService } from './version.service';
import { ServiceRepository } from '../repositories/service.repository';
import { VersionRepository } from '../repositories/version.repository';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Version } from '../entities/version.entity';
import { Service } from '../entities/service.entity';
import { Principal } from 'src/auth/entities/principal.entity';
import { NotFoundException } from '@nestjs/common';

describe('VersionService', () => {
  let versionService: VersionService;
  let serviceRepo: ServiceRepository;
  let versionRepo: VersionRepository;

  const mockRepositoryFactory = jest.fn(() => ({
    findOneWithVersionsCount: jest.fn((entity) => entity),
    findOne: jest.fn((entity) => entity),
    save: jest.fn((entity) => entity),
    merge: jest.fn((entity) => entity),
    delete: jest.fn((entity) => entity),
    existsBy: jest.fn((entity) => entity),
    findWithPages: jest.fn((entity) => entity),
    search: jest.fn((entity) => entity),
    existsByPrincipal: jest.fn((entity) => entity),
    findAllByServiceId: jest.fn((entity) => entity),
    findById: jest.fn((entity) => entity),
  }));

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VersionService,
        {
          provide: getRepositoryToken(ServiceRepository),
          useFactory: mockRepositoryFactory,
        },
        {
          provide: getRepositoryToken(VersionRepository),
          useFactory: mockRepositoryFactory,
        },
      ],
    }).compile();

    versionService = module.get<VersionService>(VersionService);
    serviceRepo = module.get<ServiceRepository>(ServiceRepository);
    versionRepo = module.get<VersionRepository>(VersionRepository);
  });

  it('should be defined', () => {
    expect(versionService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new version', async () => {
      const principal = new Principal('qwerty-asdfg-zxcvb', 'bob', []);

      const result = new Version();
      result.id = 1;
      result.description = 'description';
      result.service = new Service();
      result.service.id = 1;
      result.service.userId = principal.id;
      result.service.description = 'description';

      jest.spyOn(serviceRepo, 'findOne').mockResolvedValue(result.service);
      jest.spyOn(versionRepo, 'save').mockResolvedValue(result);

      expect(await versionService.create(principal, result)).toBe(result);
    });

    it('should throws an exception for service not found', async () => {
      const principal = new Principal('qwerty-asdfg-zxcvb', 'bob', []);

      const result = new Version();
      result.id = 1;
      result.description = 'description';
      result.service = new Service();
      result.service.id = 1;
      result.service.userId = principal.id;
      result.service.description = 'description';

      jest.spyOn(serviceRepo, 'findOne').mockResolvedValue(null);

      await expect(versionService.create(principal, result)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update an existing version', async () => {
      const principal = new Principal('qwerty-asdfg-zxcvb', 'bob', []);

      const mock = new Version();
      mock.id = 1;
      mock.description = 'description';
      mock.service = new Service();
      mock.service.id = 1;
      mock.service.description = 'description';

      const result = new Version();
      result.id = 1;
      result.description = 'new description';
      result.service = new Service();
      result.service.id = 1;
      result.service.userId = principal.id;
      result.service.description = 'description';

      const request = new Version();
      request.description = 'new description';

      jest.spyOn(versionRepo, 'existsByPrincipal').mockResolvedValue(true);
      jest.spyOn(versionRepo, 'findOne').mockResolvedValue(mock);
      jest.spyOn(versionRepo, 'save').mockResolvedValue(result);

      expect(await versionService.update(principal, result.id, request)).toBe(
        result,
      );
    });

    it('should throws an exception for version not found', async () => {
      const principal = new Principal('qwerty-asdfg-zxcvb', 'bob', []);

      const mock = new Version();
      mock.id = 1;
      mock.description = 'description';
      mock.service = new Service();
      mock.service.id = 1;
      mock.service.description = 'description';

      const result = new Version();
      result.id = 1;
      result.description = 'new description';
      result.service = new Service();
      result.service.id = 1;
      result.service.userId = principal.id;
      result.service.description = 'description';

      const request = new Version();
      request.description = 'new description';

      jest.spyOn(versionRepo, 'existsByPrincipal').mockResolvedValue(false);

      await expect(
        versionService.update(principal, result.id, request),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete an existing version', async () => {
      const principal = new Principal('qwerty-asdfg-zxcvb', 'bob', []);

      const result = new Version();
      result.id = 1;
      result.description = 'description';
      result.service = new Service();
      result.service.id = 1;
      result.service.userId = principal.id;
      result.service.description = 'description';

      jest.spyOn(versionRepo, 'existsByPrincipal').mockResolvedValue(true);
      jest.spyOn(versionRepo, 'delete').mockResolvedValue(null);

      await expect(
        versionService.delete(principal, result.id),
      ).resolves.not.toThrow();
    });

    it('should throws an exception for version not found', async () => {
      const principal = new Principal('qwerty-asdfg-zxcvb', 'bob', []);

      const result = new Version();
      result.id = 1;
      result.description = 'description';
      result.service = new Service();
      result.service.id = 1;
      result.service.userId = principal.id;
      result.service.description = 'description';

      jest.spyOn(versionRepo, 'existsByPrincipal').mockResolvedValue(false);

      await expect(versionService.delete(principal, result.id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAll', () => {
    it('should find all versions by service', async () => {
      const principal = new Principal('qwerty-asdfg-zxcvb', 'bob', []);

      const service = new Service();
      service.id = 1;
      service.userId = principal.id;

      const result = new Version();
      result.id = 1;
      result.description = 'description';
      result.service = service;

      jest.spyOn(serviceRepo, 'findOne').mockResolvedValue(service);
      jest.spyOn(versionRepo, 'findAllByServiceId').mockResolvedValue([result]);

      expect(
        await versionService.findAllByServiceId(principal, service.id),
      ).toStrictEqual([result]);
    });

    it('should throws an exception for service not found', async () => {
      const principal = new Principal('qwerty-asdfg-zxcvb', 'bob', []);

      const service = new Service();
      service.id = 1;
      service.userId = principal.id;

      const result = new Version();
      result.id = 1;
      result.description = 'description';
      result.service = service;

      jest.spyOn(serviceRepo, 'findOne').mockResolvedValue(null);

      await expect(
        versionService.findAllByServiceId(principal, service.id),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('find', () => {
    it('should find a versions by id', async () => {
      const principal = new Principal('qwerty-asdfg-zxcvb', 'bob', []);

      const service = new Service();
      service.id = 1;
      service.userId = principal.id;

      const result = new Version();
      result.id = 1;
      result.description = 'description';
      result.service = service;

      jest.spyOn(versionRepo, 'findById').mockResolvedValue(result);

      expect(await versionService.findById(principal, result.id)).toBe(result);
    });

    it('should throws an exception for version not found', async () => {
      const principal = new Principal('qwerty-asdfg-zxcvb', 'bob', []);

      const service = new Service();
      service.id = 1;
      service.userId = principal.id;

      const result = new Version();
      result.id = 1;
      result.description = 'description';
      result.service = service;

      jest.spyOn(versionRepo, 'findById').mockResolvedValue(null);

      await expect(
        versionService.findById(principal, result.id),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
