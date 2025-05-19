import { Entity, Column } from 'typeorm';
import { BaseModel } from 'src/common/database';

@Entity({ name: 'stores' })
export class Store extends BaseModel {
  @Column({ type: 'varchar', length: 255, nullable: true })
  button_name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  button_url: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  last_state: string;
}
