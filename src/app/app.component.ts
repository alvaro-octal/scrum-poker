import { Component } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { UserInterface } from './interfaces/user/user.interface';
import { Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    public id: string | undefined;
    public session: UserInterface | undefined;

    constructor(private router: Router, private auth: Auth) {
        this.auth.onAuthStateChanged((user): void => {
            if (user) {
                // this.router.navigateByUrl('/');
            } else {
                this.router.navigateByUrl('/login');
            }
        });
    }

    public logout(): void {
        this.auth.signOut();
    }
}
