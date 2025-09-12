import { Component, inject, Input } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { UserInterface } from '../../../../interfaces/user/user.interface';
import { RoundService } from '../../../../services/round/round.service';
import { Observable } from 'rxjs';
import { RoundInterface } from '../../../../interfaces/room/round/round.interface';
import { UserHorizontalComponent } from '../../../../components/user-horizontal/user-horizontal.component';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-presence',
    templateUrl: './presence.component.html',
    imports: [UserHorizontalComponent, AsyncPipe],
    styleUrls: ['./presence.component.scss']
})
export class PresenceComponent {
    public session: UserInterface | undefined;
    public round$: Observable<RoundInterface> | undefined;

    @Input({ required: true }) users: UserInterface[] | undefined;
    @Input({ required: true }) set round(round: string) {
        this.round$ = this.roundService.get(round);
    }

    private readonly auth: Auth = inject(Auth);
    private readonly roundService: RoundService = inject(RoundService);

    constructor() {
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
