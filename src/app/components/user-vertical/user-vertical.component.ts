import { Component, inject, Input, OnInit } from '@angular/core';
import { PresenceInterface, PresenceService } from '../../services/presence/presence.service';
import { Observable } from 'rxjs';
import { UserInterface } from '../../interfaces/user/user.interface';

@Component({
    selector: 'app-user-vertical',
    templateUrl: './user-vertical.component.html',
    styleUrls: ['./user-vertical.component.scss']
})
export class UserVerticalComponent implements OnInit {
    public presence$: Observable<PresenceInterface> | undefined;

    @Input({ required: true }) user: UserInterface | undefined;

    private readonly presence: PresenceService = inject(PresenceService);

    ngOnInit() {
        if (this.user) {
            this.presence$ = this.presence.getPresence(this.user.uid);
        } else {
            console.error('No UID provided to user component');
        }
    }
}
