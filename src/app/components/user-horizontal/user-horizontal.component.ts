import { Component, inject, Input, OnInit } from '@angular/core';
import { PresenceInterface, PresenceService } from '../../services/presence/presence.service';
import { Observable } from 'rxjs';
import { UserInterface } from '../../interfaces/user/user.interface';
import { AsyncPipe, NgClass } from '@angular/common';

@Component({
    selector: 'app-user-horizontal',
    templateUrl: './user-horizontal.component.html',
    imports: [NgClass, AsyncPipe],
    styleUrls: ['./user-horizontal.component.scss']
})
export class UserHorizontalComponent implements OnInit {
    public presence$: Observable<PresenceInterface> | undefined;

    @Input({ required: true }) user: UserInterface | undefined;
    @Input({ required: true }) check: boolean = false;

    private readonly presence: PresenceService = inject(PresenceService);

    ngOnInit() {
        if (this.user) {
            this.presence$ = this.presence.getPresence(this.user.uid);
        } else {
            console.error('No UID provided to user component');
        }
    }
}
