import * as THREE from 'three';
import Camera from './Camera';
import { Experience } from './Experience';
import { Sizes } from './Utils/Sizes';

export default class Renderer {
  public sizes: Sizes;
  public scene: THREE.Scene;
  public canvas: HTMLCanvasElement;
  public camera: Camera;
  public perspectiveCamera: THREE.PerspectiveCamera;
  public renderer!: THREE.WebGL1Renderer;

  constructor(public experience: Experience) {
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;
    this.camera = this.experience.camera;
    this.perspectiveCamera = this.camera.perspectiveCamera;

    this.setRenderer();
  }

  setRenderer() {
    this.renderer = new THREE.WebGL1Renderer({
      canvas: this.canvas,
      antialias: true,
    });
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(this.sizes.pixelRatio);
  }

  resize() {
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(this.sizes.pixelRatio);
  }

  update() {
    this.renderer.render(this.scene, this.perspectiveCamera);
  }
}
