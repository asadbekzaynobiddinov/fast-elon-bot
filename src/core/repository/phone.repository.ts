import { Repository } from 'typeorm';
import { Phone } from '../entity/phone.entity';

export type PhoneRepository = Repository<Phone>;
