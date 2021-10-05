import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  DocumentReference,
} from '@angular/fire/compat/firestore';
import { UserInterface } from '../../interfaces/user/user.interface';
import { v4 as uuidv4 } from 'uuid';
import { RoundInterface } from '../../interfaces/room/round/round.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoundService {
  constructor(private firestore: AngularFirestore) {}

  public get(id: string): Observable<RoundInterface> {
    return this.getByPath(`rounds/${id}`);
  }

  public getByPath(path: string): Observable<RoundInterface> {
    return this.firestore
      .doc(path)
      .valueChanges() as Observable<RoundInterface>;
  }

  public async create(): Promise<RoundCreationResult> {
    const id: string = uuidv4();

    const document = this.firestore.doc<RoundInterface>(`rounds/${id}`);
    await document.set({
      id: id,
      title: '',
      description: '',
      votes: {},
      resolved: false,
      created_at: new Date(),
    });

    return {
      id: id,
      reference: document.ref,
    };
  }

  vote(id: string, user: UserInterface, value: number): void {
    const document = this.firestore.doc<RoundInterface>(`rounds/${id}`);
    document.update({
      [`votes.${user.uid}`]: {
        value: value,
        user: user,
        created_at: new Date(),
      },
    });
  }

  resolve(id: string): void {
    const document = this.firestore.doc<RoundInterface>(`rounds/${id}`);
    document.update({
      resolved: true,
    });
  }
}

export interface RoundCreationResult {
  id: string;
  reference: DocumentReference<RoundInterface>;
}
