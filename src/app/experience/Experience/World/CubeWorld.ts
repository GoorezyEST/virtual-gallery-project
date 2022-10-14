import * as THREE from 'three';
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
      'assets/Experience/Models/SkateCurveMesh.glb',
      (model) => {
        console.log(model);
      }
    );

    this.gltfLoader.load(
      'assets/Experience/Models/CubeWorldForTesting.glb',
      (model) => {
        const material = new THREE.MeshBasicMaterial({
          color: 0xffff00,
        });
        const snakeTextureMaterial = new THREE.MeshBasicMaterial({
          map: this.snakeGame.canvasTexture,
          fog: false,
        });

        console.log(model.scene);

        model.scene.children.forEach((child) => {
          // if (child.name === 'Skate_MOV') {
          //   child.children.forEach((child) => {
          //     child.children.forEach((child) => {
          //       child.children.forEach((child) => {
          //         // (child as THREE.Mesh).material = new THREE.MeshBasicMaterial({
          //         //   color: 0xffffff,
          //         // });
          //       });
          //     });
          //   });
          // }
          if (child.name === 'WorldCube') {
            (child.children[5] as THREE.Mesh).material = snakeTextureMaterial;
          }
        });
        model.scene.rotation.y = Math.PI;
        this.cubeWorldQuaternion = model.scene.quaternion.clone();
        this.cubeWorldSceneReference = model.scene;
        this.scene.add(model.scene);
        this.loadedEventEmitter.emit('Model Loaded');

        let light = new THREE.AmbientLight(new THREE.Color(0xffffff));
        this.scene.add(light);
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
