import * as THREE from 'three';
import { Injectable, OnDestroy } from '@angular/core';

//Types
import { Subscription } from 'rxjs';

// Utils
import { Sizes } from './Utils/Sizes';
import Time from './Utils/Time';

// Scene
import Camera from './Camera';
import Renderer from './Renderer';
import World from './World/World';
import Controls from './World/Controls';

@Injectable()
export class Experience implements OnDestroy {
  resizeEvent!: Subscription;
  timerEvent!: Subscription;
  snakeGamePlayEvent!: Subscription;
  // intersectionEvent: Subscription;
  scene: THREE.Scene;
  camera!: Camera;
  sizes: Sizes;
  timer: Time;
  renderer!: Renderer;
  world: World;
  controls!: Controls;
  worldLoadedEvent: Subscription;

  constructor(public canvas: HTMLCanvasElement) {
    //Utils
    this.sizes = new Sizes();
    this.timer = new Time();

    // Basic Scene
    this.scene = new THREE.Scene();
    this.world = new World(this);

    this.worldLoadedEvent = this.world.cubeWorld.loadedEventEmitter.subscribe(
      () => {
        this.camera = new Camera(this);
        this.renderer = new Renderer(this);
        this.controls = new Controls(this);

        // Events Listening
        this.resizeEvent = this.sizes.event.subscribe(() => {
          this.resize();
        });
        this.timerEvent = this.timer.event.subscribe(() => {
          this.update();
        });
        this.snakeGamePlayEvent = this.controls.snakeGameOnRun.subscribe(
          (msg) => {
            console.log(msg);
          }
        );
      }
    );

    // Only DEV code for Testing Purposes
  }

  resize() {
    this.camera.resize();
    this.renderer.resize();
    this.world.resize();
  }

  update() {
    this.camera.update();
    this.controls.onIntersects();
    this.renderer.update();
    this.world.update();
  }
  ngOnDestroy(): void {
    this.resizeEvent.unsubscribe();
    this.timerEvent.unsubscribe();
    this.snakeGamePlayEvent.unsubscribe();
  }
}
