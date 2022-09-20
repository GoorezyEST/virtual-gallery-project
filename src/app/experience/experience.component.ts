import { Component } from '@angular/core';
import { Experience } from './Experience/Experience';

@Component({
  selector: 'app-root',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss'],
})
export class ExperienceComponent {
  constructor(private experience: Experience) {
    console.log(this.experience);
  }
}
