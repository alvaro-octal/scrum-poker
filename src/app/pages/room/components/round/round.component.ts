import { Component, effect, inject, Input, signal, WritableSignal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RoundInterface } from '../../../../interfaces/room/round/round.interface';
import { VoteInterface, VoteValue } from '../../../../interfaces/room/round/vote/vote.interface';
import { RoomInterface } from '../../../../interfaces/room/room.interface';
import { RoomService } from '../../../../services/room/room.service';
import { RoundService } from '../../../../services/round/round.service';
import { Auth } from '@angular/fire/auth';
import { UserInterface } from '../../../../interfaces/user/user.interface';
import { filter, switchMap } from 'rxjs';
import confetti from 'canvas-confetti';
import { BoardComponent } from '../board/board.component';
import { DecimalPipe } from '@angular/common';
import { OptionsComponent } from '../options/options.component';

@Component({
    selector: 'app-round',
    templateUrl: './round.component.html',
    imports: [BoardComponent, OptionsComponent, DecimalPipe],
    styleUrls: ['./round.component.scss']
})
export class RoundComponent {
    protected voted: WritableSignal<boolean> = signal(false);
    protected session: WritableSignal<UserInterface | undefined> = signal(undefined);
    protected stats: WritableSignal<RoundStatsInterface | undefined> = signal(undefined);
    private _id: WritableSignal<string> = signal('');
    protected round = toSignal(
        toObservable(this._id).pipe(
            filter((id) => !!id),
            switchMap((id) => this.roundService.get(id))
        )
    );

    protected values: VoteValue[] = [0.5, 1, 2, 3, 5, 8, 13, 21, 34, 55, null];

    @Input({ required: true }) room: RoomInterface | undefined;
    @Input({ required: true }) set id(id: string) {
        this._id.set(id);
    }
    private readonly auth: Auth = inject(Auth);
    private readonly roomService: RoomService = inject(RoomService);
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

        effect(() => {
            const round = this.round();
            if (round) {
                this.voted.set(Object.prototype.hasOwnProperty.call(round.votes, this.session()?.uid || ''));

                if (round.resolved) {
                    this.calculateResults(round);
                } else {
                    this.stats.set(undefined);
                }
            }
        });

        document.addEventListener(
            'keydown',
            async (event: KeyboardEvent): Promise<void> => {
                if (event.code === 'Escape') {
                    const round = this.round();
                    if (round && !round.resolved) {
                        await this.deleteVote();
                    }
                }
            },
            false
        );
    }

    protected async vote(value: VoteValue): Promise<void> {
        const round = this.round();
        const session = this.session();
        if (!round) {
            console.error('No round was found');
            return;
        } else if (!session) {
            console.error('No session was found');
            return;
        } else if (!this.room?.id) {
            console.error('No session was found');
            return;
        }

        await this.roundService.vote(round.id, session, value);
        await this.roomService.coffee(this.room?.id, session, value === null ? 10 : -5);
    }

    protected async resolve(): Promise<void> {
        const round = this.round();
        if (round) {
            await this.roundService.resolve(round.id);
        }
    }

    protected calculateResults(round: RoundInterface): void {
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

        this.stats.set({
            count: values.length,
            avg: avg,
            std: std
        });

        if (std === 0 && values.length > 1) {
            this.launchConfetti();
        }
    }

    protected async next(): Promise<void> {
        if (!this.room) {
            console.error('No room was provided');
            return;
        }

        this.stats.set(undefined);

        await this.roomService.next(this.room.id);
    }

    protected async deleteVote(): Promise<void> {
        const id = this._id();
        const session = this.session();
        if (!id) {
            console.error('Round Id was not provided');
            return;
        } else if (!session) {
            console.error('No session was found');
            return;
        }

        await this.roundService.deleteVote(id, session);
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
