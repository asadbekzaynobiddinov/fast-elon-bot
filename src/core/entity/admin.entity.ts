import { Entity, Column } from 'typeorm';
import { BaseModel } from 'src/common/database';

@Entity('admins')
export class Admin extends BaseModel {
  @Column()
  telegram_id: string;

  @Column({ nullable: true })
  last_state: string;
}
