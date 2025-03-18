import { Entity, Column } from 'typeorm';
import { BaseModel } from 'src/common/database';
import { UserLang } from 'src/common/enum';

@Entity({ name: 'users' })
export class User extends BaseModel {
  @Column({ unique: true })
  telegram_id: string;

  @Column()
  username: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ type: 'enum', enum: UserLang, nullable: true })
  lang: UserLang;
}
