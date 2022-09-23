import { AfterViewInit, Component } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent implements AfterViewInit {
  scrolling!: {
    enabled: boolean;
    events: Array<string>;
    prevent: (e: { preventDefault: () => any }) => any;
    disable: () => void;
    enable: () => void;
  };

  sections!: NodeListOf<HTMLElement>;
  techIcon!: NodeListOf<HTMLElement>;
  anim: string = 'paused';

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngAfterViewInit(): void {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    this.sections = document.querySelectorAll('section');
    this.techIcon = document.querySelectorAll<HTMLElement>(
      '.project__technologies__icon'
    );

    console.log(this.techIcon);

    this.scrolling = {
      enabled: true,
      events: 'scroll,wheel,touchmove,pointermove,'.split(','),
      prevent: (e: { preventDefault: () => any }) => e.preventDefault(),
      disable: () => {
        if (this.scrolling.enabled) {
          this.scrolling.enabled = false;
          window.addEventListener('scroll', gsap.ticker.tick, {
            passive: false,
          });
          this.scrolling.events.forEach((e, i) =>
            (i ? document : window).addEventListener(
              e,
              this.scrolling.prevent,
              {
                passive: false,
              }
            )
          );
        }
      },
      enable: () => {
        if (!this.scrolling.enabled) {
          this.scrolling.enabled = true;
          window.removeEventListener('scroll', gsap.ticker.tick);
          this.scrolling.events.forEach((e, i) =>
            (i ? document : window).removeEventListener(
              e,
              this.scrolling.prevent
            )
          );
        }
      },
    };

    this.sections.forEach((section) => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top bottom-=1',
        end: 'bottom top+=1',
        onEnter: () => this.goToSection(section),
        onEnterBack: () => this.goToSection(section),
      });
    });
  }

  goToSection(section: HTMLElement) {
    if (this.scrolling.enabled) {
      // skip if a scroll tween is in progress
      this.scrolling.disable();
      gsap.to(window, {
        scrollTo: { y: section, autoKill: false },
        onComplete: this.scrolling.enable,
        duration: 0.2,
      });
    }
  }

  toGitHubG() {
    window.open('https://github.com/GoorezyEST', '_blank');
  }
  toGitHubP() {
    window.open('https://github.com/Pieris128', '_blank');
  }

  toProyect(project: HTMLElement) {
    if (project.classList.contains('cube')) {
      this.router.navigate(['cube-project'], { relativeTo: this.route });
    }
  }
}
