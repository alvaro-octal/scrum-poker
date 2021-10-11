import { Component, Input, OnInit } from '@angular/core';
import { PresenceInterface, PresenceService } from '../../services/presence/presence.service';
import { Observable } from 'rxjs';
import { UserInterface } from '../../interfaces/user/user.interface';

@Component({
    selector: 'app-user-horizontal',
    templateUrl: './user-horizontal.component.html',
    styleUrls: ['./user-horizontal.component.scss']
})
export class UserHorizontalComponent implements OnInit {
    public presence$: Observable<PresenceInterface> | undefined;

    @Input() user: UserInterface | undefined;
    @Input() check: boolean = false;
    constructor(private presence: PresenceService) {}

    ngOnInit() {
        if (this.user) {
            this.presence$ = this.presence.getPresence(this.user.uid);
        } else {
            console.error('No UID provided to user component');
        }
    }
}
