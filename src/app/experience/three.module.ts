import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ExperienceComponent } from './experience.component';
import { Experience } from './Experience/Experience';
import SnakeGame from './Experience/World/SnakeGame';

@NgModule({
  declarations: [ExperienceComponent],
  imports: [BrowserModule],
  providers: [Experience, SnakeGame],
  bootstrap: [ExperienceComponent],
})
export class ThreeModule {}
