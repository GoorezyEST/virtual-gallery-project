import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ExperienceComponent } from './experience.component';
import { Experience } from './Experience/Experience';
import { Sizes } from './Experience/Utils/Sizes';
import Time from './Experience/Utils/Time';

@NgModule({
  declarations: [ExperienceComponent],
  imports: [BrowserModule],
  providers: [
    Experience,
    { provide: Sizes, useClass: Sizes },
    { provide: Time, useClass: Time },
  ],
  bootstrap: [ExperienceComponent],
})
export class ThreeModule {}
