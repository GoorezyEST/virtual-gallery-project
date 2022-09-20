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

@Injectable()
export class Experience {
  public resizeEvent: Subscription;
  public timerEvent: Subscription;
  public scene: THREE.Scene;
  public camera: Camera;
  public sizes: Sizes;
  public timer: Time;
  public renderer: Renderer;
  public world: World;

  constructor(public canvas: HTMLCanvasElement) {
    //Utils
    this.sizes = new Sizes();
    this.timer = new Time();

    // Basic Scene
    this.scene = new THREE.Scene();
    this.world = new World(this);
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

  resize() {
    this.camera.resize();
    this.renderer.resize();
    this.world.resize();
  }

  update() {
    this.camera.update();
    this.renderer.update();
    this.world.update();
  }
}
