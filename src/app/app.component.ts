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
    public originalURL: string;

    constructor(private router: Router, private auth: Auth) {
        this.originalURL = document.location.pathname;

        this.auth.onAuthStateChanged((user): void => {
            if (user) {
                if (this.originalURL === '/login') {
                    this.router.navigateByUrl('/');
                } else if (this.originalURL.length > 1) {
                    this.router.navigateByUrl(this.originalURL);
                }
            } else {
                this.router.navigateByUrl('/login');
            }
        });
    }

    public logout(): void {
        this.auth.signOut();
    }
}
