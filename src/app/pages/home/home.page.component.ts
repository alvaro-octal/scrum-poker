import { Component, ElementRef, inject, QueryList, signal, ViewChildren } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { RoomCreationResult, RoomService } from '../../services/room/room.service';
import { UserInterface } from '../../interfaces/user/user.interface';
import { Router } from '@angular/router';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-home',
    templateUrl: './home.page.component.html',
    imports: [ReactiveFormsModule],
    styleUrls: ['./home.page.component.scss']
})
export class HomePageComponent {
    protected showJoin = signal(false);
    protected session = signal<UserInterface | undefined>(undefined);
    protected invalidCode = signal(false);

    protected form = new FormGroup({
        code: new FormArray([
            new FormControl<string>(''),
            new FormControl<string>(''),
            new FormControl<string>(''),
            new FormControl<string>(''),
            new FormControl<string>('')
        ])
    });

    @ViewChildren('input') inputs!: QueryList<ElementRef<HTMLInputElement>>;

    private readonly router: Router = inject(Router);
    private readonly auth: Auth = inject(Auth);
    private readonly roomService: RoomService = inject(RoomService);

    constructor() {
        this.auth.onAuthStateChanged((user): void => {
            if (user) {
                this.session.set({
                    uid: user.uid,
                    displayName: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL
                });
            } else {
                console.error('Auth did not returned user');
            }
        });
    }

    protected async createRoom(): Promise<void> {
        const session = this.session();
        if (session) {
            const result: RoomCreationResult = await this.roomService.create(session);

            await this.router.navigateByUrl(`/room/${result.id}`);
        } else {
            console.error('You mush be logged in to create a room');
        }
    }

    protected async joinRoom(id: string): Promise<void> {
        if (!id) {
            console.error('No id provided!');
            return;
        } else if (!this.session()) {
            console.error('You mush be logged in to create a room');
            return;
        }

        const result: boolean = await this.roomService.join(id, this.session() as UserInterface);

        if (result) {
            await this.router.navigateByUrl(`/room/${id}`);
        } else {
            this.invalidCode.set(true);
            this.form.reset();
            this.inputs.first.nativeElement.focus();
            setTimeout(() => {
                this.invalidCode.set(false);
            }, 500);
        }
    }

    protected async handleInput(event: KeyboardEvent, index: number): Promise<void> {
        const input = this.inputs?.get(index);

        if (!input) {
            console.warn('Input is not defined');
            return;
        }
        const previous = this.inputs?.get(index - 1);

        if (input.nativeElement.value.length === 0 && event.code === 'Backspace' && previous) {
            previous.nativeElement.focus();
        }

        if (input.nativeElement.value.length === 1) {
            if (index < this.inputs!.length - 1) {
                this.inputs?.get(index + 1)?.nativeElement.focus();
            } else {
                await this.joinRoom(this.form.value.code?.join('') || '');
            }
        }
    }

    protected async handlePaste(event: ClipboardEvent): Promise<void> {
        event.preventDefault();
        const pasteData = event.clipboardData?.getData('text/plain');
        if (pasteData) {
            for (let i = 0; i < pasteData.length; i++) {
                if (i < this.form.controls.code.length) {
                    this.form.controls.code.at(i).setValue(pasteData[i]);
                }
            }

            await this.joinRoom(this.form.value.code?.join('') || '');
        }
    }
}
