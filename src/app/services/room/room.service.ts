import { Injectable } from '@angular/core';
import { RoomInterface } from '../../interfaces/room/room.interface';
import {
  AngularFirestore,
  DocumentReference,
} from '@angular/fire/compat/firestore';
import { UserInterface } from '../../interfaces/user/user.interface';
import { RoundCreationResult, RoundService } from '../round/round.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  constructor(
    private firestore: AngularFirestore,
    private roundService: RoundService
  ) {}

  public get(id: string): Observable<RoomInterface> {
    return this.getByPath(`rooms/${id}`);
  }

  public getByPath(path: string): Observable<RoomInterface> {
    return this.firestore.doc(path).valueChanges() as Observable<RoomInterface>;
  }

  public async create(user: UserInterface): Promise<RoomCreationResult> {
    const id: string = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(5, '0');

    const result: RoundCreationResult = await this.roundService.create();

    const document = this.firestore.doc<RoomInterface>(`rooms/${id}`);
    await document.set({
      id: id,
      owner: user,
      users: { [user.uid]: user },
      round: result.reference,
      rounds: [],
      created_at: new Date(),
      active_at: new Date(),
    });

    return { id: id, reference: document.ref };
  }

  public async next(id: string): Promise<RoundCreationResult> {

    const result: RoundCreationResult = await this.roundService.create();

    const document = this.firestore.doc<RoomInterface>(`rooms/${id}`);
    await document.update({
      round: result.reference,
    });

    return result;
  }

  public async join(id: string, user: UserInterface): Promise<void> {
    const document = this.firestore.doc<RoomInterface>(`rooms/${id}`);
    await document.update({
      [`users.${user.uid}`]: user,
      active_at: new Date(),
    });
  }
}

export interface RoomCreationResult {
  id: string;
  reference: DocumentReference<RoomInterface>;
}
