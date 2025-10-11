import { Component, inject, input, signal, WritableSignal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Auth } from '@angular/fire/auth';
import { UserInterface } from '../../../../interfaces/user/user.interface';
import { RoundService } from '../../../../services/round/round.service';
import { UserHorizontalComponent } from '../../../../components/user-horizontal/user-horizontal.component';
import { switchMap } from 'rxjs';

@Component({
    selector: 'app-presence',
    templateUrl: './presence.component.html',
    imports: [UserHorizontalComponent],
    styleUrls: ['./presence.component.scss']
})
export class PresenceComponent {
    public session: WritableSignal<UserInterface | undefined> = signal(undefined);
    public users = input<UserInterface[] | undefined>(undefined);
    public round = input.required<string>();
    public roundSignal = toSignal(toObservable(this.round).pipe(switchMap((round) => this.roundService.get(round))));

    private readonly auth: Auth = inject(Auth);
    private readonly roundService: RoundService = inject(RoundService);

    constructor() {
        this.auth.onAuthStateChanged((user): void => {
            if (user) {
                this.session.set({
                    uid: user.uid,
                    displayName: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL
                });
            } else {
                console.error('Auth did not returned user');
            }
        });
    }
}
