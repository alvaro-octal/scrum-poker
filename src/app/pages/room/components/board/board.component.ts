import { Component, computed, inject, Input, Signal, signal, WritableSignal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RoundService } from '../../../../services/round/round.service';
import { VoteInterface } from '../../../../interfaces/room/round/vote/vote.interface';
import { VoteComponent } from '../vote/vote.component';
import { Observable, switchMap } from 'rxjs';
import { RoundInterface } from '../../../../interfaces/room/round/round.interface';

@Component({
    selector: 'app-board',
    templateUrl: './board.component.html',
    imports: [VoteComponent],
    styleUrls: ['./board.component.scss']
})
export class BoardComponent {
    protected id: WritableSignal<string> = signal('');
    protected round: Signal<RoundInterface | undefined> = toSignal(
        toObservable(this.id).pipe(switchMap((id: string): Observable<RoundInterface> => this.roundService.get(id)))
    );
    protected votes: Signal<VoteInterface[]> = computed((): VoteInterface[] => {
        const round: RoundInterface | undefined = this.round();

        if (!round) {
            return [];
        }

        return Object.keys(round.votes).map((key: string): VoteInterface => {
            return round.votes[key];
        });
    });

    private readonly roundService: RoundService = inject(RoundService);

    @Input({ required: true }) set idInput(id: string) {
        this.id.set(id);
    }
}
