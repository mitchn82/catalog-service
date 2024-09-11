import { Service } from '../entities/service.entity';
import { Version } from '../entities/version.entity';
import { CreateServiceDto } from './create-service.dto';
import { CreateVersionDto } from './create-version.dto';
import { UpdateServiceDto } from './update-service.dto';
import { UpdateVersionDto } from './update-version.dto';

export class ServiceMapper {
  static fromDto(dto: CreateServiceDto | UpdateServiceDto): Service {
    const service = new Service();
    service.name = dto.name;
    service.description = dto.description;
    return service;
  }
}

export class VersionMapper {
  static fromDto(dto: CreateVersionDto | UpdateVersionDto): Version {
    const version = new Version();
    version.name = dto.name;
    version.description = dto.description;
    if (dto instanceof CreateVersionDto) {
      version.service = new Service();
      version.service.id = (dto as CreateVersionDto).serviceId;
    }
    return version;
  }
}
