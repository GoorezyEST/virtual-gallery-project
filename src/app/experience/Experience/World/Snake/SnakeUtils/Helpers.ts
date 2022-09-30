import * as THREE from 'three';
import SnakeGame from '../../SnakeGame';
import Particle from '../SnakeParticles';
import Config from './Config';

export class HelperFunctions {
  ConfigData: Config;
  CTX: CanvasRenderingContext2D | null;
  particles: Array<Particle>;

  constructor(private snakeGame: SnakeGame) {
    this.ConfigData = this.snakeGame.config;
    this.CTX = this.snakeGame.config.CTX;
    this.particles = this.snakeGame.particles;
  }

  isCollision(v1: THREE.Vector2, v2: THREE.Vector2) {
    return (
      Math.round(v1.x) == Math.round(v2.x) &&
      Math.round(v1.y) == Math.round(v2.y)
    );
  }

  garbageCollector() {
    for (let i = 0; i < this.particles.length; i++) {
      if (this.particles[i].size <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  drawGrid() {
    if (this.CTX) {
      this.CTX.lineWidth = 1;
      this.CTX.strokeStyle = '#232332';
      this.CTX.shadowBlur = 0;
      for (let i = 1; i < this.ConfigData.cells; i++) {
        let f = (this.ConfigData.W / this.ConfigData.cells) * i;
        this.CTX.beginPath();
        this.CTX.moveTo(f, 0);
        this.CTX.lineTo(f, this.ConfigData.H);
        this.CTX.stroke();
        this.CTX.beginPath();
        this.CTX.moveTo(0, f);
        this.CTX.lineTo(this.ConfigData.W, f);
        this.CTX.stroke();
        this.CTX.closePath();
      }
    }
  }

  randHue() {
    return ~~(Math.random() * 360);
  }

  hsl2rgb(h: number, s: number, l: number) {
    let a = s * Math.min(l, 1 - l);
    let f = (n: number, k = (n + h / 30) % 12) =>
      l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return [f(0) * 255, f(8) * 255, f(4) * 255];
  }
}
