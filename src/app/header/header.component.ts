import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

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
}
