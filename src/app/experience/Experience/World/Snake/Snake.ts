import * as THREE from 'three';
import SnakeGame from '../SnakeGame';
import SnakeControls from './SnakeControls';
import SnakeFood from './SnakeFood';
import Config from './SnakeUtils/Config';
import { HelperFunctions } from './SnakeUtils/Helpers';

// Classes { snake, food , particle}
export default class Snake {
  pos: THREE.Vector2;
  dir: THREE.Vector2;
  delay: number;
  size: number;
  color: string;
  history: Array<THREE.Vector2>;
  total: number;
  configData: Config;
  CTX: CanvasRenderingContext2D | null;
  helpers: HelperFunctions;
  food: SnakeFood;
  isGameOver: boolean;
  KEY: SnakeControls;

  constructor(public snakeGame: SnakeGame) {
    this.configData = this.snakeGame.config;
    this.CTX = this.configData.CTX;
    this.helpers = this.snakeGame.helpers;
    this.food = this.snakeGame.food;
    this.isGameOver = this.configData.isGameOver;

    this.pos = new THREE.Vector2(this.configData.W / 2, this.configData.H / 2);
    this.dir = new THREE.Vector2(0, 0);

    this.KEY = this.snakeGame.snakeControls;
    this.delay = 8;
    this.size = this.configData.W / this.configData.cells;
    this.color = 'white';
    this.history = this.snakeGame.history;
    this.total = 1;
  }

  draw() {
    let { x, y } = this.pos;
    if (this.CTX) {
      this.CTX.fillStyle = this.color;
      this.CTX.shadowBlur = 0;
      this.CTX.shadowColor = 'rgba(255, 255, 255, 0.3)';
      this.CTX.fillRect(x, y, this.size, this.size);
      this.CTX.shadowBlur = 0;
    }
    if (this.total >= 2) {
      for (let i = 0; i < this.history.length - 1; i++) {
        let { x, y } = this.history[i];
        if (this.CTX) {
          this.CTX.lineWidth = 1;
          this.CTX.fillStyle = 'rgba(255, 255, 255, 1)';
          this.CTX.fillRect(x, y, this.size, this.size);
        }
      }
    }
  }

  walls() {
    let { x, y } = this.pos;
    if (x + this.configData.cellSize > this.configData.W) {
      this.pos.x = 0;
    }
    if (y + this.configData.cellSize > this.configData.W) {
      this.pos.y = 0;
    }
    if (y < 0) {
      this.pos.y = this.configData.H - this.configData.cellSize;
    }
    if (x < 0) {
      this.pos.x = this.configData.W - this.configData.cellSize;
    }
  }

  controlls() {
    let dir = this.size;
    if (this.KEY.ArrowUp) {
      this.dir = new THREE.Vector2(0, -dir);
    }
    if (this.KEY.ArrowDown) {
      this.dir = new THREE.Vector2(0, dir);
    }
    if (this.KEY.ArrowLeft) {
      this.dir = new THREE.Vector2(-dir, 0);
    }
    if (this.KEY.ArrowRight) {
      this.dir = new THREE.Vector2(dir, 0);
    }
  }

  selfCollision() {
    for (let i = 0; i < this.history.length; i++) {
      let p = this.history[i];
      if (this.helpers.isCollision(this.pos, p)) {
        this.isGameOver = true;
        this.snakeGame.snakeControls.killListener();
      }
    }
  }
  update() {
    this.walls();
    this.draw();
    this.controlls();
    if (!this.delay--) {
      if (this.helpers.isCollision(this.pos, this.food.pos)) {
        this.snakeGame.incrementScore();
        this.snakeGame.particleSplash();
        this.food.spawn();
        this.total++;
      }

      this.history[this.total - 1] = new THREE.Vector2(this.pos.x, this.pos.y);
      for (let i = 0; i < this.total - 1; i++) {
        this.history[i] = this.history[i + 1];
      }
      this.pos.add(this.dir);

      this.delay = 8;
      this.total > 3 ? this.selfCollision() : null;
    }
  }
}
