import { Entity, Column } from 'typeorm';
import { BaseModel } from 'src/common/database';
import { WorkType } from 'src/common/enum';

@Entity('works')
export class Work extends BaseModel {
  @Column({ type: 'enum', enum: WorkType, nullable: true })
  type: WorkType;

  @Column({ type: 'varchar', nullable: true })
  title: string;

  @Column({ type: 'varchar', nullable: true })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  location: string;

  @Column({ type: 'varchar', nullable: true })
  information: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  deadline: string;

  @Column({ type: 'varchar', nullable: true })
  salary: string;

  @Column({ type: 'varchar', nullable: true })
  application_time: string;

  @Column({ nullable: true })
  contact: string;

  @Column({ type: 'varchar', nullable: true })
  last_state: string;
}
