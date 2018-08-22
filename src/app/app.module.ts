import { AuthenticationService } from './services/authentication.service';
import { AdService } from './services/ad.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { Routing } from './app.routing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { LayoutModule } from '@angular/cdk/layout';
import { AppMaterialModule } from './app.material.module';
import { ContactformComponent } from './contactform/contactform.component';
import { DniValidator } from './contactform/dni.validator';
import { ContactlistComponent } from './contactlist/contactlist.component';
import { ContactService } from './services/contact.service';
import { EnlaceService } from './services/enlace.service';
import { VisitService } from './services/visit.service';
import { HomeComponent } from './home/home.component';
import { VisitlistComponent } from './visitlist/visitlist.component';
import { VisitformComponent } from './visitform/visitform.component';
import { ContactBrowserComponent } from './contact-browser/contact-browser.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { VisitlistforPersonComponent } from './visitlistfor-person/visitlistfor-person.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { JwtInterceptor } from './helpers/jwt.interceptor';
import { ErrorInterceptor } from './helpers/error.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    ContactformComponent,
    ContactlistComponent,
    HomeComponent,
    VisitlistComponent,
    VisitformComponent,
    ContactBrowserComponent,
    ConfirmationDialogComponent,
    VisitlistforPersonComponent,
    LoginComponent
  ],
  entryComponents: [
  ConfirmationDialogComponent,
  VisitlistforPersonComponent
 ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    LayoutModule,
    Routing,
  ],
  providers: [
    ContactService,
    VisitService,
    EnlaceService,
    AdService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    AuthenticationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
