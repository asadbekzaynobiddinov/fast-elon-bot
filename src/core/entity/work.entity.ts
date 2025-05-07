import { Entity, Column } from 'typeorm';
import { BaseModel } from 'src/common/database';

@Entity('jobs')
export class Job extends BaseModel {
  @Column()
  title: string;

  @Column({ type: 'varchar', nullable: true })
  location: string;

  @Column({ type: 'varchar', nullable: true })
  information: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  deadline: Date;

  @Column({ type: 'varchar', nullable: true })
  salary: string;

  @Column({ type: 'varchar', nullable: true })
  application_time: string;

  @Column({ nullable: true })
  contact: string;

  @Column({ type: 'varchar', nullable: true })
  last_state: string;
}
