import { Component, inject, signal } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    imports: [RouterOutlet, CommonModule],
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    protected originalURL: string;
    protected isLoggedIn = signal(false);

    private readonly router: Router = inject(Router);
    private readonly auth: Auth = inject(Auth);

    constructor() {
        this.originalURL = document.location.pathname;

        this.auth.onAuthStateChanged(async (user): Promise<void> => {
            if (user) {
                this.isLoggedIn.set(true);
                if (this.originalURL.startsWith('/room')) {
                    await this.router.navigateByUrl(this.originalURL);
                } else {
                    await this.router.navigateByUrl('/');
                }
            } else {
                this.isLoggedIn.set(false);
                await this.router.navigateByUrl('/login');
            }
        });
    }

    protected async logout(): Promise<void> {
        await this.auth.signOut();
    }
}
