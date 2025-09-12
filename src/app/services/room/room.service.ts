import { inject, Injectable } from '@angular/core';
import { RoomInterface } from '../../interfaces/room/room.interface';
import { UserInterface } from '../../interfaces/user/user.interface';
import { RoundCreationResult, RoundService } from '../round/round.service';
import { Observable } from 'rxjs';
import { increment } from '@angular/fire/database';
import { doc, docData, Firestore, setDoc, updateDoc, DocumentReference } from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})
export class RoomService {
    private readonly firestore: Firestore = inject(Firestore);
    private readonly roundService: RoundService = inject(RoundService);

    public get(id: string): Observable<RoomInterface> {
        return this.getByPath(`rooms/${id}`);
    }

    public getByPath(path: string): Observable<RoomInterface> {
        const docRef = doc(this.firestore, path);
        return docData(docRef) as Observable<RoomInterface>;
    }

    public async create(user: UserInterface): Promise<RoomCreationResult> {
        const id: string = Math.floor(Math.random() * 10000)
            .toString()
            .padStart(5, '0');

        const result: RoundCreationResult = await this.roundService.create();

        const document = doc(this.firestore, `rooms/${id}`) as DocumentReference<RoomInterface>;
        await setDoc(document, {
            id: id,
            owner: user,
            users: { [user.uid]: user },
            round: result.reference,
            rounds: [],
            coffees: {},
            created_at: new Date(),
            active_at: new Date()
        });

        return { id: id, reference: document };
    }

    public async next(id: string): Promise<RoundCreationResult> {
        const result: RoundCreationResult = await this.roundService.create();

        const document = doc(this.firestore, `rooms/${id}`);
        await updateDoc(document, {
            round: result.reference
        });

        return result;
    }

    public async join(id: string, user: UserInterface): Promise<void> {
        const document = doc(this.firestore, `rooms/${id}`);
        await updateDoc(document, {
            [`users.${user.uid}`]: user,
            active_at: new Date()
        });
    }

    public async coffee(id: string, user: UserInterface, value: number): Promise<void> {
        const roomRef = doc(this.firestore, `rooms/${id}`);
        await updateDoc(roomRef, {
            [`coffees.${user.uid}`]: increment(value),
            active_at: new Date()
        });
    }
}

export interface RoomCreationResult {
    id: string;
    reference: DocumentReference<RoomInterface>;
}
