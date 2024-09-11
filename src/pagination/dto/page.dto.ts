import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import { PageMetadata } from './page-meta.dto';

export class Page<T> {
  @IsArray()
  @ApiProperty({ isArray: true })
  readonly data: T[];

  @ApiProperty({ type: () => PageMetadata })
  readonly page: PageMetadata;

  constructor(data: T[], page: PageMetadata) {
    this.data = data;
    this.page = page;
  }
}
