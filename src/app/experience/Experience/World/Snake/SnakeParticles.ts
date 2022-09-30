import SnakeGame from '../SnakeGame';
import { HelperFunctions } from './SnakeUtils/Helpers';

export default class Particle {
  ttl: number;
  gravity: number;
  CTX: CanvasRenderingContext2D | null;
  helpers: HelperFunctions;

  constructor(
    public pos: THREE.Vector2,
    public color: string,
    public size: number,
    public vel: THREE.Vector2,
    public snakeGame: SnakeGame
  ) {
    this.helpers = this.snakeGame.helpers;
    this.CTX = this.snakeGame.config.CTX;
    this.pos = pos;
    this.size = Math.abs(this.size / 2);
    this.ttl = 0;
    this.gravity = -0.2;
  }

  draw() {
    let { x, y } = this.pos;
    let hsl = this.color
      .split('')
      .filter((l) => l.match(/[^hsl()$%]/g))
      .join('')
      .split(',')
      .map((n) => +n);
    let colorValues = this.helpers.hsl2rgb(hsl[0], hsl[1] / 100, hsl[2] / 100);
    let r, g, b;

    r = colorValues[0];
    g = colorValues[1];
    b = colorValues[2];

    if (this.CTX) {
      this.CTX.shadowColor = `rgb(${r}, ${g}, ${b}, ${1})`;
      this.CTX.shadowBlur = 0;
      this.CTX.globalCompositeOperation = 'lighter';
      this.CTX.fillStyle = `rgb(${r}, ${g}, ${b}, ${1})`;
      this.CTX.fillRect(x, y, this.size, this.size);
      this.CTX.globalCompositeOperation = 'source-over';
    }
  }

  update() {
    this.draw();
    this.size -= 0.3;
    this.ttl += 1;
    this.pos.add(this.vel);
    this.vel.y -= this.gravity;
  }
}
