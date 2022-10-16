import { Injectable } from '@angular/core';
import * as THREE from 'three';
import Snake from './Snake/Snake';
import SnakeControls from './Snake/SnakeControls';
import SnakeFood from './Snake/SnakeFood';
import Particle from './Snake/SnakeParticles';
import Config from './Snake/SnakeUtils/Config';
import { HelperFunctions } from './Snake/SnakeUtils/Helpers';
import * as dat from 'dat.gui';
import CubeWorld from './CubeWorld';

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
  // gui: dat.GUI;

  constructor() {
    // Varialbles de juego
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

    // this.gui = new dat.GUI();

    // Textura a partir del canvas del juego
    if (this.config.CTX)
      this.canvasTexture = new THREE.CanvasTexture(this.config.CTX.canvas);
    this.canvasTexture.flipY = false;
    this.canvasTexture.magFilter = THREE.LinearFilter;
    this.canvasTexture.wrapS = THREE.RepeatWrapping;
    this.canvasTexture.wrapT = THREE.RepeatWrapping;
    this.canvasTexture.mapping = THREE.UVMapping;
    this.canvasTexture.repeat = new THREE.Vector2(2.998, 2.998);
    // this.canvasTexture.offset = new THREE.Vector2(0, 0);
    // this.canvasTexture.rotation = 1.5708;
    // this.gui
    //   .add(this.canvasTexture.repeat, 'x', 0, 5, 0.001)
    //   .name('texture.repeat.x');
    // this.gui
    //   .add(this.canvasTexture.repeat, 'y', 0, 5, 0.001)
    //   .name('texture.repeat.y');
    // this.gui
    //   .add(this.canvasTexture.offset, 'x', -2, 2, 0.001)
    //   .name('texture.offset.x');
    // this.gui
    //   .add(this.canvasTexture.offset, 'y', -2, 2, 0.001)
    //   .name('texture.offset.y');
    // this.gui
    //   .add(this.canvasTexture.center, 'x', -0.5, 1.5, 0.001)
    //   .name('texture.center.x');
    // this.gui
    //   .add(this.canvasTexture.center, 'y', -0.5, 1.5, 0.001)
    //   .name('texture.center.y');
    // this.gui.add(this.canvasTexture, 'rotation', 0, 5, 0.0001);
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
    this.snakeControls.listen();
    // dom_replay.addEventListener('click', this.reset, false);
  }

  loop() {
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
    this.snake.KEY.resetState();
    this.config.isGameOver = false;
    this.loop();
  }
}
