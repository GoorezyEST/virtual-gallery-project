import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRouting } from './app-routing.module';
import { AppComponent } from './app.component';
import { ThreeModule } from './experience/three.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
//Components Imports
import { NotFoundComponent } from './not-found/not-found.component';
import { GalleryComponent } from './gallery/gallery.component';
import { CardProjectComponent } from './gallery/card-project/card-project.component';
import { HoverProjectComponent } from './gallery/hover-project/hover-project.component';
import { CubeProjectComponent } from './gallery/cube-project/cube-project.component';

@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent,
    GalleryComponent,
    CardProjectComponent,
    HoverProjectComponent,
    CubeProjectComponent,
  ],
  imports: [BrowserModule, AppRouting, ThreeModule, DragDropModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
