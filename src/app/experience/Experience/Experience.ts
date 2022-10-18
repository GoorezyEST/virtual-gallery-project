import * as THREE from 'three';
import { Injectable, OnDestroy } from '@angular/core';
//Types
import { Subscription } from 'rxjs';

// Utils
import { Sizes } from './Utils/Sizes';
import Time from './Utils/Time';
import { EventEmitter } from '@angular/core';

// Scene
import Camera from './Camera';
import Renderer from './Renderer';
import World from './World/World';
import Controls from './World/Controls';

@Injectable()
export class Experience implements OnDestroy {
  userDeviceType: string = 'dblclick';
  resizeEvent!: Subscription;
  timerEvent!: Subscription;
  snakeGamePlayEvent!: Subscription;
  scene: THREE.Scene;
  camera!: Camera;
  sizes: Sizes;
  timer: Time;
  renderer!: Renderer;
  world: World;
  controls!: Controls;
  worldLoadedEvent: Subscription;
  experienceLoaded: EventEmitter<string>;
  playSnakeGame!: EventEmitter<string>;
  finishExperienceEvent: EventEmitter<string>;
  setGeneralControls: () => void;

  constructor(public canvas: HTMLCanvasElement) {
    if (navigator.userAgent.includes('Mobile')) {
      this.userDeviceType = 'click';
    }

    //Utils
    this.sizes = new Sizes();
    this.timer = new Time();
    this.playSnakeGame = new EventEmitter();
    this.finishExperienceEvent = new EventEmitter();
    this.experienceLoaded = new EventEmitter();

    // Basic Scene
    this.scene = new THREE.Scene();
    this.world = new World(this);

    // Control Controls Setting Time
    this.setGeneralControls = () => {
      this.controls = new Controls(this);
      this.controls.snakeGameOnRun.subscribe(() => {
        this.playSnakeGame.emit('Run');
      });
    };

    this.worldLoadedEvent = this.world.cubeWorld.loadedEventEmitter.subscribe(
      () => {
        this.experienceLoaded.emit('Experience Loaded');
        this.camera = new Camera(this);
        this.renderer = new Renderer(this);

        // Events Listening
        this.resizeEvent = this.sizes.event.subscribe(() => {
          this.resize();
        });
        this.timerEvent = this.timer.event.subscribe(() => {
          this.update();
        });
      }
    );
  }

  finishExperience() {
    this.finishExperienceEvent.emit('Experience Finished');
  }

  resize() {
    this.camera.resize();
    this.renderer.resize();
    this.world.resize();
  }

  update() {
    if (this.controls) {
      this.world.update();
      this.camera.update();
      this.controls.update();
      this.renderer.update();
    }
  }
  ngOnDestroy(): void {
    this.resizeEvent.unsubscribe();
    this.timerEvent.unsubscribe();
  }
}
