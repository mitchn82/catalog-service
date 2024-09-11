import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { PageRequest } from 'src/pagination/dto/page-request.dto';

/**
 * This pipe validates sortable fields in PageRequest, to prevent any SQL injection attempt
 */
@Injectable()
export class ServicePageRequestPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!(value instanceof PageRequest)) {
      throw new BadRequestException();
    }
    const request = value as PageRequest;
    if (!request.sort) {
      return value;
    }

    //TODO: switch to custom decorator @Sortable
    const fields = ['id', 'name', 'description', 'createdAt', 'updatedAt'];
    if (fields.indexOf(request.sort) === -1) {
      throw new BadRequestException();
    }

    return value;
  }
}
