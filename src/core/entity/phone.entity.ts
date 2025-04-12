import { Entity, Column } from 'typeorm';
import { BaseModel } from 'src/common/database';
import { PhoneType } from 'src/common/enum';

@Entity('phones')
export class Phone extends BaseModel {
  @Column({ type: 'enum', enum: PhoneType, nullable: true })
  type: PhoneType;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string;

  @Column({ type: 'simple-array', nullable: true })
  pictures: string[];

  @Column({ type: 'varchar', length: 255, nullable: true })
  condition: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  memory: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  color: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  box_and_documents: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  battery_condition: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  region: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  contact_number: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  price: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  user_id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  last_state: string;
}
