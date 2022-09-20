import { EventEmitter } from 'events';

export default class Time {
  start: number;
  current: number;
  elapsed: number;
  delta: number;

  constructor(private event: EventEmitter) {
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
