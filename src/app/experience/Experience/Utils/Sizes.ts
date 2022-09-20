import { Injectable, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

export interface Sizes {
  width: number;
  height: number;
  aspect: number;
  pixelRatio: number;
}
@Injectable()
export class Sizes implements Sizes {
  @Output() event: EventEmitter<string> = new EventEmitter();
  constructor() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.aspect = this.width / this.height;
    this.pixelRatio = Math.min(window.devicePixelRatio, 2);

    window.addEventListener('resize', () => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.aspect = this.width / this.height;
      this.pixelRatio = Math.min(window.devicePixelRatio, 2);
      this.event.emit('resize');
    });
  }
}
