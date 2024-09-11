import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { getSortableProperties } from 'src/pagination/decorators/sortable.decorator';
import { PageRequest } from 'src/pagination/dto/page-request.dto';

/**
 * This pipe validates sortable fields in PageRequest, to prevent any SQL injection attempt
 */
@Injectable()
export class PageRequestPipe implements PipeTransform {
  private readonly fields: string[];

  constructor(theClass: any) {
    this.fields = getSortableProperties(theClass);
  }

  transform(value: any, metadata: ArgumentMetadata) {
    if (!(value instanceof PageRequest)) {
      throw new BadRequestException();
    }
    const request = value as PageRequest;
    if (!request.sort) {
      return value;
    }

    if (this.fields.indexOf(request.sort) === -1) {
      throw new BadRequestException();
    }

    return value;
  }
}
