import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { ExperienceComponent } from './experience.component';
import { Experience } from './Experience/Experience';
import { Sizes } from './Experience/Utils/Sizes';

@NgModule({
  declarations: [ExperienceComponent],
  imports: [BrowserModule],
  providers: [
    { provide: Sizes, useClass: Sizes },
    { provide: Experience, useClass: Experience },
  ],
  bootstrap: [ExperienceComponent],
})
export class ThreeModule {}
