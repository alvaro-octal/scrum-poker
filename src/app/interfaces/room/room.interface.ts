import { UserInterface } from '../user/user.interface';
import { RoundInterface } from './round/round.interface';
import { DocumentReference} from '@angular/fire/compat/firestore';

export interface RoomInterface {
  id: string;
  owner: UserInterface;
  users: Record<string, UserInterface>;
  round: DocumentReference<RoundInterface>;
  rounds: DocumentReference<RoundInterface>[];
  created_at: Date;
  active_at: Date;
}
