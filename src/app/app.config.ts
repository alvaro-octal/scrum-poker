import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { FirebaseApp, initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { Firestore, getFirestore, provideFirestore } from '@angular/fire/firestore';
import { Database, getDatabase, provideDatabase } from '@angular/fire/database';

export const AppConfig: ApplicationConfig = {
    providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        provideFirebaseApp((): FirebaseApp => initializeApp(environment.firebase)),
        provideFirestore((): Firestore => getFirestore()),
        provideDatabase((): Database => getDatabase()),
        provideAuth(() => getAuth()),
        provideHttpClient()
    ]
};
