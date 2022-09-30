import * as THREE from 'three';
import { Group } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import Camera from '../Camera';
import { Experience } from '../Experience';
import { Sizes } from '../Utils/Sizes';
import SnakeGame from './SnakeGame';
import { EventEmitter } from '@angular/core';

export default class CubeWorld {
  sizes: Sizes;
  scene: THREE.Scene;
  canvas: HTMLCanvasElement;
  camera: Camera;
  gltfLoader: GLTFLoader;
  snakeGame: SnakeGame;
  cubeWorldQuaternion!: THREE.Quaternion;
  loadedEventEmitter: EventEmitter<string>;
  cubeWorldSceneReference!: THREE.Group;
  snakeTextureMaterial!: THREE.Texture | null;

  constructor(private experience: Experience) {
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;
    this.camera = this.experience.camera;
    this.gltfLoader = new GLTFLoader();

    this.loadedEventEmitter = new EventEmitter();

    // SnakeGame Instance
    this.snakeGame = new SnakeGame();

    this.loadCubeWorldModel();
  }

  loadCubeWorldModel() {
    this.gltfLoader.load(
      'assets/Experience/Models/CubeWorldForTesting.glb',
      (model) => {
        const material = new THREE.MeshBasicMaterial({
          color: 0xffff00,
        });
        const worldCubeMaterials = [
          new THREE.MeshBasicMaterial({ color: 0xff0000 }),
          new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
          new THREE.MeshBasicMaterial({ color: 0x0000ff }),
          new THREE.MeshBasicMaterial({
            map: this.snakeGame.canvasTexture,
            fog: false,
            depthTest: false,
            depthWrite: false,
          }),
          new THREE.MeshBasicMaterial({ color: 0xff0ddd }),
          new THREE.MeshBasicMaterial({ color: 0xffa000 }),
        ];
        this.snakeTextureMaterial = worldCubeMaterials[3].map;

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
        model.scene.rotation.y = Math.PI;
        this.cubeWorldQuaternion = model.scene.quaternion.clone();
        this.cubeWorldSceneReference = model.scene;
        this.scene.add(model.scene);

        this.loadedEventEmitter.emit('Model Loaded');
      }
    );
  }

  runSnakeGame() {
    this.snakeGame.canvasTexture.needsUpdate = true;
    this.snakeGame.loop();
  }

  resize() {}

  update() {}
}
