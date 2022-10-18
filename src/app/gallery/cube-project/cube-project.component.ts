import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cube-project',
  templateUrl: './cube-project.component.html',
  styleUrls: ['./cube-project.component.scss'],
})
export class CubeProjectComponent implements AfterViewInit {
  btn!: HTMLElement;
  box!: HTMLElement;
  run = 'paused';
  body!: HTMLElement;

  infoSection!: HTMLElement;
  openInfoBtn!: HTMLElement;
  closeInfoBtn!: HTMLElement;

  formColors!: HTMLElement;
  inputColors!: HTMLInputElement;
  errorColors!: HTMLElement;

  front!: HTMLElement;
  back!: HTMLElement;
  left!: HTMLElement;
  right!: HTMLElement;
  top!: HTMLElement;
  bot!: HTMLElement;

  constructor(private router: Router) {}

  ngAfterViewInit(): void {
    this.btn = document.querySelector('.header_btn')!;
    this.box = document.querySelector<HTMLElement>('.box')!;
    this.body = document.querySelector('.body')!;

    this.infoSection = document.querySelector<HTMLElement>('.info')!;
    this.openInfoBtn = document.querySelector('.header_colors_help')!;
    this.closeInfoBtn = document.querySelector('.info_btn')!;

    this.formColors = document.querySelector('.header_colors')!;
    this.inputColors = document.querySelector<HTMLInputElement>(
      '.header_colors_input'
    )!;
    this.errorColors = document.querySelector('.header_colors_input_error')!;

    this.front = document.querySelector('.front')!;
    this.back = document.querySelector('.back')!;
    this.left = document.querySelector('.left')!;
    this.right = document.querySelector('.right')!;
    this.top = document.querySelector('.top')!;
    this.bot = document.querySelector('.bottom')!;
  }

  animateBox() {
    if (this.run === 'running') {
      this.box.style.animationPlayState = 'paused';
      this.run = 'paused';
      this.btn.innerHTML = 'play';
    } else {
      this.box.style.animationPlayState = 'running';
      this.run = 'running';
      this.btn.innerHTML = 'stop';
    }
  }

  openInfo() {
    this.infoSection.style.visibility = 'visible';
  }

  closeInfo() {
    this.infoSection.style.visibility = 'hidden';
  }

  themeMetod(color: string) {
    switch (color) {
      case 'RED':
        this.body.style.backgroundImage =
          'radial-gradient(rgb(212, 79, 79), rgb(138, 49, 49))';
        //Front
        this.front.style.backgroundColor = 'rgb(212, 58, 58)';
        this.front.style.border = '1px solid rgb(92, 18, 18)';
        //Back
        this.back.style.backgroundColor = 'rgb(212, 58, 58)';
        this.back.style.border = '1px solid rgb(92, 18, 18)';
        //Left
        this.left.style.backgroundColor = 'rgb(212, 58, 58)';
        this.left.style.border = '1px solid rgb(92, 18, 18)';
        //Right
        this.right.style.backgroundColor = 'rgb(212, 58, 58)';
        this.right.style.border = '1px solid rgb(92, 18, 18)';
        //Top
        this.top.style.backgroundColor = 'rgb(212, 58, 58)';
        this.top.style.border = '1px solid rgb(92, 18, 18)';
        //Bot
        this.bot.style.backgroundColor = 'rgb(212, 58, 58)';
        this.bot.style.border = '1px solid rgb(92, 18, 18)';

        this.errorColors.style.display = 'none';
        break;
      case 'BLUE':
        this.body.style.backgroundImage =
          'radial-gradient(rgb(79, 114, 212), rgb(49, 65, 138))';
        //Front
        this.front.style.backgroundColor = 'rgb(28, 69, 212)';
        this.front.style.border = '1px solid rgb(18, 41, 92)';
        //Back
        this.back.style.backgroundColor = 'rgb(28, 69, 212)';
        this.back.style.border = '1px solid rgb(18, 41, 92)';
        //Left
        this.left.style.backgroundColor = 'rgb(28, 69, 212)';
        this.left.style.border = '1px solid rgb(18, 41, 92)';
        //Right
        this.right.style.backgroundColor = 'rgb(28, 69, 212)';
        this.right.style.border = '1px solid rgb(18, 41, 92)';
        //Top
        this.top.style.backgroundColor = 'rgb(28, 69, 212)';
        this.top.style.border = '1px solid rgb(18, 41, 92)';
        //Bot
        this.bot.style.backgroundColor = 'rgb(28, 69, 212)';
        this.bot.style.border = '1px solid rgb(18, 41, 92)';

        this.errorColors.style.display = 'none';
        break;
      case 'GREEN':
        this.body.style.backgroundImage =
          'radial-gradient(rgb(79, 212, 90), rgb(49, 138, 68))';
        //Front
        this.front.style.backgroundColor = 'rgb(28, 212, 58)';
        this.front.style.border = '1px solid rgb(18, 92, 24)';
        //Back
        this.back.style.backgroundColor = 'rgb(28, 212, 58)';
        this.back.style.border = '1px solid rgb(18, 92, 24)';
        //Left
        this.left.style.backgroundColor = 'rgb(28, 212, 58)';
        this.left.style.border = '1px solid rgb(18, 92, 24)';
        //Right
        this.right.style.backgroundColor = 'rgb(28, 212, 58)';
        this.right.style.border = '1px solid rgb(18, 92, 24)';
        //Top
        this.top.style.backgroundColor = 'rgb(28, 212, 58)';
        this.top.style.border = '1px solid rgb(18, 92, 24)';
        //Bot
        this.bot.style.backgroundColor = 'rgb(28, 212, 58)';
        this.bot.style.border = '1px solid rgb(18, 92, 24)';

        this.errorColors.style.display = 'none';
        break;
      case 'ORANGE':
        this.body.style.backgroundImage =
          'radial-gradient(rgb(212, 132, 79), rgb(138, 96, 49))';
        //Front
        this.front.style.backgroundColor = 'rgb(212, 157, 28)';
        this.front.style.border = '1px solid rgb(92, 58, 18)';
        //Back
        this.back.style.backgroundColor = 'rgb(212, 157, 28)';
        this.back.style.border = '1px solid rgb(92, 58, 18)';
        //Left
        this.left.style.backgroundColor = 'rgb(212, 157, 28)';
        this.left.style.border = '1px solid rgb(92, 58, 18)';
        //Right
        this.right.style.backgroundColor = 'rgb(212, 157, 28)';
        this.right.style.border = '1px solid rgb(92, 58, 18)';
        //Top
        this.top.style.backgroundColor = 'rgb(212, 157, 28)';
        this.top.style.border = '1px solid rgb(92, 58, 18)';
        //Bot
        this.bot.style.backgroundColor = 'rgb(212, 157, 28)';
        this.bot.style.border = '1px solid rgb(92, 58, 18)';

        this.errorColors.style.display = 'none';
        break;
      case 'PURPLE':
        this.body.style.backgroundImage =
          'radial-gradient(rgb(148, 79, 212), rgb(105, 49, 138))';
        //Front
        this.front.style.backgroundColor = 'rgb(145, 28, 212)';
        this.front.style.border = '1px solid rgb(62, 18, 92)';
        //Back
        this.back.style.backgroundColor = 'rgb(145, 28, 212)';
        this.back.style.border = '1px solid rgb(62, 18, 92)';
        //Left
        this.left.style.backgroundColor = 'rgb(145, 28, 212)';
        this.left.style.border = '1px solid rgb(62, 18, 92)';
        //Right
        this.right.style.backgroundColor = 'rgb(145, 28, 212)';
        this.right.style.border = '1px solid rgb(62, 18, 92)';
        //Top
        this.top.style.backgroundColor = 'rgb(145, 28, 212)';
        this.top.style.border = '1px solid rgb(62, 18, 92)';
        //Bot
        this.bot.style.backgroundColor = 'rgb(145, 28, 212)';
        this.bot.style.border = '1px solid rgb(62, 18, 92)';

        this.errorColors.style.display = 'none';
        break;
      case 'PINK':
        this.body.style.backgroundImage =
          'radial-gradient(rgb(207, 79, 212), rgb(131, 49, 138))';
        //Front
        this.front.style.backgroundColor = 'rgb(247, 28, 212)';
        this.front.style.border = '1px solid rgb(90, 18, 92)';
        //Back
        this.back.style.backgroundColor = 'rgb(247, 28, 212)';
        this.back.style.border = '1px solid rgb(90, 18, 92)';
        //Left
        this.left.style.backgroundColor = 'rgb(247, 28, 212)';
        this.left.style.border = '1px solid rgb(90, 18, 92)';
        //Right
        this.right.style.backgroundColor = 'rgb(247, 28, 212)';
        this.right.style.border = '1px solid rgb(90, 18, 92)';
        //Top
        this.top.style.backgroundColor = 'rgb(247, 28, 212)';
        this.top.style.border = '1px solid rgb(90, 18, 92)';
        //Bot
        this.bot.style.backgroundColor = 'rgb(247, 28, 212)';
        this.bot.style.border = '1px solid rgb(90, 18, 92)';

        this.errorColors.style.display = 'none';
        break;
      case 'WHITE':
        this.body.style.backgroundImage =
          'radial-gradient(rgb(240, 240, 240), rgb(163, 163, 163))';
        //Front
        this.front.style.backgroundColor = 'rgb(49, 49, 49)';
        this.front.style.border = '1px solid rgb(228, 228, 228)';
        //Back
        this.back.style.backgroundColor = 'rgb(49, 49, 49)';
        this.back.style.border = '1px solid rgb(228, 228, 228)';
        //Left
        this.left.style.backgroundColor = 'rgb(49, 49, 49)';
        this.left.style.border = '1px solid rgb(228, 228, 228)';
        //Right
        this.right.style.backgroundColor = 'rgb(49, 49, 49)';
        this.right.style.border = '1px solid rgb(228, 228, 228)';
        //Top
        this.top.style.backgroundColor = 'rgb(49, 49, 49)';
        this.top.style.border = '1px solid rgb(228, 228, 228)';
        //Bot
        this.bot.style.backgroundColor = 'rgb(49, 49, 49)';
        this.bot.style.border = '1px solid rgb(228, 228, 228)';

        this.errorColors.style.display = 'none';
        break;
      default:
        this.errorColors.style.display = 'block';
    }
  }

  onSubmit(e: Event) {
    e.preventDefault();

    let color = '';

    color = this.inputColors.value.toUpperCase();
    this.inputColors.value = '';

    this.themeMetod(color);
  }

  returnGallery() {
    this.router.navigate(['gallery']);
  }
}
