import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { Page } from 'src/pagination/dto/page.dto';
import { PageRequest } from 'src/pagination/dto/page-request.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CatalogService } from '../services/catalog.service';
import { CreateServiceDto } from '../dto/create-service.dto';
import { ServiceMapper } from '../dto/mappers';
import { ServiceDto } from '../dto/service.dto';
import { UpdateServiceDto } from '../dto/update-service.dto';
import { ServicePageRequestPipe } from '../pipes/service-page-request.pipe';

@ApiBearerAuth()
@ApiTags('Services')
@Controller('/v1/services')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get('search')
  @ApiOperation({
    summary: 'Perform a full text search for a service, with pages',
  })
  @ApiResponse({ status: 200, description: 'OK', type: Page<ServiceDto> })
  async search(
    @Request() request,
    @Query('q') query: string,
    @Query(ServicePageRequestPipe) pageRequest: PageRequest,
  ): Promise<Page<ServiceDto>> {
    return this.catalogService.search(request.principal, query, pageRequest);
  }

  @Get()
  @ApiOperation({ summary: 'Returns a list of services by user, with pages' })
  @ApiResponse({ status: 200, description: 'OK', type: Page<ServiceDto> })
  async find(
    @Request() request,
    @Query(ServicePageRequestPipe) pageRequest: PageRequest,
  ): Promise<Page<ServiceDto>> {
    return this.catalogService.find(request.principal, pageRequest);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get service detail by id' })
  @ApiResponse({ status: 200, description: 'OK', type: ServiceDto })
  @ApiResponse({ status: 404, description: 'Not found' })
  async get(@Request() request, @Param('id') id: number): Promise<ServiceDto> {
    return this.catalogService.findOne(request.principal, id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new service' })
  @ApiResponse({ status: 200, description: 'OK', type: ServiceDto })
  async create(
    @Request() request,
    @Body() createServiceDto: CreateServiceDto,
  ): Promise<ServiceDto> {
    return this.catalogService.create(
      request.principal,
      ServiceMapper.fromDto(createServiceDto),
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing service' })
  @ApiResponse({ status: 200, description: 'OK', type: ServiceDto })
  @ApiResponse({ status: 404, description: 'Not found' })
  async update(
    @Request() request,
    @Param('id') id: number,
    @Body() updateServiceDto: UpdateServiceDto,
  ): Promise<ServiceDto> {
    return this.catalogService.update(
      request.principal,
      id,
      ServiceMapper.fromDto(updateServiceDto),
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an existing service' })
  @ApiResponse({ status: 200, description: 'OK', type: ServiceDto })
  @ApiResponse({ status: 404, description: 'Not found' })
  async delete(@Request() request, @Param('id') id: number): Promise<void> {
    return this.catalogService.delete(request.principal, id);
  }
}
