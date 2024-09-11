import { Injectable, NotFoundException } from '@nestjs/common';
import { ServiceRepository } from '../repositories/service.repository';
import { VersionRepository } from '../repositories/version.repository';
import { Principal } from 'src/auth/entities/principal.entity';
import { Version } from '../entities/version.entity';

@Injectable()
export class VersionService {
  constructor(
    private readonly serviceRepository: ServiceRepository,
    private readonly versionRepository: VersionRepository,
  ) {}

  /**
   * Create a new version for given service
   * @param principal the user
   * @param id service id
   * @param version the version model
   * @returns new version
   */
  async create(principal: Principal, version: Version): Promise<Version> {
    const service = await this.serviceRepository.findOne({
      where: { id: version.service.id, userId: principal.id },
    });
    if (service === null) throw new NotFoundException('Service not found');
    return this.versionRepository.save(version);
  }

  /**
   * Update a version for given service
   * @param principal the user
   * @param id version id
   * @param version the version model
   * @returns updated version
   */
  async update(
    principal: Principal,
    id: number,
    version: Version,
  ): Promise<Version> {
    if (await this.versionRepository.existsByPrincipal(principal.id, id)) {
      const existingVersion = await this.versionRepository.findOne({
        where: { id: id },
      });
      const versionData = this.versionRepository.merge(
        existingVersion,
        version,
      );
      return this.versionRepository.save(versionData);
    } else {
      throw new NotFoundException('Version not found');
    }
  }

  /**
   * Delete a version
   * @param principal the user
   * @param id version id
   */
  async delete(principal: Principal, id: number): Promise<void> {
    if (await this.versionRepository.existsByPrincipal(principal.id, id)) {
      this.versionRepository.delete(id);
    } else {
      throw new NotFoundException('Version not found');
    }
  }

  /**
   * Returns all version for a given service
   * @param principal the user
   * @param serviceId service id
   * @returns List of versions
   */
  async findAllByServiceId(
    principal: Principal,
    serviceId: number,
  ): Promise<Version[]> {
    const service = await this.serviceRepository.findOne({
      where: { id: serviceId, userId: principal.id },
    });
    if (service === null) throw new NotFoundException('Service not found');
    return this.versionRepository.findAllByServiceId(principal.id, serviceId);
  }

  /**
   * Returns a version by id
   * @param principal the user
   * @param id version id
   * @returns the version
   */
  async findById(principal: Principal, id: number): Promise<Version> {
    const version = await this.versionRepository.findById(principal.id, id);
    if (version === null) throw new NotFoundException('Version not found');
    else return version;
  }
}
