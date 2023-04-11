import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { VoteValue } from '../../../../interfaces/room/round/vote/vote.interface';
import { UserInterface } from '../../../../interfaces/user/user.interface';
import { RoomInterface } from '../../../../interfaces/room/room.interface';

@Component({
    selector: 'app-options',
    templateUrl: './options.component.html',
    styleUrls: ['./options.component.scss']
})
export class OptionsComponent implements OnInit {
    public fadeout: boolean = false;
    public optionSelected: VoteValue | undefined;
    public options: VoteValue[] | undefined;
    public rumble: string | undefined;

    private _session: UserInterface | undefined;
    private _room: RoomInterface | undefined;

    @Input() set session(value: UserInterface | undefined) {
        this._session = value;
        this.calculateRumble(this._session, this._room);
    }
    @Input() set room(value: RoomInterface | undefined) {
        this._room = value;
        this.calculateRumble(this._session, this._room);
    }
    @Input() set values(values: VoteValue[] | undefined) {
        this.options = [];

        if (!values) {
            return;
        }

        for (let index = 0; index < values.length; index++) {
            setTimeout((): void => {
                this.options?.push(values[index]);
            }, 25 * index);
        }
    }
    @Output() selected = new EventEmitter<VoteValue>();
    constructor() {
        document.addEventListener(
            'keydown',
            (event: KeyboardEvent): void => {
                const index: number = Number(event.key);

                if (!Number.isNaN(index) && this.options && this.options[index] !== undefined) {
                    this.fadeoutAndEmit(this.options[index]);
                }
            },
            false
        );
    }

    ngOnInit(): void {}

    public onOptionSelected(value: VoteValue): void {
        if (this.optionSelected) {
            return;
        }

        this.optionSelected = value;
        setTimeout((): void => {
            this.fadeoutAndEmit(value);
        }, 250);
    }

    private fadeoutAndEmit(value: VoteValue): void {
        this.fadeout = true;
        setTimeout((): void => {
            this.selected.emit(value);
        }, 250);
    }

    private calculateRumble(user: UserInterface | undefined, room: RoomInterface | undefined): void {
        console.log({
            user: user,
            room: room
        });
        if (!user) {
            return;
        } else if (!room) {
            return;
        }

        const value: number | undefined = room.coffees[user.uid];

        if (!value) {
            this.rumble = undefined;
        } else {
            this.rumble = `rumble-${Math.min(value, 30)}`;
        }
    }
}
