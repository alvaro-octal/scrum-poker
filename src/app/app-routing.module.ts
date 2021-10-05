import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoomPageComponent } from './pages/room/room.page.component';
import { LoginPageComponent } from './pages/login/login.page.component';
import { HomePageComponent } from './pages/home/home.page.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: HomePageComponent },
  { path: 'login', pathMatch: 'full', component: LoginPageComponent },
  { path: 'room/:room', pathMatch: 'full', component: RoomPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
