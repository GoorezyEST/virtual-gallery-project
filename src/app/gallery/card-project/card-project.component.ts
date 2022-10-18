import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card-project',
  templateUrl: './card-project.component.html',
  styleUrls: ['./card-project.component.scss'],
})
export class CardProjectComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {}

  returnGallery() {
    this.router.navigate(['gallery']);
  }
}
