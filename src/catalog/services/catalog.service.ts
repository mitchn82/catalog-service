import { Injectable, NotFoundException } from '@nestjs/common';
import { Service } from '../entities/service.entity';
import { ServiceRepository } from '../repositories/service.repository';
import { Page } from 'src/pagination/dto/page.dto';
import { PageRequest } from 'src/pagination/dto/page-request.dto';
import { Principal } from 'src/auth/entities/principal.entity';

@Injectable()
export class CatalogService {
  constructor(private readonly serviceRepository: ServiceRepository) {}

  /**
   * Create a new service
   * @param principal the user
   * @param service the service to create
   * @returns the service
   */
  async create(principal: Principal, service: Service): Promise<Service> {
    service.userId = principal.id;
    return this.serviceRepository.save(service);
  }

  /**
   * Update an existing service, throws NotFoundException if not found
   * @param principal the user
   * @param id service PK
   * @param service partial service model
   * @returns the service
   */
  async update(
    principal: Principal,
    id: number,
    service: Service,
  ): Promise<Service> {
    const existingService = await this.findOne(principal, id);
    const serviceData = this.serviceRepository.merge(existingService, service);
    return this.serviceRepository.save(serviceData);
  }

  /**
   * Delete an existing service, throws NotFoundException if not found
   * @param principal the user
   * @param id service PK
   */
  async delete(principal: Principal, id: number): Promise<void> {
    if (
      await this.serviceRepository.existsBy({ id: id, userId: principal.id })
    ) {
      this.serviceRepository.delete(id);
    } else {
      throw new NotFoundException('Service not found');
    }
  }

  /**
   * Select a service by PK, throws NotFoundException if not found
   * @param principal the user
   * @param id service PK
   * @returns the service
   */
  async findOne(principal: Principal, id: number): Promise<Service> {
    const service = await this.serviceRepository.findOneWithVersionsCount(
      principal.id,
      id,
    );
    if (service === null) throw new NotFoundException('Service not found');
    else return service;
  }

  /**
   * Perform a full text search of services
   * @param principal the user
   * @param query the query
   * @returns paginated list of services
   */
  async search(
    principal: Principal,
    query: string,
    pageRequest: PageRequest,
  ): Promise<Page<Service>> {
    return this.serviceRepository.search(principal.id, query, pageRequest);
  }

  /**
   * List all services owned by the principal
   * @param principal the user
   * @param pageRequest
   * @returns paginated list of services
   */
  async find(
    principal: Principal,
    pageRequest: PageRequest,
  ): Promise<Page<Service>> {
    return this.serviceRepository.findWithPages(principal.id, pageRequest);
  }
}
