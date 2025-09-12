import { Component, Input } from '@angular/core';
import { RoundInterface } from '../../../../interfaces/room/round/round.interface';
import { VoteInterface, VoteValue } from '../../../../interfaces/room/round/vote/vote.interface';
import { RoomInterface } from '../../../../interfaces/room/room.interface';
import { RoomService } from '../../../../services/room/room.service';
import { RoundService } from '../../../../services/round/round.service';
import { Auth } from '@angular/fire/auth';
import { UserInterface } from '../../../../interfaces/user/user.interface';
import { Observable } from 'rxjs';
import * as confetti from 'canvas-confetti';

@Component({
    selector: 'app-round',
    templateUrl: './round.component.html',
    styleUrls: ['./round.component.scss']
})
export class RoundComponent {
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
    constructor(
        private auth: Auth,
        private roomService: RoomService,
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

        document.addEventListener(
            'keydown',
            async (event: KeyboardEvent): Promise<void> => {
                if (event.code === 'Escape') {
                    if (this._round && !this._round.resolved) {
                        await this.deleteVote();
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

            this.voted = Object.prototype.hasOwnProperty.call(round.votes, this.session?.uid || '');

            if (round.resolved) {
                this.calculateResults(round);
            } else {
                this.stats = undefined;
            }
        });
    }

    public async vote(round: RoundInterface, value: VoteValue): Promise<void> {
        if (!this.session) {
            console.error('No session was found');
            return;
        } else if (!this.room?.id) {
            console.error('No session was found');
            return;
        }

        await this.roundService.vote(round.id, this.session, value);
        await this.roomService.coffee(this.room?.id, this.session, value === null ? 10 : -5);
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

        if (std === 0 && values.length > 1) {
            this.launchConfetti();
        }
    }

    public async next(): Promise<void> {
        if (!this.room) {
            console.error('No room was provided');
            return;
        }

        this.stats = undefined;

        await this.roomService.next(this.room.id);
    }

    public async deleteVote(): Promise<void> {
        if (!this._id) {
            console.error('Round Id was not provided');
            return;
        } else if (!this.session) {
            console.error('No session was found');
            return;
        }

        await this.roundService.deleteVote(this._id, this.session);
    }

    private launchConfetti(): void {
        const canvas: HTMLCanvasElement = document.getElementsByTagName('canvas')[0];

        if (!canvas) {
            return;
        }

        const confettiCannon: confetti.CreateTypes = confetti.create(canvas, {
            resize: true
        });

        confettiCannon({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }
}

interface RoundStatsInterface {
    count: number;
    avg: number;
    std: number;
}
