import { Repository } from 'typeorm';
import { Work } from '../entity';

export type WorkRepository = Repository<Work>;
