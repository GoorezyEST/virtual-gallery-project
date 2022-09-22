import * as THREE from 'three';
import Camera from '../Camera';
import { Experience } from '../Experience';
import { Sizes } from '../Utils/Sizes';

export default class World {
  public sizes: Sizes;
  public scene: THREE.Scene;
  public canvas: HTMLCanvasElement;
  public camera: Camera;

  constructor(private experience: Experience) {
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;
    this.camera = this.experience.camera;

    this.addCube();
  }

  addCube() {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({
      vertexColors: true,
    });

    const positionAttribute = geometry.getAttribute('position');

    const colors = [];
    const color = new THREE.Color();

    for (let i = 0; i < positionAttribute.count; i += 3) {
      color.set(Math.random() * 0xffffff);

      // define the same color for each vertex of a triangle

      colors.push(color.r, color.g, color.b);
      colors.push(color.r, color.g, color.b);
      colors.push(color.r, color.g, color.b);
    }

    // define the new attribute

    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const cube = new THREE.Mesh(geometry, material);
    this.scene.add(cube);
  }

  resize() {}

  update() {}
}
