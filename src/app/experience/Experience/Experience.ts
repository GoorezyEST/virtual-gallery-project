import * as THREE from 'three';
import { Injectable } from '@angular/core';

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
export class Experience {
  resizeEvent: Subscription;
  timerEvent: Subscription;
  // intersectionEvent: Subscription;
  scene: THREE.Scene;
  camera: Camera;
  sizes: Sizes;
  timer: Time;
  renderer: Renderer;
  world: World;
  controls: Controls;

  constructor(public canvas: HTMLCanvasElement) {
    //Utils
    this.sizes = new Sizes();
    this.timer = new Time();

    // Basic Scene
    this.scene = new THREE.Scene();
    this.world = new World(this);
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

    // this.intersectionEvent = this.controls.intersectionEvent.subscribe(
    //   (msg) => {
    //     console.log(msg);
    //   }
    // );
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
}
