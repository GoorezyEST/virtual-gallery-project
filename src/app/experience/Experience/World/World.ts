import * as THREE from 'three';
import Camera from '../Camera';
import { Experience } from '../Experience';
import { Sizes } from '../Utils/Sizes';
import CubeWorld from './CubeWorld';

export default class World {
  sizes: Sizes;
  scene: THREE.Scene;
  canvas: HTMLCanvasElement;
  camera: Camera;
  cubeWorld: CubeWorld;

  constructor(private experience: Experience) {
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;
    this.camera = this.experience.camera;

    this.cubeWorld = new CubeWorld(experience);
  }

  resize() {}

  update() {}
}
