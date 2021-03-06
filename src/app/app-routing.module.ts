import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SetupComponent} from "./setup/setup.component";
import {HomeComponent} from "./home/home.component";

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'setup', component: SetupComponent },
  { path: '', redirectTo: '/setup', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
