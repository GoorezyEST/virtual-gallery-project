import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import Camera from '../Camera';
import { Experience } from '../Experience';
import { Sizes } from '../Utils/Sizes';
import SnakeGame from './SnakeGame';
import { EventEmitter } from '@angular/core';
import { VideoTexture } from 'three';

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
  cubeDoor!: THREE.Object3D<THREE.Event>;
  video!: {
    [name: string]: HTMLVideoElement;
  };
  videoTexture!: {
    [name: string]: VideoTexture;
  };
  video2!: { cloudVideo: HTMLVideoElement };
  videoTexture2!: {
    [name: string]: VideoTexture;
  };

  constructor(public experience: Experience) {
    this.sizes = this.experience.sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;
    this.camera = this.experience.camera;
    this.gltfLoader = new GLTFLoader();

    this.loadedEventEmitter = new EventEmitter();

    // SnakeGame Instance
    this.snakeGame = new SnakeGame(this);

    this.loadCubeWorldModel();
  }

  loadVideoTextures() {
    this.video = { ['ProgramingVideo']: document.createElement('video') };
    this.video['ProgramingVideo'].src = 'assets/Experience/tex.mp4';
    this.video['ProgramingVideo'].muted = true;
    this.video['ProgramingVideo'].playsInline = true;
    this.video['ProgramingVideo'].autoplay = true;
    this.video['ProgramingVideo'].loop = true;
    this.video['ProgramingVideo'].play();

    this.videoTexture = {
      ['ProgramingVideo']: new THREE.VideoTexture(
        this.video['ProgramingVideo']
      ),
    };
    this.videoTexture['ProgramingVideo'].flipY = true;
    this.videoTexture['ProgramingVideo'].minFilter = THREE.NearestFilter;
    this.videoTexture['ProgramingVideo'].magFilter = THREE.NearestFilter;
    this.videoTexture['ProgramingVideo'].generateMipmaps = false;
    this.videoTexture['ProgramingVideo'].encoding = THREE.sRGBEncoding;

    this.video2 = { ['cloudVideo']: document.createElement('video') };
    this.video2['cloudVideo'].src = 'assets/Experience/tex2.mp4';
    this.video2['cloudVideo'].muted = true;
    this.video2['cloudVideo'].playsInline = true;
    this.video2['cloudVideo'].autoplay = true;
    this.video2['cloudVideo'].loop = true;
    this.video2['cloudVideo'].play();

    this.videoTexture2 = {
      ['cloudVideo']: new THREE.VideoTexture(this.video2['cloudVideo']),
    };
    this.videoTexture2['cloudVideo'].flipY = false;
    this.videoTexture2['cloudVideo'].minFilter = THREE.NearestFilter;
    this.videoTexture2['cloudVideo'].magFilter = THREE.NearestFilter;
    this.videoTexture2['cloudVideo'].generateMipmaps = false;
    this.videoTexture2['cloudVideo'].encoding = THREE.sRGBEncoding;
  }

  loadCubeWorldModel() {
    this.loadVideoTextures();

    this.gltfLoader.load('assets/Experience/Models/CubeWorld.glb', (model) => {
      const snakeTextureMaterial = new THREE.MeshBasicMaterial({
        map: this.snakeGame.canvasTexture,
        fog: false,
      });
      model.scene.children.forEach((child) => {
        // Add SnakeGameTexture On SnakeFace

        if (child.name === 'SetUp_Monitor1__Screen') {
          (child as THREE.Mesh).material = new THREE.MeshBasicMaterial({
            map: this.videoTexture2['cloudVideo'],
          });
        }
        if (child.name === 'SetUp_Monitor2__Screen') {
          (child as THREE.Mesh).material = new THREE.MeshBasicMaterial({
            map: this.videoTexture['ProgramingVideo'],
          });
        }

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
        if (child.name === 'Door_Door') {
          this.cubeDoor = child;
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
