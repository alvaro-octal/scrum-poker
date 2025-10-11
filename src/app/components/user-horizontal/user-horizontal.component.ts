import { Component, inject, input, InputSignal, Signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { PresenceInterface, PresenceService } from '../../services/presence/presence.service';
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
    public user: InputSignal<UserInterface> = input.required<UserInterface>();
    public check: InputSignal<boolean> = input.required<boolean>();

    protected presence: Signal<PresenceInterface | undefined> = toSignal(
        toObservable(this.user).pipe(
            filter((user): user is UserInterface => !!user),
            switchMap((user) => this.presenceService.getPresence(user.uid))
        )
    );

    private readonly presenceService: PresenceService = inject(PresenceService);
}
