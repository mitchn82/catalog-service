import { DataSource, Repository } from 'typeorm';
import { Service } from '../entities/service.entity';
import { Injectable } from '@nestjs/common';
import { PageRequest } from 'src/pagination/dto/page-request.dto';
import { Page } from 'src/pagination/dto/page.dto';
import { PageMetadata } from 'src/pagination/dto/page-meta.dto';

@Injectable()
export class ServiceRepository extends Repository<Service> {
  constructor(dataSource: DataSource) {
    super(Service, dataSource.createEntityManager());
  }

  /**
   * Performs a full text search on service
   * @param userId the user id
   * @param query the query
   * @param pageRequest the pagination request model
   * @returns page of services
   */
  async search(
    userId: string,
    query: string,
    pageRequest: PageRequest,
  ): Promise<Page<Service>> {
    const queryBuilder = this.createQueryBuilder('service')
      .where('service.document @@ to_tsquery(:query)', { query: query + ':*' })
      .andWhere('service.userId = :userId', { userId: userId })
      .loadRelationCountAndMap('service.versionsCount', 'service.versions')
      .orderBy('ts_rank(document, to_tsquery(:query))', 'DESC');

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetadata(pageRequest, itemCount);
    return new Page(entities, pageMetaDto);
  }

  /**
   * Returns all services for a given user
   * @param userId the user id
   * @param pageRequest the pagination request model
   * @returns page of services
   */
  async findWithPages(
    userId: string,
    pageRequest: PageRequest,
  ): Promise<Page<Service>> {
    const queryBuilder = this.createQueryBuilder('service')
      .where('service.userId = :userId', { userId: userId })
      .loadRelationCountAndMap('service.versionsCount', 'service.versions');
    if (pageRequest.sort) {
      queryBuilder.orderBy(
        `service.${pageRequest.sort}`,
        pageRequest.direction,
      );
    }

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetadata(pageRequest, itemCount);
    return new Page(entities, pageMetaDto);
  }

  /**
   * Returns a service with versions count
   * @param userId the user id
   * @param id service id
   * @returns service
   */
  async findOneWithVersionsCount(userId: string, id: number): Promise<Service> {
    return this.createQueryBuilder('service')
      .where('service.userId = :userId', { userId: userId })
      .andWhere('service.id = :id', { id: id })
      .loadRelationCountAndMap('service.versionsCount', 'service.versions')
      .getOne();
  }
}
