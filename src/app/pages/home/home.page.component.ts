import { Component, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { RoomCreationResult, RoomService } from '../../services/room/room.service';
import { UserInterface } from '../../interfaces/user/user.interface';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-home',
    templateUrl: './home.page.component.html',
    imports: [FormsModule],
    styleUrls: ['./home.page.component.scss']
})
export class HomePageComponent {
    public showJoin: boolean = false;
    public id: string | undefined;
    public session: UserInterface | undefined;

    private readonly router: Router = inject(Router);
    private readonly auth: Auth = inject(Auth);
    private readonly roomService: RoomService = inject(RoomService);

    constructor() {
        this.auth.onAuthStateChanged((user): void => {
            if (user) {
                this.session = {
                    uid: user.uid,
                    displayName: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL
                };
            } else {
                console.error('Auth did not returned user');
            }
        });
    }

    public async createRoom(): Promise<void> {
        if (this.session) {
            const result: RoomCreationResult = await this.roomService.create(this.session);

            await this.router.navigateByUrl(`/room/${result.id}`);
        } else {
            console.error('You mush be logged in to create a room');
        }
    }

    public async joinRoom(id: string | undefined = this.id): Promise<void> {
        if (!id) {
            console.error('No id provided!');
            return;
        } else if (!this.session) {
            console.error('You mush be logged in to create a room');
            return;
        }

        await this.roomService.join(id, this.session);

        await this.router.navigateByUrl(`/room/${id}`);
    }

    public async checkJoin(id: string): Promise<void> {
        if (id?.length === 5) {
            await this.joinRoom(id);
        }
    }
}
