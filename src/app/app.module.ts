import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRouting } from './app-routing.module';

import { AppComponent } from './app.component';
import { ThreeModule } from './experience/three.module';
import { HeaderComponent } from './header/header.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { GalleryComponent } from './gallery/gallery.component';
import { CardProjectComponent } from './gallery/card-project/card-project.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NotFoundComponent,
    GalleryComponent,
    CardProjectComponent,
  ],
  imports: [BrowserModule, AppRouting, ThreeModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
