import { Injectable } from '@nestjs/common';
import { Version } from '../entities/version.entity';
import { DataSource, Repository } from 'typeorm';
import { Service } from '../entities/service.entity';

@Injectable()
export class VersionRepository extends Repository<Version> {
  constructor(dataSource: DataSource) {
    super(Version, dataSource.createEntityManager());
  }

  /**
   * Check if the version exists for a user
   * @param userId the user id
   * @param id version id
   * @returns true if exists
   */
  async existsByPrincipal(userId: string, id: number): Promise<boolean> {
    return this.createQueryBuilder('version')
      .leftJoin(Service, 'service', 'service.id = version.serviceId')
      .where('service.userId = :userId', { userId: userId })
      .andWhere('version.id = :id', { id: id })
      .getExists();
  }

  /**
   * Returns all versions for a given service
   * @param userId the user id
   * @param serviceId the service id
   * @returns list of versions
   */
  async findAllByServiceId(
    userId: string,
    serviceId: number,
  ): Promise<Version[]> {
    return this.createQueryBuilder('version')
      .leftJoin(Service, 'service', 'service.id = version.serviceId')
      .where('service.userId = :userId', { userId: userId })
      .andWhere('service.id = :serviceId', { serviceId: serviceId })
      .getMany();
  }

  /**
   * Returns a version given the id
   * @param userId the user id
   * @param id the version id
   * @returns version
   */
  async findById(userId: string, id: number): Promise<Version> {
    return this.createQueryBuilder('version')
      .leftJoin(Service, 'service', 'service.id = version.serviceId')
      .where('service.userId = :userId', { userId: userId })
      .andWhere('version.id = :id', { id: id })
      .getOne();
  }
}
