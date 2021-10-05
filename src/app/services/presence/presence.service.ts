import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PresenceService {
  constructor(private auth: Auth, private db: AngularFireDatabase) {
    this.watchAuth();
    this.watchOnDisconnect();
    this.watchOnAway();
  }

  public getPresence(uid: string): Observable<PresenceInterface> {
    return this.db
      .object(`status/${uid}`)
      .valueChanges() as Observable<PresenceInterface>;
  }

  private setPresence(status: PresenceStatusInterface): void {
    const user = this.auth.currentUser;
    if (user) {
      this.db.object(`status/${user.uid}`).update({
        status,
        timestamp: new Date().getTime(),
      } as PresenceInterface);
    }
  }

  private signOut(): void {
    this.setPresence('offline');
    this.auth.signOut();
  }

  private watchAuth(): void {
    this.auth.onAuthStateChanged((user): void => {
      this.setPresence(user ? 'online' : 'offline');
    });
  }

  private watchOnAway(): void {
    document.onvisibilitychange = (): void => {
      if (document.visibilityState === 'hidden') {
        this.setPresence('away');
      } else {
        this.setPresence('online');
      }
    };
  }

  private watchOnDisconnect() {
    return this.auth.onAuthStateChanged((user) => {
      if (user) {
        this.db
          .object(`status/${user.uid}`)
          .query.ref.onDisconnect()
          .update({
            status: 'offline',
            timestamp: new Date().getTime(),
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
