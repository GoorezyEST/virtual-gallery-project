import * as THREE from 'three';
import SnakeGame from '../SnakeGame';
import Snake from './Snake';
import Config from './SnakeUtils/Config';
import { HelperFunctions } from './SnakeUtils/Helpers';

export default class SnakeFood {
  pos: THREE.Vector2;
  size: number;
  color: string;
  currentHue: string;
  configData: Config;
  CTX: CanvasRenderingContext2D | null;
  helpers: HelperFunctions;
  snake: Snake;

  constructor(public snakeGame: SnakeGame) {
    this.configData = this.snakeGame.config;
    this.CTX = this.configData.CTX;
    this.helpers = this.snakeGame.helpers;
    this.snake = this.snakeGame.snake;
    this.pos = new THREE.Vector2(
      ~~(Math.random() * this.configData.cells) * this.configData.cellSize,
      ~~(Math.random() * this.configData.cells) * this.configData.cellSize
    );
    this.color = this.currentHue = `hsl(${~~(Math.random() * 360)},100%,50%)`;
    this.size = this.configData.cellSize;
  }
  draw() {
    let { x, y } = this.pos;
    if (this.CTX) {
      this.CTX.globalCompositeOperation = 'lighter';
      this.CTX.shadowBlur = 20;
      this.CTX.shadowColor = this.color;
      this.CTX.fillStyle = this.color;
      this.CTX.fillRect(x, y, this.size, this.size);
      this.CTX.globalCompositeOperation = 'source-over';
      this.CTX.shadowBlur = 0;
    }
  }
  spawn(): void {
    let randX = ~~(Math.random() * this.configData.cells) * this.size;
    let randY = ~~(Math.random() * this.configData.cells) * this.size;
    for (let path of this.snake.history) {
      if (this.helpers.isCollision(new THREE.Vector2(randX, randY), path)) {
        return this.spawn();
      }
    }
    this.color = this.currentHue = `hsl(${this.helpers.randHue()},100%,50%)`;
    this.pos = new THREE.Vector2(randX, randY);
  }
}
