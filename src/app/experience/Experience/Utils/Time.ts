import { Injectable, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Injectable()
export default class Time {
  @Output() event: EventEmitter<string> = new EventEmitter();

  start: number;
  current: number;
  elapsed: number;
  delta: number;

  constructor() {
    this.start = Date.now();
    this.current = this.start;
    this.elapsed = 0;
    this.delta = 16;

    this.update();
  }

  update() {
    const currentTime = Date.now();
    this.delta = currentTime - this.current;
    this.current = currentTime;
    this.elapsed = this.current - this.start;
    this.event.emit('update');
    window.requestAnimationFrame(this.update.bind(this));
  }
}
