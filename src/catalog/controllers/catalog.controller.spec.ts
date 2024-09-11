import { Test, TestingModule } from '@nestjs/testing';

import { CatalogController } from './catalog.controller';
import { CatalogService } from '../services/catalog.service';
import { Service } from '../entities/service.entity';
import { ServiceRepository } from '../repositories/service.repository';

describe('CatalogController', () => {
  let controller: CatalogController;
  let service: CatalogService;

  beforeEach(async () => {
    // const module: TestingModule = await Test.createTestingModule({
    //   controllers: [CatalogController],
    //   providers: [CatalogService],
    // }).compile();

    // service = module.get<CatalogService>(CatalogService);
    // controller = module.get<CatalogController>(CatalogController);
    service = new CatalogService(null);
    controller = new CatalogController(service);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('get', () => {
    it('should return a service', async () => {
      const result = new Service();
      result.id = 1;
      const id = 1;
      const request = {
        principal: {
          id: 1,
        },
      };
      jest.spyOn(service, 'findOne').mockResolvedValue(result);

      expect(await controller.get(request, id)).toBe(result);
    });
  });
});
