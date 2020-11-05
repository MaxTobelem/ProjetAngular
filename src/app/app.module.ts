import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';
import { MapComponent } from './map/map.component';
import { ChartsComponent } from './charts/charts.component';
import { AboutComponent } from './about/about.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MapComponent,
    ChartsComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NoopAnimationsModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
    LeafletModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
