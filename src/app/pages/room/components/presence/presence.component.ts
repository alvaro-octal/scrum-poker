import { Component, Input } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { UserInterface } from '../../../../interfaces/user/user.interface';
import { RoundService } from '../../../../services/round/round.service';
import { Observable } from 'rxjs';
import { RoundInterface } from '../../../../interfaces/room/round/round.interface';

@Component({
    selector: 'app-presence',
    templateUrl: './presence.component.html',
    styleUrls: ['./presence.component.scss'],
    standalone: false
})
export class PresenceComponent {
    public session: UserInterface | undefined;
    public round$: Observable<RoundInterface> | undefined;

    @Input() users: UserInterface[] | undefined;
    @Input() set round(round: string) {
        this.round$ = this.roundService.get(round);
    }
    constructor(
        private auth: Auth,
        private roundService: RoundService
    ) {
        this.auth.onAuthStateChanged((user): void => {
            if (user) {
                this.session = {
                    uid: user.uid,
                    displayName: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL
                };
            } else {
                console.error('Auth did not returned user');
            }
        });
    }
}
