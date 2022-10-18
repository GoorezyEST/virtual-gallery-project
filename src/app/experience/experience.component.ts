import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { Router } from '@angular/router';
import { Experience } from './Experience/Experience';

@Component({
  selector: 'app-root',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss'],
})
export class ExperienceComponent implements AfterViewInit, OnDestroy {
  public experience!: Experience;
  @ViewChild('myCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  experienceLoaded: boolean = false;
  experienceWrapper!: HTMLDivElement;
  dissolved: boolean = false;
  experienceControlsExplanation!: HTMLDivElement;
  experienceJumper!: HTMLDivElement;
  experienceMobileControls: boolean = false;
  animationEndCallback!: () => void;
  experienceControlsExplanationText: {
    firstText: string;
    secondText: string;
    thirdText: string;
  };

  constructor(private router: Router) {
    this.experienceControlsExplanationText = {
      firstText: 'Hold click to drag.',
      secondText: 'Double click to Interact.',
      thirdText: 'Double click the door to exit experience.',
    };
    if (navigator.userAgent.includes('Mobile')) {
      this.experienceControlsExplanationText = {
        firstText: 'Drag to move.',
        secondText: 'Tap to interact.',
        thirdText: 'Tap the door to exit experience.',
      };
    }
  }

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
      this.router.navigate(['gallery']);
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
    this.experience.setGeneralControls();
    this.animationEndCallback = () => {
      if (this.dissolved) return;

      this.dissolved = true;
      this.experienceControlsExplanation.style.display = 'flex';
      this.experienceControlsExplanation.style.animationPlayState = 'running';
    };
    this.experienceWrapper.addEventListener(
      'animationend',
      this.animationEndCallback
    );
  }

  jumpExperience() {
    this.router.navigate(['experience/gallery']);
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

  ngOnDestroy(): void {
    this.experienceWrapper.removeEventListener(
      'animationend',
      this.animationEndCallback
    );
  }
}
