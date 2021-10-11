import { UserInterface } from '../../../user/user.interface';

export interface VoteInterface {
  user: UserInterface;
  value: VoteValue;
  created_at: Date;
}

export type VoteValue = number | null;
