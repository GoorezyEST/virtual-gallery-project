import * as THREE from 'three';
import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import Camera from '../Camera';
import { Experience } from '../Experience';
import { Sizes } from '../Utils/Sizes';

export default class World {
  sizes: Sizes;
  scene: THREE.Scene;
  canvas: HTMLCanvasElement;
  camera: Camera;
  gltfLoader: GLTFLoader;

  constructor(private experience: Experience) {
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;
    this.camera = this.experience.camera;
    this.gltfLoader = new GLTFLoader();

    this.loadCubeWorldModel();
  }

  loadCubeWorldModel() {
    this.gltfLoader.load(
      'assets/Experience/Models/CubeWorldForTesting.glb',
      (model) => {
        console.log(model);
        const material = new THREE.MeshBasicMaterial({
          color: 0xffff00,
        });
        const worldCubeMaterials = [
          new THREE.MeshBasicMaterial({ color: 0xff0000 }),
          new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
          new THREE.MeshBasicMaterial({ color: 0x0000ff }),
          new THREE.MeshBasicMaterial({ color: 0xf0a0a0 }),
          new THREE.MeshBasicMaterial({ color: 0xff0ddd }),
          new THREE.MeshBasicMaterial({ color: 0xffa000 }),
        ];
        model.scene.children.forEach((child) => {
          if (child instanceof Group) {
            child.children.forEach(
              (e) => ((e as THREE.Mesh).material = material)
            );
          } else if (child.name === 'WorldCube') {
            let geo = (child as THREE.Mesh).geometry.clone();
            (child as THREE.Mesh).geometry = new THREE.BoxGeometry().copy(geo);
            (child as THREE.Mesh).geometry.groups =
              new THREE.BoxGeometry().groups;
            (child as THREE.Mesh).material = worldCubeMaterials;
          } else if (!(child instanceof Group) && child.name !== 'WorldCube') {
            (child as THREE.Mesh).material = material;
          }
        });
        this.scene.add(model.scene);
      }
    );
  }

  resize() {}

  update() {}
}
