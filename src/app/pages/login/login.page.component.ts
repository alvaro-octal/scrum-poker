import { Component, inject, signal } from '@angular/core';
import { GoogleAuthProvider } from 'firebase/auth';
import { Auth, signInWithPopup } from '@angular/fire/auth';

@Component({
    selector: 'app-login-page',
    templateUrl: './login.page.component.html',
    styleUrls: ['./login.page.component.scss']
})
export class LoginPageComponent {
    protected message = signal('');
    private messages: string[] = [
        'Now with money',
        'Such code, WOW',
        'Esto no sirve para nada',
        'Happy coding :)',
        'API v2, próximamente',
        'Releasing on time',
        'Not responsive!',
        'Caffeine-powered code',
        'Works, but why?',
        'Debugging: needle in haystack',
        'Code for psychopaths'
    ];

    private readonly auth: Auth = inject(Auth);

    constructor() {
        this.message.set(this.messages[Math.floor(Math.random() * this.messages.length)]);
    }

    protected async login(): Promise<void> {
        const provider = new GoogleAuthProvider();

        try {
            const result = await signInWithPopup(this.auth, provider);

            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);

            if (!credential) {
                console.error('No credential found!', credential);
            }
        } catch (error) {
            console.error(error);
        }
    }
}
