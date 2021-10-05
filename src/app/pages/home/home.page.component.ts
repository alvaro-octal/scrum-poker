import { Component } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  RoomCreationResult,
  RoomService,
} from '../../services/room/room.service';
import { UserInterface } from '../../interfaces/user/user.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.component.html',
  styleUrls: ['./home.page.component.scss'],
})
export class HomePageComponent {
  public showJoin: boolean = false;
  public id: string | undefined;
  public session: UserInterface | undefined;

  constructor(
    private router: Router,
    private auth: Auth,
    private roomService: RoomService
  ) {
    this.auth.onAuthStateChanged((user): void => {
      if (user) {
        this.session = {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        };
      } else {
        console.error('Auth did not returned user');
      }
    });
  }

  public async createRoom(): Promise<void> {
    if (this.session) {
      const result: RoomCreationResult = await this.roomService.create(
        this.session
      );

      this.router.navigateByUrl(`/room/${result.id}`);
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

    this.router.navigateByUrl(`/room/${id}`);
  }

  public checkJoin(id: string): void {
    if (id?.length === 5) {
      this.joinRoom(id);
    }
  }
}
