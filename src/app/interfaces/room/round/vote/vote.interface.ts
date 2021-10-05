import { UserInterface } from '../../../user/user.interface';

export interface VoteInterface {
  user: UserInterface;
  value: number | null;
  created_at: Date;
}
