import { Entity, Column } from 'typeorm';
import { BaseModel } from 'src/common/database';

@Entity('cars')
export class Car extends BaseModel {
  @Column({ type: 'varchar', nullable: true })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  year: string;

  @Column({ type: 'varchar', nullable: true })
  mileage: string;

  @Column({ type: 'varchar', nullable: true })
  condition: string;

  @Column({ type: 'varchar', nullable: true })
  body_condition: string;

  @Column({ type: 'varchar', nullable: true })
  color: string;

  @Column({ type: 'varchar', nullable: true })
  region: string;

  @Column({ type: 'varchar', nullable: true })
  price: string;

  @Column({ type: 'varchar', nullable: true })
  contact_number: string;

  @Column({ type: 'simple-array', nullable: true })
  pictures: string[];

  @Column({ type: 'varchar', nullable: true })
  user_id: string;

  @Column({ type: 'text', nullable: true })
  additonal_info: string;

  @Column({ type: 'varchar', nullable: true })
  last_state: string;
}
