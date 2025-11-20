import { Component, computed, effect, EventEmitter, Input, Output, signal, WritableSignal } from '@angular/core';
import { VoteValue } from '../../../../interfaces/room/round/vote/vote.interface';
import { UserInterface } from '../../../../interfaces/user/user.interface';
import { RoomInterface } from '../../../../interfaces/room/room.interface';
import { OptionRendererPipe } from '../../../../pipes/option/option.renderer.pipe';

@Component({
    selector: 'app-options',
    templateUrl: './options.component.html',
    imports: [OptionRendererPipe],
    styleUrls: ['./options.component.scss']
})
export class OptionsComponent {
    protected fadeout = signal(false);
    protected optionSelected: WritableSignal<VoteValue | undefined> = signal(undefined);
    protected options: WritableSignal<VoteValue[]> = signal([]);
    protected rumble = computed(() => {
        const room = this._room();
        const session = this._session();
        if (!session || !room) {
            return undefined;
        }

        const value: number | undefined = room.coffees[session.uid];

        if (!value) {
            return undefined;
        } else {
            return `rumble-${Math.min(value, 30)}`;
        }
    });

    private _session: WritableSignal<UserInterface | undefined> = signal(undefined);
    private _room: WritableSignal<RoomInterface | undefined> = signal(undefined);
    private _values: WritableSignal<VoteValue[] | undefined> = signal(undefined);

    @Input({ required: true }) set session(value: UserInterface | undefined) {
        this._session.set(value);
    }
    @Input({ required: true }) set room(value: RoomInterface | undefined) {
        this._room.set(value);
    }
    @Input({ required: true }) set values(values: VoteValue[] | undefined) {
        this._values.set(values);
    }
    @Output() selected = new EventEmitter<VoteValue>();

    constructor() {
        effect(() => {
            const values = this._values();
            this.options.set([]);
            if (values) {
                for (let index = 0; index < values.length; index++) {
                    setTimeout((): void => {
                        this.options.update((options) => [...options, values[index]]);
                    }, 25 * index);
                }
            }
        });

        document.addEventListener(
            'keydown',
            (event: KeyboardEvent): void => {
                const index: number = Number(event.key);

                if (!Number.isNaN(index) && this.options() && this.options()[index] !== undefined) {
                    this.fadeoutAndEmit(this.options()[index]);
                }
            },
            false
        );
    }

    protected onOptionSelected(value: VoteValue): void {
        if (this.optionSelected()) {
            return;
        }

        this.optionSelected.set(value);
        setTimeout((): void => {
            this.fadeoutAndEmit(value);
        }, 250);
    }

    private fadeoutAndEmit(value: VoteValue): void {
        this.fadeout.set(true);
        setTimeout((): void => {
            this.selected.emit(value);
        }, 250);
    }
}
