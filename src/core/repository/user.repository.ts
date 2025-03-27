import { Repository } from 'typeorm';
import { User } from '../entity';

export type UserRepository = Repository<User>;
