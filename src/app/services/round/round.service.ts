import { inject, Injectable } from '@angular/core';
import { UserInterface } from '../../interfaces/user/user.interface';
import { v4 as uuidV4 } from 'uuid';
import { RoundInterface } from '../../interfaces/room/round/round.interface';
import { Observable } from 'rxjs';
import { VoteValue } from '../../interfaces/room/round/vote/vote.interface';
import { deleteField, doc, docData, Firestore, setDoc, updateDoc, DocumentReference } from '@angular/fire/firestore';

@Injectable({
    providedIn: 'root'
})
export class RoundService {
    private readonly firestore: Firestore = inject(Firestore);

    public get(id: string): Observable<RoundInterface> {
        return this.getByPath(`rounds/${id}`);
    }

    public getByPath(path: string): Observable<RoundInterface> {
        const docRef = doc(this.firestore, path);
        return docData(docRef) as Observable<RoundInterface>;
    }

    public async create(): Promise<RoundCreationResult> {
        const id: string = uuidV4();

        const document = doc(this.firestore, `rounds/${id}`) as DocumentReference<RoundInterface>;
        await setDoc(document, {
            id: id,
            title: '',
            description: '',
            votes: {},
            resolved: false,
            created_at: new Date()
        });

        return {
            id: id,
            reference: document
        };
    }

    async vote(id: string, user: UserInterface, value: VoteValue): Promise<void> {
        const document = doc(this.firestore, `rounds/${id}`);
        await updateDoc(document, {
            [`votes.${user.uid}`]: {
                value: value,
                user: user,
                created_at: new Date()
            }
        });
    }

    async deleteVote(id: string, user: UserInterface): Promise<void> {
        const document = doc(this.firestore, `rounds/${id}`);
        await updateDoc(document, {
            [`votes.${user.uid}`]: deleteField()
        });
    }

    async resolve(id: string): Promise<void> {
        const document = doc(this.firestore, `rounds/${id}`);
        await updateDoc(document, {
            resolved: true
        });
    }
}

export interface RoundCreationResult {
    id: string;
    reference: DocumentReference<RoundInterface>;
}
