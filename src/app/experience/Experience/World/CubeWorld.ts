import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import Camera from '../Camera';
import { Experience } from '../Experience';
import { Sizes } from '../Utils/Sizes';
import SnakeGame from './SnakeGame';
import { EventEmitter } from '@angular/core';
import gsap from 'gsap';
import * as dat from 'dat.gui';
import { BoxHelper } from 'three';

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
  skateAnimationCurve!: THREE.CatmullRomCurve3;
  skate!: THREE.Object3D<THREE.Event>;
  skatePos!: { value: number };
  box!: THREE.BoxHelper;
  animationMixer!: THREE.AnimationMixer;
  skateAnimation!: THREE.AnimationAction;
  fixPlane!: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;

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
    this.gltfLoader.load('assets/Experience/Models/CubeWorld.glb', (model) => {
      const snakeTextureMaterial = new THREE.MeshBasicMaterial({
        map: this.snakeGame.canvasTexture,
        fog: false,
      });
      model.scene.children.forEach((child) => {
        // Add SnakeGameTexture On SnakeFace

        if (child.name === 'WorldCube') {
          (child.children[5] as THREE.Mesh).material = snakeTextureMaterial;
        }
        // Found and replace Path of Skate Animation for CatMullRomCurve
        if (child.name === 'Skate_Animation_Curve') {
          model.scene.children.splice(model.scene.children.indexOf(child), 1);
        }

        if (child.name === 'Skate_Skate') {
          this.animationMixer = new THREE.AnimationMixer(child);
          this.skateAnimation = this.animationMixer.clipAction(
            model.animations[0]
          );
          this.skateAnimation.play();
        }
        if (
          child.name === 'City_Car' ||
          child.name === 'City_Building' ||
          child.name === 'City_Algodones'
        ) {
          child.children.forEach((e, i) => {
            if (e.type === 'LineSegments') {
              child.children.splice(i, 1);
            }
          });
        }
      });

      model.scene.rotation.y = Math.PI;
      this.cubeWorldQuaternion = model.scene.quaternion.clone();
      this.cubeWorldSceneReference = model.scene;
      this.scene.add(model.scene);

      this.fixPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(0.55, 0.95),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      );
      this.fixPlane.position.set(0, -0.37, 0.99);
      this.fixPlane.visible = false;
      this.scene.add(this.fixPlane);

      this.loadedEventEmitter.emit('Model Loaded');

      let light = new THREE.AmbientLight(new THREE.Color(0xffffff));
      this.scene.add(light);
    });
  }

  runSnakeGame() {
    this.snakeGame.canvasTexture.needsUpdate = true;
    this.snakeGame.loop();
  }

  animateSkate(delta: number) {
    this.animationMixer.update(delta * 0.001);
  }

  resize() {}

  update() {
    this.animateSkate(this.experience.timer.delta);
  }
}
