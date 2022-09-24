export default class SnakeControls {
  ArrowUp: boolean;
  ArrowRight: boolean;
  ArrowDown: boolean;
  ArrowLeft: boolean;

  constructor() {
    this.ArrowUp = false;
    this.ArrowRight = false;
    this.ArrowDown = false;
    this.ArrowLeft = false;
  }

  resetState() {
    this.ArrowUp = false;
    this.ArrowRight = false;
    this.ArrowDown = false;
    this.ArrowLeft = false;
  }

  listen() {
    let listenerCallback = (e: KeyboardEvent): void => {
      if (e.key === 'ArrowUp' && this.ArrowDown) return;
      if (e.key === 'ArrowDown' && this.ArrowUp) return;
      if (e.key === 'ArrowLeft' && this.ArrowRight) return;
      if (e.key === 'ArrowRight' && this.ArrowLeft) return;

      if (
        e.key === 'ArrowUp' ||
        e.key === 'ArrowDown' ||
        e.key === 'ArrowLeft' ||
        e.key === 'ArrowRight'
      ) {
        this[e.key] = true;
      }

      Object.keys(this)
        .filter((f) => f !== e.key && f !== 'listen' && f !== 'resetState')
        .forEach((k) => {
          if (
            k === 'ArrowUp' ||
            k === 'ArrowDown' ||
            k === 'ArrowLeft' ||
            k === 'ArrowRight'
          ) {
            this[k] = false;
          }
        });
    };
    window.addEventListener('keydown', listenerCallback.bind(this), false);
  }
}
