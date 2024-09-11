import {
  Controller,
  Post,
  Param,
  Body,
  Patch,
  Delete,
  Request,
  Get,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { CreateVersionDto } from '../dto/create-version.dto';
import { VersionMapper } from '../dto/mappers';
import { UpdateVersionDto } from '../dto/update-version.dto';
import { VersionService } from '../services/version.service';
import { VersionDto } from '../dto/version.dto';

@ApiBearerAuth()
@ApiTags('Versions')
@Controller('/v1/versions')
export class VersionController {
  constructor(private readonly versionService: VersionService) {}

  @Get()
  @ApiOperation({ summary: 'Get all versions for a given service' })
  @ApiResponse({ status: 200, description: 'OK' })
  async getAll(
    @Request() request,
    @Query('serviceId') serviceId: number,
  ): Promise<VersionDto[]> {
    return this.versionService.findAllByServiceId(request.principal, serviceId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a versions by id' })
  @ApiResponse({ status: 200, description: 'OK' })
  async get(@Request() request, @Param('id') id: number): Promise<VersionDto> {
    return this.versionService.findById(request.principal, id);
  }

  @Post('')
  @ApiOperation({ summary: 'Create a new version for a given service' })
  @ApiResponse({ status: 200, description: 'OK', type: VersionDto })
  async create(
    @Request() request,
    @Body() createVersionDto: CreateVersionDto,
  ): Promise<VersionDto> {
    return this.versionService.create(
      request.principal,
      VersionMapper.fromDto(createVersionDto),
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a version for a given service' })
  @ApiResponse({ status: 200, description: 'OK', type: VersionDto })
  async update(
    @Request() request,
    @Param('id') id: number,
    @Body() updateVersionDto: UpdateVersionDto,
  ): Promise<VersionDto> {
    return this.versionService.update(
      request.principal,
      id,
      VersionMapper.fromDto(updateVersionDto),
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a version for a given service' })
  @ApiResponse({ status: 200, description: 'OK', type: VersionDto })
  async delete(@Request() request, @Param('id') id: number): Promise<void> {
    return this.versionService.delete(request.principal, id);
  }
}
