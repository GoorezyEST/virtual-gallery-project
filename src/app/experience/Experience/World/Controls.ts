import * as THREE from 'three';
import gsap from 'gsap';
import { Injectable } from '@angular/core';
import { Experience } from '../Experience';

@Injectable()
export default class Controls {
  camera: THREE.PerspectiveCamera;
  raycaster: THREE.Raycaster;
  pointer: THREE.Vector2;
  scene: THREE.Scene;
  intersectionEvent!: string;
  cubeClicked: boolean;
  distanceCameraToCube: number;

  constructor(private experience: Experience) {
    this.camera = this.experience.camera.perspectiveCamera;
    this.distanceCameraToCube = this.experience.camera.controls.getDistance();
    this.scene = this.experience.scene;
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
    this.cubeClicked = false;
    // this.intersectionEvent = new EventEmitter();

    // Set click event listener
    window.addEventListener('click', () => {
      if (this.intersectionEvent && this.intersectionEvent !== 'noIntersect') {
        this.cubeClicked = true;
      }
    });

    this.setMouseMoveListener();
  }

  onIntersects() {
    // update the picking ray with the camera and pointer position
    this.raycaster.setFromCamera(this.pointer, this.camera);

    // calculate objects intersecting the picking ray
    const intersects = this.raycaster.intersectObjects(this.scene.children);

    const intersectedFace = intersects[0] ? intersects[0].faceIndex : null;

    switch (intersectedFace) {
      case 0:
      case 1:
        //   this.intersectionEvent.emit('faceOne');
        this.intersectionEvent = 'faceOne';
        break;
      case 2:
      case 3:
        //   this.intersectionEvent.emit('faceTwo');
        this.intersectionEvent = 'faceTwo';
        break;
      case 4:
      case 5:
        //   this.intersectionEvent.emit('faceThree');
        this.intersectionEvent = 'faceThree';
        break;
      case 6:
      case 7:
        //   this.intersectionEvent.emit('faceFour');
        this.intersectionEvent = 'faceFour';
        break;
      case 8:
      case 9:
        //   this.intersectionEvent.emit('faceFive');
        this.intersectionEvent = 'faceFive';
        break;
      case 10:
      case 11:
        //   this.intersectionEvent.emit('faceSix');
        this.intersectionEvent = 'faceSix';
        break;
      default:
        this.intersectionEvent = 'noIntersect';
        break;
    }

    if (this.cubeClicked === true) {
      switch (this.intersectionEvent) {
        case 'faceOne':
          gsap.to(this.camera.position, {
            x: this.distanceCameraToCube,
            y: 0,
            z: 0,
            ease: 'power2',
          });
          break;
        case 'faceTwo':
          gsap.to(this.camera.position, {
            x: -this.distanceCameraToCube,
            y: 0,
            z: 0,
            ease: 'power2',
          });
          break;
        case 'faceThree':
          gsap.to(this.camera.position, {
            x: 0,
            y: this.distanceCameraToCube,
            z: 0,
            ease: 'power2',
          });
          break;
        case 'faceFour':
          gsap.to(this.camera.position, {
            x: 0,
            y: -this.distanceCameraToCube,
            z: 0,
            ease: 'power2',
            duration: 1.5,
          });
          break;
        case 'faceFive':
          gsap.to(this.camera.position, {
            x: 0,
            y: 0,
            z: this.distanceCameraToCube,
            ease: 'power2',
          });
          break;
        case 'faceSix':
          gsap.to(this.camera.position, {
            x: 0,
            y: 0,
            z: this.distanceCameraToCube,
            ease: 'power2',
          });
          break;
        default:
          break;
      }
    }

    this.cubeClicked = false;
  }

  onPointerMove(event: MouseEvent) {
    // calculate pointer position in normalized device coordinates
    // (-1 to +1) for both components

    this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    // console.log(this.pointer);
  }

  setMouseMoveListener() {
    window.addEventListener('pointermove', this.onPointerMove.bind(this));
  }

  resize() {}

  update() {}
}
