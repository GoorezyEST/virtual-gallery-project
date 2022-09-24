import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { EventManager } from '@angular/platform-browser';
import { Experience } from './Experience/Experience';

@Component({
  selector: 'app-root',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss'],
})
export class ExperienceComponent implements AfterViewInit {
  public experience!: Experience;
  @ViewChild('myCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  constructor() {}

  ngAfterViewInit(): void {
    this.experience = new Experience(this.canvasRef.nativeElement);
  }
}
