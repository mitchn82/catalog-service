import { Module } from '@nestjs/common';
import { CatalogService } from './services/catalog.service';
import { Service } from './entities/service.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Version } from './entities/version.entity';
import { ServiceRepository } from './repositories/service.repository';
import { PaginationModule } from 'src/pagination/pagination.module';
import { VersionRepository } from './repositories/version.repository';
import { CatalogController } from './controllers/catalog.controller';
import { VersionController } from './controllers/version.controller';
import { VersionService } from './services/version.service';

@Module({
  imports: [TypeOrmModule.forFeature([Service, Version]), PaginationModule],
  controllers: [CatalogController, VersionController],
  providers: [
    CatalogService,
    VersionService,
    ServiceRepository,
    VersionRepository,
  ],
})
export class CatalogModule {}
