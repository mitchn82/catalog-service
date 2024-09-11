import { Module } from '@nestjs/common';
import { CatalogModule } from './catalog/catalog.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaginationModule } from './pagination/pagination.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import configHelper from './config.helper';
import { DBConfigService } from './database/database.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configHelper],
    }),
    TypeOrmModule.forRootAsync({
      useClass: DBConfigService,
      inject: [DBConfigService],
    }),
    CatalogModule,
    PaginationModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
