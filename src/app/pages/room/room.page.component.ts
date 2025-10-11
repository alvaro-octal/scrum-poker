import { Component, computed, effect, inject, signal, Signal, WritableSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RoomService } from '../../services/room/room.service';
import { RoomInterface } from '../../interfaces/room/room.interface';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { UserInterface } from '../../interfaces/user/user.interface';
import { Auth } from '@angular/fire/auth';
import { Helpers } from '../../helpers/helpers';
import { PresenceComponent } from './components/presence/presence.component';
import { RoundComponent } from './components/round/round.component';
import { switchMap } from 'rxjs';

@Component({
    selector: 'app-room-page',
    templateUrl: './room.page.component.html',
    imports: [PresenceComponent, RoundComponent],
    styleUrls: ['./room.page.component.scss']
})
export class RoomPageComponent {
    public session: WritableSignal<UserInterface | undefined> = signal(undefined);
    public room: Signal<RoomInterface | undefined>;
    public roundId = computed(() => {
        const room = this.room();
        if (room) {
            const { key } = Helpers.DestructureDocumentPath(room.round.path);
            return key;
        }
        return undefined;
    });

    public users = computed(() => {
        const room = this.room();
        const session = this.session();
        if (room && session) {
            return Object.keys(room.users)
                .filter((key: string): boolean => {
                    return key !== session.uid;
                })
                .map((key: string): UserInterface => {
                    return room.users[key];
                });
        }
        return [];
    });

    private readonly auth: Auth = inject(Auth);
    private readonly route: ActivatedRoute = inject(ActivatedRoute);
    private readonly roomService: RoomService = inject(RoomService);

    constructor() {
        this.room = toSignal(
            this.route.paramMap.pipe(
                switchMap((params: ParamMap) => {
                    const id = params.get('room');
                    if (id) {
                        return this.roomService.get(id);
                    }
                    return [];
                })
            )
        );

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

        effect(async () => {
            const room = this.room();
            const session = this.session();

            if (room && session && !Object.prototype.hasOwnProperty.call(room.users, session.uid)) {
                await this.roomService.join(room.id, session);
            }
        });
    }
}
