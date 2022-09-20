import { EventEmitter, Injectable, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Sizes } from './Utils/Sizes';

@Injectable()
export class Experience {
  constructor(
    private sizes: Sizes // private canvas: HTMLCanvasElement,
  ) // private resizeEvent: Subscription
  {
    // this.resizeEvent = this.sizes.event.subscribe(() => {
    //   console.log('Resize');
    // });
  }

  // setCanvas(canvas: HTMLCanvasElement) {
  //   this.canvas = canvas;
  //   console.log(this.canvas);
  // }

  resize() {}

  update() {}
}
