import { Component, inject, OnInit } from '@angular/core';
import { RoomService } from '../../services/room/room.service';
import { Observable } from 'rxjs';
import { RoomInterface } from '../../interfaces/room/room.interface';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { UserInterface } from '../../interfaces/user/user.interface';
import { Auth } from '@angular/fire/auth';
import { Helpers } from '../../helpers/helpers';
import { PresenceComponent } from './components/presence/presence.component';
import { RoundComponent } from './components/round/round.component';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-room-page',
    templateUrl: './room.page.component.html',
    imports: [PresenceComponent, RoundComponent, AsyncPipe],
    styleUrls: ['./room.page.component.scss']
})
export class RoomPageComponent implements OnInit {
    public session: UserInterface | undefined;
    public users: UserInterface[] = [];
    public room$: Observable<RoomInterface> | undefined;
    public roundId: string | undefined;

    private readonly auth: Auth = inject(Auth);
    private readonly route: ActivatedRoute = inject(ActivatedRoute);
    private readonly roomService: RoomService = inject(RoomService);

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

    ngOnInit() {
        this.route.paramMap.subscribe((params: ParamMap): void => {
            const id: string | null = params.get('room');

            if (id) {
                this.room$ = this.roomService.get(id);

                this.room$.subscribe(async (room: RoomInterface): Promise<void> => {
                    if (!this.session?.uid) {
                        console.error('No session found!');
                        return;
                    }

                    const { key } = Helpers.DestructureDocumentPath(room.round.path);
                    this.roundId = key;

                    const uid: string = this.session.uid;

                    this.users = Object.keys(room.users)
                        .filter((key: string): boolean => {
                            return key !== uid;
                        })
                        .map((key: string): UserInterface => {
                            return room.users[key];
                        });

                    if (!Object.prototype.hasOwnProperty.call(room.users, uid)) {
                        await this.roomService.join(id, this.session);
                    }
                });
            } else {
                console.error('No room id provided');
            }
        });
    }
}
