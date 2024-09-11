import { VersionDto } from './version.dto';

export class ServiceDto {
  readonly id: number;
  readonly name: string;
  readonly description: string;
  readonly versions: VersionDto[];
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly versionsCount: number;
}
