import { Component, OnInit } from '@angular/core';
import { GoogleAuthProvider } from 'firebase/auth';
import { Auth, signInWithPopup } from '@angular/fire/auth';

@Component({
    selector: 'app-login-page',
    templateUrl: './login.page.component.html',
    styleUrls: ['./login.page.component.scss']
})
export class LoginPageComponent implements OnInit {
    public message: string;
    private messages: string[] = [
        'Now with money',
        'Such code, WOW',
        'Esto no sirve para nada',
        'Happy coding :)',
        'API v2, próximamente',
        'Releasing on time',
        'Not responsive!'
    ];

    constructor(private auth: Auth) {
        this.message = this.messages[Math.floor(Math.random() * this.messages.length)];
    }

    ngOnInit(): void {}

    public login(): void {
        const provider = new GoogleAuthProvider();

        signInWithPopup(this.auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);

                if (credential) {
                    const token = credential.accessToken;
                } else {
                    console.error('No credential found!', credential);
                }

                // ...
            })
            .catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                // ...

                console.error(error);
                console.debug({
                    code: errorCode,
                    message: errorMessage,
                    email: email,
                    credential: credential
                });
            });
    }
}
