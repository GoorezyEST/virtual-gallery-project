import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hover-project',
  templateUrl: './hover-project.component.html',
  styleUrls: ['./hover-project.component.scss'],
})
export class HoverProjectComponent implements OnInit {
  start!: HTMLButtonElement;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.start = document.querySelector('.start__content__enter')!;
  }

  onClick(element: HTMLElement) {
    element.style.display = 'none';
  }

  goBack() {
    this.router.navigate(['experience/gallery']);
  }
}
