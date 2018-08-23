import { LoginComponent } from './login/login.component';
import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { ContactlistComponent } from './contactlist/contactlist.component';
import { ContactformComponent } from './contactform/contactform.component';
import { VisitlistComponent } from './visitlist/visitlist.component';
import { VisitformComponent } from './visitform/visitform.component';
import { ContactBrowserComponent } from './contact-browser/contact-browser.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './guards/auth.guard';

const appRoutes: Routes = [
  { path: 'home' , component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'contaclist' , component: ContactlistComponent,  canActivate: [AuthGuard] },
  { path: 'contactform', component: ContactformComponent,  canActivate: [AuthGuard] },
  { path: 'visitlist' , component: VisitlistComponent,  canActivate: [AuthGuard] },
  { path: 'visitform', component: VisitformComponent , canActivate: [AuthGuard] },
  { path: 'contactbrowser', component: ContactBrowserComponent,  canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'home' , pathMatch: 'full' },
  { path: '**', redirectTo: '' }
];

export const Routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
