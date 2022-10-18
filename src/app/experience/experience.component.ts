import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Experience } from './Experience/Experience';

@Component({
  selector: 'app-root',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss'],
})
export class ExperienceComponent implements AfterViewInit {
  public experience!: Experience;
  @ViewChild('myCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  experienceLoaded: boolean = false;
  experienceWrapper!: HTMLDivElement;
  dissolved: boolean = false;
  experienceControlsExplanation!: HTMLDivElement;
  experienceJumper!: HTMLDivElement;
  experienceMobileControls: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngAfterViewInit(): void {
    this.experienceWrapper = document.querySelector('.wrapper')!;
    this.experienceJumper = document.querySelector('.pass-experience')!;
    this.experienceControlsExplanation = document.querySelector(
      '.experience-controls-explanation'
    )!;
    this.experience = new Experience(this.canvasRef.nativeElement);
    this.experience.experienceLoaded.subscribe((e) => {
      this.experienceLoaded = true;
    });
    this.experience.finishExperienceEvent.subscribe(() => {
      this.router.navigate(['experience/gallery']);
    });
    if (navigator.userAgent.includes('Mobile')) {
      this.experience.playSnakeGame.subscribe(() => {
        this.experienceMobileControls = true;
      });
      this.experience.world.cubeWorld.snakeGame.snakeGameState.subscribe(() => {
        this.experienceMobileControls = false;
      });
    }
  }

  toAbout(el: HTMLElement, linkOne: HTMLElement, linkTwo: HTMLElement) {
    el.classList.remove('hidden');
    linkOne.classList.remove('active-link');
    linkTwo.classList.add('active-link');
  }

  toHome(el: HTMLElement, linkOne: HTMLElement, linkTwo: HTMLElement) {
    if (el.classList.contains('hidden')) {
      return;
    } else {
      el.classList.add('hidden');
      linkTwo.classList.remove('active-link');
      linkOne.classList.add('active-link');
    }
  }

  dissolveToExperience(e: Event) {
    this.experienceWrapper.style.animationPlayState = 'running';
    let animationEndCallback = () => {
      if (this.dissolved) return;
      this.dissolved = true;
      this.experienceWrapper.style.display = 'none';
      this.experienceControlsExplanation.style.display = 'flex';
      this.experienceControlsExplanation.style.animationPlayState = 'running';
    };
    this.experienceWrapper.addEventListener(
      'animationend',
      animationEndCallback
    );
  }

  jumpExperience() {
    this.router.navigate(['gallery'], { relativeTo: this.route });
  }

  triggerKeydown(element: string) {
    switch (element) {
      case 'up':
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
        break;
      case 'left':
        window.dispatchEvent(
          new KeyboardEvent('keydown', { key: 'ArrowLeft' })
        );
        break;
      case 'down':
        window.dispatchEvent(
          new KeyboardEvent('keydown', { key: 'ArrowDown' })
        );
        break;
      case 'right':
        window.dispatchEvent(
          new KeyboardEvent('keydown', { key: 'ArrowRight' })
        );
        break;
    }
  }
}
