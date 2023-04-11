import { Component, Input, OnInit } from '@angular/core';
import { VoteInterface } from '../../../../interfaces/room/round/vote/vote.interface';

@Component({
    selector: 'app-vote',
    templateUrl: './vote.component.html',
    styleUrls: ['./vote.component.scss']
})
export class VoteComponent implements OnInit {
    public initials: string | undefined;
    public corporate: boolean | undefined;

    @Input() vote: VoteInterface | undefined;
    @Input() flipped: boolean | undefined;
    constructor() {}

    ngOnInit(): void {
        if (!this.vote) {
            console.error('No vote has been provided');
            return;
        } else if (!this.vote.user.displayName) {
            console.warn('Provided user does not have displayName');
            return;
        }

        const names = this.vote.user.displayName.split(' ');
        let initials = names[0].substring(0, 1).toUpperCase();

        if (names.length > 1) {
            initials += ` ${names[names.length - 1].substring(0, 5).toUpperCase()}`;
        }

        this.corporate = !this.vote.user.email?.endsWith('@gmail.com');

        this.initials = initials;
    }
}
