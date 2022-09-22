import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRouting } from './app-routing.module';

import { AppComponent } from './app.component';
import { ThreeModule } from './experience/three.module';
import { HeaderComponent } from './header/header.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { GalleryComponent } from './gallery/gallery.component';

@NgModule({
  declarations: [AppComponent, HeaderComponent, NotFoundComponent, GalleryComponent],
  imports: [BrowserModule, AppRouting, ThreeModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
