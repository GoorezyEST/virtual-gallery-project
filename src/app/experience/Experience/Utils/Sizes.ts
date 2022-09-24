import { Injectable, OnDestroy, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

export interface Sizes {
  width: number;
  height: number;
  aspect: number;
  pixelRatio: number;
}
@Injectable()
export class Sizes implements Sizes, OnDestroy {
  @Output() event: EventEmitter<string> = new EventEmitter();
  resizeCallback: () => void;

  constructor() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.aspect = this.width / this.height;
    this.pixelRatio = Math.min(window.devicePixelRatio, 2);
    this.resizeCallback = () => {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.aspect = this.width / this.height;
      this.pixelRatio = Math.min(window.devicePixelRatio, 2);
      this.event.emit('resize');
    };

    window.addEventListener('resize', this.resizeCallback.bind(this));
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.resizeCallback);
  }
}
