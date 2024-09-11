import { ApiProperty } from '@nestjs/swagger';
import { PageRequest } from './page-request.dto';

export class PageMetadata {
  @ApiProperty()
  readonly num: number;

  @ApiProperty()
  readonly size: number;

  @ApiProperty()
  readonly totalElements: number;

  @ApiProperty()
  readonly totalPages: number;

  @ApiProperty()
  readonly prev: boolean;

  @ApiProperty()
  readonly next: boolean;

  constructor(pageRequest: PageRequest, count: number) {
    this.num = pageRequest.page;
    this.size = pageRequest.size;
    this.totalElements = count;
    this.totalPages = Math.ceil(this.totalElements / this.size);
    this.prev = this.num > 1;
    this.next = this.num < this.totalPages;
  }
}
