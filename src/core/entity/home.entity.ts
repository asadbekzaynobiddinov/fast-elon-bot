import { Entity, Column } from 'typeorm';
import { BaseModel } from 'src/common/database';
import { HomeType } from 'src/common/enum';

@Entity({ name: 'homes' })
export class Home extends BaseModel {
  @Column({ type: 'enum', enum: HomeType, nullable: true })
  type: HomeType;

  @Column({ type: 'simple-array', nullable: true })
  pictures: string[];

  @Column({ type: 'text', nullable: true })
  location: string;

  @Column({ type: 'varchar', nullable: true })
  floors_of_building: string;

  @Column({ type: 'varchar', nullable: true })
  floor_number: string;

  @Column({ type: 'varchar', nullable: true })
  rooms: string;

  @Column({ type: 'varchar', nullable: true })
  square: string;

  @Column({ type: 'varchar', nullable: true })
  price: string;

  @Column({ type: 'varchar', nullable: true })
  number_for_contact: string;

  @Column({ type: 'text', nullable: true })
  additional_information: string;

  @Column({ type: 'boolean', default: true })
  is_available: boolean;

  @Column({ type: 'varchar', nullable: true })
  last_state: string;

  @Column({ type: 'varchar', nullable: true })
  user_id: string;
}
