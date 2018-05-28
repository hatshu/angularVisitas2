import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { ContactlistComponent } from './contactlist/contactlist.component';
import { ContactformComponent } from './contactform/contactform.component';
import { HomeComponent } from './home/home.component';

const appRoutes: Routes = [
  { path: 'home' , component: HomeComponent },
  { path: 'contaclist' , component: ContactlistComponent },
  { path: 'contactform', component: ContactformComponent },
  { path: '', redirectTo: 'home' , pathMatch: 'full' },
  { path: '**', redirectTo: 'home'}
];

export const Routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
