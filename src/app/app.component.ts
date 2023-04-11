import { Component } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    public id: string | undefined;
    public originalURL: string;

    constructor(private router: Router, private auth: Auth) {
        this.originalURL = document.location.pathname;

        this.auth.onAuthStateChanged(async (user): Promise<void> => {
            if (user) {
                if (this.originalURL.startsWith('/room')) {
                    await this.router.navigateByUrl(this.originalURL);
                } else {
                    await this.router.navigateByUrl('/');
                }
            } else {
                await this.router.navigateByUrl('/login');
            }
        });
    }
}
