import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { HomePageComponent } from './components/home-page/home-page.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { WeatherComponent } from './components/weather/weather.component';
import { NewsFeedComponent } from './components/news-feed/news-feed.component';
import { CurrentDateComponent } from './components/current-date/current-date.component';
import { AppButtonsComponent } from './components/app-buttons/app-buttons.component';
import { SecurityPageComponent } from './components/security-page/security-page.component';
import { MediaPageComponent } from './components/media-page/media-page.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    NotFoundComponent,
    WeatherComponent,
    NewsFeedComponent,
    CurrentDateComponent,
    AppButtonsComponent,
    SecurityPageComponent,
    MediaPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
