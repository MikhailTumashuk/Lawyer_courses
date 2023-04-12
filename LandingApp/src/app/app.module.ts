import {APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {RouterModule, Routes} from '@angular/router'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { register } from 'swiper/element/bundle';
import { HeaderComponent } from './header/header.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BasicsOfLawComponent } from './basics-of-law/basics-of-law.component';
import {OverlayModule} from '@angular/cdk/overlay';
import { RegistrationComponent } from './registration/registration.component';
import { AuthComponent } from './auth/auth.component';
import { AccountComponent } from './account/account.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { HttpClientModule } from '@angular/common/http';
import { DataService } from './services/dataservice';
import { ConfigService } from './services/configservice';
import { config } from 'rxjs';

// register Swiper custom elements
register();

// инициализация приложения
export function initializeApp(config: ConfigService) { 
  return () => config.load();
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    BasicsOfLawComponent,
    RegistrationComponent,
    AuthComponent,
    AccountComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    OverlayModule,
    FormsModule,
    ReactiveFormsModule,
    PickerModule,
    EmojiModule,
    HttpClientModule
  ],
  providers: [DataService, ConfigService, {
    provide: APP_INITIALIZER,
    useFactory: initializeApp, 
    deps: [ConfigService], 
    multi: true }
  ],  
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
