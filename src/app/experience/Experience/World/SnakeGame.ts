import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { Experience } from '../Experience';
import Snake from './Snake/Snake';
import SnakeControls from './Snake/SnakeControls';
import SnakeFood from './Snake/SnakeFood';
import Particle from './Snake/SnakeParticles';
import Config from './Snake/SnakeUtils/Config';
import { HelperFunctions } from './Snake/SnakeUtils/Helpers';

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
  CTX: CanvasRenderingContext2D | null;
  canvasTexture: THREE.CanvasTexture;
  snakeControls: SnakeControls;

  constructor() {
    this.config = new Config();
    this.helpers = new HelperFunctions(this);
    this.snakeControls = new SnakeControls();
    this.snake = new Snake(this);
    this.food = new SnakeFood(this);
    this.CTX = this.helpers.CTX;

    // Varialbles de juego
    this.currentHue = this.food.currentHue;
    this.score = 0;
    this.maxScore = window.localStorage.getItem('maxScore') || undefined;
    this.particles = [];
    this.splashingParticleCount = 20;

    // Textura a partir del canvas del juego
    this.canvasTexture = new THREE.CanvasTexture(this.config.dom_canvas);
  }

  // All functions used above

  incrementScore() {
    this.score++;
    // dom_score.innerText = score.toString().padStart(2, '0');
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
    // KEY.listen();
    // dom_replay.addEventListener('click', this.reset, false);
    this.loop();
  }

  loop() {
    this.clear();
    if (!this.config.isGameOver) {
      this.helpers.drawGrid();
      this.snake.update();
      this.food.draw();

      for (let p of this.particles) {
        p.update();
      }
      this.helpers.garbageCollector();
    } else {
      this.clear();
      this.GameOver();
    }
  }

  GameOver() {
    this.maxScore ? null : (this.maxScore = this.score);
    this.score > this.maxScore ? (this.maxScore = this.score) : null;
    window.localStorage.setItem('maxScore', `${this.maxScore}`);
    if (this.CTX) {
      this.CTX.fillStyle = '#4cffd7';
      this.CTX.textAlign = 'center';
      this.CTX.font = 'bold 30px, sans-serif';
      this.CTX.fillText('GAME OVER', this.config.W / 2, this.config.H / 2);
      this.CTX.font = '15px, sans-serif';
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
    // dom_score.innerText = '00';
    this.score = 0;
    this.snake = new Snake(this);
    this.food.spawn();
    // KEY.resetState();
    this.config.isGameOver = false;
    this.loop();
  }
}
