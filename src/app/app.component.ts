import { Component, inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router, RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    imports: [RouterOutlet],
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    public id: string | undefined;
    public originalURL: string;

    private readonly router: Router = inject(Router);
    private readonly auth: Auth = inject(Auth);

    constructor() {
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
