import { Injectable } from '@angular/core';
import * as THREE from 'three';
import Snake from './Snake/Snake';
import SnakeControls from './Snake/SnakeControls';
import SnakeFood from './Snake/SnakeFood';
import Particle from './Snake/SnakeParticles';
import Config from './Snake/SnakeUtils/Config';
import { HelperFunctions } from './Snake/SnakeUtils/Helpers';
import CubeWorld from './CubeWorld';
import { EventEmitter } from '@angular/core';

@Injectable()
export default class SnakeGame {
  snake: Snake;
  food: SnakeFood;
  config: Config;
  helpers: HelperFunctions;
  score: number;
  maxScore: string | undefined | number;
  splashingParticleCount: number;
  particles: Array<Particle>;
  currentHue: string;
  CTX!: CanvasRenderingContext2D;
  canvasTexture!: THREE.CanvasTexture;
  snakeControls: SnakeControls;
  history: Array<THREE.Vector2>;
  startGame: boolean = false;
  iterate: number;
  showGameControls: boolean = false;
  snakeGameState: EventEmitter<string>;
  constructor(private enviroment: CubeWorld) {
    this.snakeGameState = new EventEmitter();
    //////
    // Varialbles de juego
    this.enviroment.experience.playSnakeGame.subscribe(() => {
      if (this.enviroment.experience.userDeviceType === 'click') {
        this.showGameControls = true;
      }
      this.reset();
      this.config.isGameOver = false;
      this.startGame = true;
    });

    this.score = 0;
    this.maxScore = window.localStorage.getItem('maxScore') || undefined;
    this.particles = [];
    this.splashingParticleCount = 20;
    this.history = [];

    this.config = new Config();
    this.helpers = new HelperFunctions(this);
    this.snakeControls = new SnakeControls();
    this.food = new SnakeFood(this);
    this.snake = new Snake(this);

    if (this.config.CTX) this.CTX = this.config.CTX;

    this.currentHue = this.food.currentHue;

    // Textura a partir del canvas del juego
    if (this.config.CTX)
      this.canvasTexture = new THREE.CanvasTexture(this.config.CTX.canvas);
    this.canvasTexture.flipY = false;
    this.canvasTexture.magFilter = THREE.LinearFilter;
    this.canvasTexture.wrapS = THREE.RepeatWrapping;
    this.canvasTexture.wrapT = THREE.RepeatWrapping;
    this.canvasTexture.mapping = THREE.UVMapping;
    this.canvasTexture.repeat = new THREE.Vector2(2.998, 2.998);

    this.iterate = 0;
  }

  drawIntro() {
    if (this.iterate === 100) {
      this.iterate = 0;
      this.snakeGameState.emit('Snake dead');
    }
    this.CTX.globalCompositeOperation = 'lighter';
    this.CTX.shadowBlur = 0;
    this.CTX.shadowColor = 'hsl(0, 0%,0%)';
    this.CTX.globalCompositeOperation = 'source-over';
    this.CTX.shadowBlur = 0;
    this.CTX.fillStyle = '#4cffd7';
    this.CTX.textAlign = 'center';
    if (this.iterate > 50) {
      this.CTX.font = 'bold 15px sans-serif';
      this.CTX.fillText('SNAKE GAME', this.config.W / 2, this.config.H / 2);
      this.CTX.font = '10px sans-serif';
      this.CTX.fillText(
        'CLICK TO PLAY',
        this.config.W / 2,
        this.config.H / 2 + 80
      );
    } else {
      this.CTX.clearRect(0, 0, this.config.W, this.config.W);
    }
  }

  // All functions used above
  incrementScore() {
    this.score++;
  }

  particleSplash() {
    for (let i = 0; i < this.splashingParticleCount; i++) {
      let vel = new THREE.Vector2(Math.random() * 6 - 3, Math.random() * 6 - 3);
      let position = new THREE.Vector2(this.food.pos.x, this.food.pos.y);
      this.particles.push(
        new Particle(position, this.currentHue, this.food.size, vel, this)
      );
    }
  }

  clear() {
    if (this.CTX) this.CTX.clearRect(0, 0, this.config.W, this.config.H);
  }

  //New function not used above
  initialize() {
    this.snakeControls.listen();
  }

  loop() {
    if (this.startGame) {
      this.clear();
      if (!this.config.isGameOver) {
        this.helpers.drawGrid();
        this.snake.update();
        this.food.draw();
        this.currentHue = this.food.currentHue;

        for (let p of this.particles) {
          p.update();
        }
        this.helpers.garbageCollector();
      } else {
        this.clear();
        this.GameOver();
      }
      this.config.isGameOver = this.snake.isGameOver;
    } else {
      this.drawIntro();
      this.iterate++;
    }
  }

  GameOver() {
    this.maxScore ? null : (this.maxScore = this.score);
    this.score > this.maxScore ? (this.maxScore = this.score) : null;
    window.localStorage.setItem('maxScore', `${this.maxScore}`);
    if (this.CTX) {
      this.CTX.fillStyle = '#4cffd7';
      this.CTX.textAlign = 'center';
      this.CTX.font = 'bold 15px sans-serif';
      this.CTX.fillText('GAME OVER', this.config.W / 2, this.config.H / 2);
      this.CTX.font = '10px sans-serif';
      this.CTX.fillText(
        `SCORE ${this.score}`,
        this.config.W / 2,
        this.config.H / 2 + 60
      );
      this.CTX.fillText(
        `MAXSCORE ${this.maxScore}`,
        this.config.W / 2,
        this.config.H / 2 + 80
      );
    }
  }

  reset() {
    this.initialize();
    this.config.isGameOver = false;
    this.score = 0;
    this.history = [];
    this.food.spawn();
    this.snake = new Snake(this);
    this.snake.KEY.resetState();
    this.loop();
  }
}
