import { Component, OnInit } from '@angular/core';
import { RoomService } from '../../services/room/room.service';
import { Observable } from 'rxjs';
import { RoomInterface } from '../../interfaces/room/room.interface';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { UserInterface } from '../../interfaces/user/user.interface';
import { Auth } from '@angular/fire/auth';
import { Helpers } from '../../helpers/helpers';

@Component({
  selector: 'app-room.page',
  templateUrl: './room.page.component.html',
  styleUrls: ['./room.page.component.scss'],
})
export class RoomPageComponent implements OnInit {
  public session: UserInterface | undefined;
  public users: UserInterface[] = [];
  public room$: Observable<RoomInterface> | undefined;
  public roundId: string | undefined;

  constructor(
    private auth: Auth,
    private route: ActivatedRoute,
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

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap): void => {
      const id: string | null = params.get('room');

      if (id) {
        this.room$ = this.roomService.get(id);

        this.room$.subscribe((room: RoomInterface): void => {
          if (!this.session?.uid) {
            console.error('No session found!');
            return;
          }

          console.log({
            room: room,
          });

          const { key } = Helpers.destructureDocumentPath(room.round.path);
          this.roundId = key;

          console.log({
            roundId: this.roundId,
          });

          const uid: string = this.session.uid;

          this.users = Object.keys(room.users)
            .filter((key: string): boolean => {
              return key !== uid;
            })
            .map((key: string): UserInterface => {
              return room.users[key];
            });

          if (!room.users.hasOwnProperty(uid)) {
            this.roomService.join(id, this.session);
          }
        });
      } else {
        console.error('No room id provided');
      }
    });
  }
}
