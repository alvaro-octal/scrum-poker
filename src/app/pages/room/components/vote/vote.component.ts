import { Component, Input, OnInit, signal, WritableSignal } from '@angular/core';
import { VoteInterface } from '../../../../interfaces/room/round/vote/vote.interface';
import { OptionRendererPipe } from '../../../../pipes/option/option.renderer.pipe';

@Component({
    selector: 'app-vote',
    templateUrl: './vote.component.html',
    imports: [OptionRendererPipe],
    styleUrls: ['./vote.component.scss']
})
export class VoteComponent implements OnInit {
    public initials: WritableSignal<string | undefined> = signal(undefined);
    public corporate: WritableSignal<boolean | undefined> = signal(undefined);

    @Input({ required: true }) vote: VoteInterface | undefined;
    @Input({ required: true }) flipped: boolean | undefined;

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

        this.corporate.set(!this.vote.user.email?.endsWith('@gmail.com'));

        this.initials.set(initials);
    }
}
