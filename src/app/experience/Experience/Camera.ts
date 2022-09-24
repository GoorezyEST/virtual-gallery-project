import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Experience } from './Experience';
import { Sizes } from './Utils/Sizes';

export default class Camera {
  sizes: Sizes;
  scene: THREE.Scene;
  canvas: HTMLCanvasElement;
  perspectiveCamera!: THREE.PerspectiveCamera;
  controls!: OrbitControls;

  constructor(private experience: Experience) {
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;

    this.createPerspectiveCamera();
    this.setOrbitControls();
  }

  createPerspectiveCamera() {
    this.perspectiveCamera = new THREE.PerspectiveCamera(
      70,
      this.sizes.aspect,
      0.1,
      1000
    );
    this.perspectiveCamera.position.set(0, 0, 5);
    this.scene.add(this.perspectiveCamera);
  }

  setOrbitControls() {
    this.controls = new OrbitControls(this.perspectiveCamera, this.canvas);
    this.controls.enableDamping = true;
    this.controls.enableZoom = true;
  }

  resize() {
    // Updating Perspective
    this.perspectiveCamera.aspect = this.sizes.aspect;
    this.perspectiveCamera.updateProjectionMatrix();
  }

  update() {
    this.controls.update();
  }
}
