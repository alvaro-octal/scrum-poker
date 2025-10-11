import { Component, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { PresenceService } from '../../services/presence/presence.service';
import { UserInterface } from '../../interfaces/user/user.interface';
import { NgClass } from '@angular/common';
import { filter, switchMap } from 'rxjs';

@Component({
    selector: 'app-user-horizontal',
    templateUrl: './user-horizontal.component.html',
    imports: [NgClass],
    styleUrls: ['./user-horizontal.component.scss']
})
export class UserHorizontalComponent {
    public user = input.required<UserInterface>();
    public presence = toSignal(
        toObservable(this.user).pipe(
            filter((user): user is UserInterface => !!user),
            switchMap((user) => this.presenceService.getPresence(user.uid))
        )
    );

    public check = input(false);

    private readonly presenceService: PresenceService = inject(PresenceService);
}
