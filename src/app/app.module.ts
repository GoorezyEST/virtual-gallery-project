import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRouting } from './app-routing.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { CanvasComponent } from './canvas/canvas.component';
import { ProyectComponent } from './proyect/proyect.component';

@NgModule({
  declarations: [AppComponent, HeaderComponent, CanvasComponent, ProyectComponent],
  imports: [BrowserModule, AppRouting],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
