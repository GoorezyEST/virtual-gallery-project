import * as THREE from 'three';
import gsap from 'gsap';
import { Injectable, OnDestroy } from '@angular/core';
import { Experience } from '../Experience';
import { EventEmitter } from '@angular/core';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Quaternion } from 'three';

@Injectable()
export default class Controls implements OnDestroy {
  camera: THREE.PerspectiveCamera;
  // camera: THREE.OrthographicCamera;
  raycaster: THREE.Raycaster;
  pointer: THREE.Vector2;
  scene: THREE.Scene;
  intersectionEvent!: string;
  cubeClicked: boolean;
  distanceCameraToCube: number;
  snakeGameOnRun: EventEmitter<string>;
  snakeGameRunning: boolean;
  orbitControls: OrbitControls;
  onClickCallback: () => void;
  intersectedObject!: THREE.Object3D<THREE.Event> | null;
  initialCameraQueaternionState: THREE.Quaternion;
  worldCubeQuaternion: THREE.Quaternion;

  constructor(private experience: Experience) {
    this.camera = this.experience.camera.perspectiveCamera;
    this.orbitControls = this.experience.camera.controls;
    this.scene = this.experience.scene;
    this.pointer = new THREE.Vector2();

    // Cube Animation Trigger State and Camera animation Stuff
    this.distanceCameraToCube = this.experience.camera.controls.getDistance();
    this.initialCameraQueaternionState =
      this.experience.camera.cameraInitialQuaternionState;
    this.worldCubeQuaternion =
      this.experience.world.cubeWorld.cubeWorldQuaternion;
    this.raycaster = new THREE.Raycaster();
    this.cubeClicked = false;

    this.onClickCallback = () => {
      if (
        this.intersectionEvent &&
        this.intersectionEvent !== 'noIntersect' &&
        this.intersectedObject?.name === 'WorldCube'
      ) {
        this.cubeClicked = true;
      }
    };

    //Snake Game stuff
    this.snakeGameRunning = false;
    this.snakeGameOnRun = new EventEmitter();

    // Set click event listener
    window.addEventListener('click', this.onClickCallback.bind(this));

    this.setMouseMoveListener();
  }

  onIntersects() {
    // update the picking ray with the camera and pointer position
    this.raycaster.setFromCamera(this.pointer, this.camera);

    // calculate objects intersecting the picking ray
    const intersects = this.raycaster.intersectObjects(this.scene.children);

    this.intersectedObject = intersects[0] ? intersects[0].object : null;

    const intersectedFace = intersects[0] ? intersects[0].faceIndex : null;
    // console.log(this.intersectedObject);

    if (this.intersectedObject?.name !== 'WorldCube') return;
    // console.log(this.intersectedObject);
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
      const timeline = gsap.timeline();
      let initialQ = this.camera.quaternion.clone();
      let lerp = new Quaternion().slerpQuaternions(
        initialQ,
        new Quaternion().setFromEuler(new THREE.Euler(0, 0, Math.PI)),
        1
      );

      switch (this.intersectionEvent) {
        case 'faceOne':
          initialQ = this.camera.quaternion.clone();
          lerp = new Quaternion().slerpQuaternions(
            initialQ,
            new Quaternion().setFromEuler(
              new THREE.Euler(0, Math.PI / 6, -Math.PI / 2)
            ),
            1
          );
          this.orbitControls.enabled = false;

          timeline
            .to(
              this.camera.quaternion,
              {
                x: lerp.x,
                y: lerp.y,
                z: lerp.z,
                w: lerp.w,
              },
              'same'
            )
            .to(
              this.camera.position,
              {
                x: 3,
                y: -0.5,
                z: 2,
                ease: 'power2',
                onComplete: () => {
                  setTimeout(() => {
                    timeline.reverse();
                  }, 2000);
                },
                onReverseComplete: () => {
                  this.orbitControls.enabled = true;
                },
              },
              'same'
            );
          break;
        case 'faceTwo':
          initialQ = this.camera.quaternion.clone();
          lerp = new Quaternion().slerpQuaternions(
            initialQ,
            new Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0)),
            1
          );
          this.orbitControls.enabled = false;

          timeline
            .to(
              this.camera.quaternion,
              {
                x: lerp.x,
                y: lerp.y,
                z: lerp.z,
                w: lerp.w,
              },
              'same'
            )
            .to(
              this.camera.position,
              {
                x: 0,
                y: -4,
                z: 2.5,
                ease: 'power2',
                onComplete: () => {
                  setTimeout(() => {
                    timeline.reverse();
                  }, 2000);
                },
                onReverseComplete: () => {
                  this.orbitControls.enabled = true;
                },
              },
              'same'
            );
          break;
        case 'faceThree':
          initialQ = this.camera.quaternion.clone();
          lerp = new Quaternion().slerpQuaternions(
            initialQ,
            new Quaternion().setFromEuler(new THREE.Euler(0, 0, Math.PI / 2)),
            1
          );
          this.orbitControls.enabled = false;

          timeline
            .to(
              this.camera.quaternion,
              {
                x: lerp.x,
                y: lerp.y,
                z: lerp.z,
                w: lerp.w,
              },
              'same'
            )
            .to(
              this.camera.position,
              {
                x: -2,
                y: -0.25,
                z: 2.5,
                ease: 'power2',
                onComplete: () => {
                  setTimeout(() => {
                    timeline.reverse();
                  }, 2000);
                },
                onReverseComplete: () => {
                  this.orbitControls.enabled = true;
                },
              },
              'same'
            );
          break;
        case 'faceFour':
          initialQ = this.camera.quaternion.clone();
          // lerp = new Quaternion().slerpQuaternions(
          //   initialQ,
          //   new Quaternion().setFromEuler(new THREE.Euler(0, 0, 0)),
          //   1
          // );
          this.orbitControls.enabled = false;

          timeline
            .to(this.camera.position, {
              x: 0,
              y: 0,
              z: -this.distanceCameraToCube,
              ease: 'power2',
              onUpdate: () => {
                this.camera.lookAt(new THREE.Vector3());
              },
              onComplete: () => {
                setTimeout(() => {
                  timeline.reverse();
                }, 2000);
              },
              onReverseComplete: () => {
                this.orbitControls.enabled = true;
              },
            })
            .to(this.camera.position, {
              x: 0,
              y: -1,
              z: -3,
              ease: 'power2',
              onUpdate: () => {
                this.camera.lookAt(new THREE.Vector3());
              },
            });
          this.callSnakeGameRunner();
          break;
        case 'faceFive':
          initialQ = this.camera.quaternion.clone();
          lerp = new Quaternion().slerpQuaternions(
            initialQ,
            new Quaternion().setFromEuler(new THREE.Euler(0, 0, Math.PI)),
            1
          );

          if (this.camera.position.z < -1.5) break;

          this.orbitControls.enabled = false;

          timeline
            .to(
              this.camera.quaternion,
              {
                x: lerp.x,
                y: lerp.y,
                z: lerp.z,
                w: lerp.w,
              },
              'same'
            )
            .to(
              this.camera.position,
              {
                x: 0,
                y: -this.distanceCameraToCube + 3,
                z: 2,
                ease: 'power2',
                onComplete: () => {
                  setTimeout(() => {
                    timeline.reverse();
                  }, 2000);
                },
                onReverseComplete: () => {
                  this.orbitControls.enabled = true;
                },
              },
              'same'
            );

          break;
        case 'faceSix':
          initialQ = this.camera.quaternion.clone();
          lerp = new Quaternion().slerpQuaternions(
            initialQ,
            this.initialCameraQueaternionState,
            1
          );

          if (this.camera.position.z < -1.5) break;

          this.orbitControls.enabled = false;

          timeline
            .to(
              this.camera.quaternion,
              {
                x: lerp.x,
                y: lerp.y,
                z: lerp.z,
                w: lerp.w,
              },
              'same'
            )
            .to(
              this.camera.position,
              {
                x: 0,
                y: this.distanceCameraToCube - 4,
                z: 2,
                ease: 'power2',
                onComplete: () => {
                  setTimeout(() => {
                    timeline.reverse();
                  }, 2000);
                },
                onReverseComplete: () => {
                  this.orbitControls.enabled = true;
                },
              },
              'same'
            );
          break;
        default:
          break;
      }

      // console.log(this.camera.position);
      this.cubeClicked = false;
    }
  }

  callSnakeGameRunner() {
    this.snakeGameRunning = true;
    if (this.snakeGameRunning) {
      this.snakeGameOnRun.emit('SnakeGame Called');
      this.snakeGameRunning = false;
    }
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

  ngOnDestroy(): void {
    window.removeEventListener('click', this.onClickCallback);
  }
}
