import { Component, Input, OnInit } from '@angular/core';
import { RoundInterface } from '../../../../interfaces/room/round/round.interface';
import { VoteInterface, VoteValue } from '../../../../interfaces/room/round/vote/vote.interface';
import { RoomInterface } from '../../../../interfaces/room/room.interface';
import { RoomService } from '../../../../services/room/room.service';
import { RoundService } from '../../../../services/round/round.service';
import { Auth } from '@angular/fire/auth';
import { UserInterface } from '../../../../interfaces/user/user.interface';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-round',
    templateUrl: './round.component.html',
    styleUrls: ['./round.component.scss']
})
export class RoundComponent implements OnInit {
    public voted: boolean = false;
    public round$: Observable<RoundInterface> | undefined;
    public session: UserInterface | undefined;
    public stats: RoundStatsInterface | undefined;
    private _id: string | undefined;
    private _round: RoundInterface | undefined;

    public values: VoteValue[] = [0.5, 1, 2, 3, 5, 8, 13, 21, 34, 55, null];

    @Input() room: RoomInterface | undefined;
    @Input() set id(id: string) {
        this._id = id;
        this.refresh(id);
    }
    constructor(private auth: Auth, private roomService: RoomService, private roundService: RoundService) {
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

        document.addEventListener(
            'keydown',
            (event: KeyboardEvent): void => {
                if (event.code === 'Escape') {
                    if (this._round && !this._round.resolved) {
                        this.deleteVote();
                    }
                }
            },
            false
        );
    }

    private refresh(id: string | undefined = this._id): void {
        if (!id) {
            console.error('No round id provided');
            return;
        }

        this.round$ = this.roundService.get(id);
        this.round$.subscribe((round: RoundInterface): void => {
            this._round = round;
            this.voted = round.votes.hasOwnProperty(this.session?.uid || '');
            if (round.resolved) {
                this.calculateResults(round);
            } else {
                this.stats = undefined;
            }
        });
    }

    ngOnInit(): void {}

    public vote(round: RoundInterface, value: VoteValue): void {
        if (!this.session) {
            console.error('No session was found');
            return;
        }

        this.roundService.vote(round.id, this.session, value);
    }

    public async resolve(round: RoundInterface): Promise<void> {
        await this.roundService.resolve(round.id);
    }

    public calculateResults(round: RoundInterface): void {
        const values: number[] = Object.values(round.votes)
            .map((vote: VoteInterface): number => {
                return vote.value || -1;
            })
            .filter((value: number): boolean => {
                return value >= 0;
            });

        const sum: number = values.reduce((a: number, b: number): number => a + b, 0);
        const avg: number = sum / values.length || 0;
        let std: number = 0;

        if (values.length > 0) {
            std = Math.sqrt(
                values
                    .map((x: number): number => Math.pow(x - avg, 2))
                    .reduce((a: number, b: number): number => a + b) / values.length
            );
        }

        this.stats = {
            count: values.length,
            avg: avg,
            std: std
        };
    }

    public next(): void {
        if (!this.room) {
            console.error('No room was provided');
            return;
        }

        this.stats = undefined;

        this.roomService.next(this.room.id);
    }

    public deleteVote(): void {
        if (!this._id) {
            console.error('Round Id was not provided');
            return;
        } else if (!this.session) {
            console.error('No session was found');
            return;
        }

        this.roundService.deleteVote(this._id, this.session);
    }
}

interface RoundStatsInterface {
    count: number;
    avg: number;
    std: number;
}
