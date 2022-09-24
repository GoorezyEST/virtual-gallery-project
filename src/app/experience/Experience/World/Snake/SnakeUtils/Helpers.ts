import * as THREE from 'three';
import SnakeGame from '../../SnakeGame';
import Particle from '../SnakeParticles';
import Config from './Config';

export class HelperFunctions {
  ConfigData: Config;
  CTX: CanvasRenderingContext2D | null;
  particles: Array<Particle>;

  constructor(public snakeGame: SnakeGame) {
    this.ConfigData = this.snakeGame.config;
    this.CTX = this.snakeGame.config.CTX;
    this.particles = this.snakeGame.particles;
  }

  public isCollision(v1: THREE.Vector2, v2: THREE.Vector2) {
    return v1.x == v2.x && v1.y == v2.y;
  }

  public garbageCollector() {
    for (let i = 0; i < this.particles.length; i++) {
      if (this.particles[i].size <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  public drawGrid() {
    if (this.CTX) {
      this.CTX.lineWidth = 1.1;
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

  public randHue() {
    return ~~(Math.random() * 360);
  }

  public hsl2rgb(hue: number, saturation: number, lightness: number) {
    if (hue == undefined) {
      return [0, 0, 0];
    }
    let chroma = 1 - Math.abs(2 * lightness - 1) * saturation;
    let huePrime = hue / 60;
    let secondComponent = chroma * (1 - Math.abs(huePrime % 2) - 1);
    huePrime = ~~huePrime;
    let red;
    let green;
    let blue;

    if (huePrime === 0) {
      red = chroma;
      green = secondComponent;
      blue = 0;
    } else if (huePrime === 1) {
      red = secondComponent;
      green = chroma;
      blue = 0;
    } else if (huePrime === 2) {
      red = 0;
      green = chroma;
      blue = secondComponent;
    } else if (huePrime === 3) {
      red = 0;
      green = secondComponent;
      blue = chroma;
    } else if (huePrime === 4) {
      red = secondComponent;
      green = 0;
      blue = chroma;
    } else if (huePrime === 5) {
      red = chroma;
      green = 0;
      blue = secondComponent;
    }
    let lightnessAdjustment = lightness - chroma / 2;
    if (red && green && blue) {
      red += lightnessAdjustment;
      green += lightnessAdjustment;
      blue += lightnessAdjustment;

      return [
        Math.round(red * 255),
        Math.round(green * 255),
        Math.round(blue * 255),
      ];
    } else {
      return null;
    }
  }
}
