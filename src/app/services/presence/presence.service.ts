import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PresenceService {
    constructor(private auth: Auth, private db: AngularFireDatabase) {
        this.watchAuth();
        this.watchOnDisconnect();
        this.watchOnAway();
    }

    public getPresence(uid: string): Observable<PresenceInterface> {
        return this.db.object(`status/${uid}`).valueChanges() as Observable<PresenceInterface>;
    }

    private async setPresence(status: PresenceStatusInterface): Promise<void> {
        const user = this.auth.currentUser;
        if (user) {
            await this.db.object(`status/${user.uid}`).update({
                status,
                timestamp: new Date().getTime()
            } as PresenceInterface);
        }
    }

    private async signOut(): Promise<void> {
        await this.setPresence('offline');
        await this.auth.signOut();
    }

    private watchAuth(): void {
        this.auth.onAuthStateChanged(async (user): Promise<void> => {
            await this.setPresence(user ? 'online' : 'offline');
        });
    }

    private watchOnAway(): void {
        document.onvisibilitychange = async (): Promise<void> => {
            if (document.visibilityState === 'hidden') {
                await this.setPresence('away');
            } else {
                await this.setPresence('online');
            }
        };
    }

    private watchOnDisconnect() {
        return this.auth.onAuthStateChanged(async (user) => {
            if (user) {
                await this.db
                    .object(`status/${user.uid}`)
                    .query.ref.onDisconnect()
                    .update({
                        status: 'offline',
                        timestamp: new Date().getTime()
                    } as PresenceInterface);
            }
        });
    }
}

export interface PresenceInterface {
    status: PresenceStatusInterface;
    timestamp: number;
}

type PresenceStatusInterface = 'online' | 'away' | 'offline';
