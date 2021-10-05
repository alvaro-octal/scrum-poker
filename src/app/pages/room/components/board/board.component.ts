import { Component, Input } from '@angular/core';
import { RoundService } from '../../../../services/round/round.service';
import { Observable } from 'rxjs';
import { RoundInterface } from '../../../../interfaces/room/round/round.interface';
import { VoteInterface } from '../../../../interfaces/room/round/vote/vote.interface';
import { RoomInterface } from '../../../../interfaces/room/room.interface';

@Component({
    selector: 'app-board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.scss']
})
export class BoardComponent {
    public round$: Observable<RoundInterface> | undefined;
    public votes: VoteInterface[] | undefined;

    private _id: string | undefined;

    @Input() room: RoomInterface | undefined;
    @Input() set id(id: string) {
        this._id = id;
        this.refresh(id);
    }
    constructor(private roundService: RoundService) {}

    private refresh(id: string | undefined = this._id): void {
        if (!id) {
            console.error('No round id provided');
            return;
        }

        this.round$ = this.roundService.get(id);
        this.round$.subscribe((round: RoundInterface): void => {
            this.votes = Object.keys(round.votes).map((key: string): VoteInterface => {
                return round.votes[key];
            });
        });
    }
}
