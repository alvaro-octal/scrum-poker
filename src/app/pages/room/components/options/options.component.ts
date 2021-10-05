import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-options',
    templateUrl: './options.component.html',
    styleUrls: ['./options.component.scss']
})
export class OptionsComponent implements OnInit {
    public fadeout: boolean = false;
    public optionSelected: number | undefined;
    public options: number[] | undefined;

    @Input() set values(values: number[] | undefined) {
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
    @Output() selected = new EventEmitter<number>();
    constructor() {}

    ngOnInit(): void {}

    public onOptionSelected(value: number): void {
        if (this.optionSelected) {
            return;
        }

        this.optionSelected = value;
        setTimeout((): void => {
            this.fadeoutAndEmit(value);
        }, 250);
    }

    private fadeoutAndEmit(value: number): void {
        this.fadeout = true;
        setTimeout((): void => {
            this.selected.emit(value);
        }, 250);
    }
}
