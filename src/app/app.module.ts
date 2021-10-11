import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { UserVerticalComponent } from './components/user-vertical/user-vertical.component';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFireModule } from '@angular/fire/compat';
import { LoginPageComponent } from './pages/login/login.page.component';
import { RoomPageComponent } from './pages/room/room.page.component';
import { FormsModule } from '@angular/forms';
import { HomePageComponent } from './pages/home/home.page.component';
import { UserHorizontalComponent } from './components/user-horizontal/user-horizontal.component';
import { VoteComponent } from './pages/room/components/vote/vote.component';
import { BoardComponent } from './pages/room/components/board/board.component';
import { RoundComponent } from './pages/room/components/round/round.component';
import { OptionsComponent } from './pages/room/components/options/options.component';
import { OptionRendererPipe } from './pipes/option/option.renderer.pipe';

@NgModule({
    declarations: [
        AppComponent,
        UserVerticalComponent,
        LoginPageComponent,
        RoomPageComponent,
        BoardComponent,
        HomePageComponent,
        UserHorizontalComponent,
        VoteComponent,
        BoardComponent,
        RoundComponent,
        OptionsComponent,
        OptionRendererPipe
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideFirestore(() => getFirestore()),
        provideDatabase(() => getDatabase()),
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireDatabaseModule,
        provideAuth(() => getAuth()),
        FormsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
