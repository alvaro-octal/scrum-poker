import { inject, Injectable } from '@angular/core';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { Database, onDisconnect, onValue, ref, update } from '@angular/fire/database';

@Injectable({
    providedIn: 'root'
})
export class PresenceService {
    private readonly auth: Auth = inject(Auth);
    private readonly db: Database = inject(Database);

    constructor() {
        this.watchAuth();
        this.watchOnDisconnect();
        this.watchOnAway();
    }

    public getPresence(uid: string): Observable<PresenceInterface> {
        return new Observable<PresenceInterface>((subscriber) => {
            const statusRef = ref(this.db, `status/${uid}`);

            const unsubscribe = onValue(statusRef, (snapshot) => {
                subscriber.next(snapshot.val() as PresenceInterface);
            });

            // Cleanup for unsubscribe
            return () => unsubscribe();
        });
    }

    private async setPresence(status: PresenceStatusInterface): Promise<void> {
        const user = this.auth.currentUser;
        if (user) {
            const statusRef = ref(this.db, `status/${user.uid}`);
            await update(statusRef, {
                status,
                timestamp: Date.now()
            });
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
        return onAuthStateChanged(this.auth, async (user) => {
            if (user) {
                const statusRef = ref(this.db, `status/${user.uid}`);
                const disconnectRef = onDisconnect(statusRef);

                await disconnectRef.update({
                    status: 'offline',
                    timestamp: Date.now()
                });
            }
        });
    }
}

export interface PresenceInterface {
    status: PresenceStatusInterface;
    timestamp: number;
}

type PresenceStatusInterface = 'online' | 'away' | 'offline';
