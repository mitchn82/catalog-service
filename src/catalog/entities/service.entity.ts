import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Version } from './version.entity';
import { Sortable } from 'src/pagination/decorators/sortable.decorator';

@Entity()
export class Service {
  @PrimaryGeneratedColumn()
  @Sortable()
  id: number;

  @Column({ length: 255 })
  @Sortable()
  name: string;

  @Column('text')
  @Sortable()
  description: string;

  /**
   * ID of the owner
   */
  @Column()
  userId: string;

  /**
   * Full text search field
   */
  @Column('tsvector', { select: false })
  document: any;

  @OneToMany(() => Version, (version) => version.service, {
    cascade: true,
  })
  versions: Version[];

  versionsCount: number;

  /**
   * Insert time.
   */
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  @Sortable()
  public createdAt: Date;

  /**
   * Last update time.
   */
  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  @Sortable()
  public updatedAt: Date;
}
