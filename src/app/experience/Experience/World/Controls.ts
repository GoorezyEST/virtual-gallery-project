import * as THREE from 'three';
import gsap from 'gsap';
import { Injectable, OnDestroy } from '@angular/core';
import { Experience } from '../Experience';
import { EventEmitter } from '@angular/core';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { BoxHelper, Quaternion } from 'three';

@Injectable()
export default class Controls implements OnDestroy {
  camera: THREE.PerspectiveCamera;
  // camera: THREE.OrthographicCamera;
  raycaster: THREE.Raycaster;
  pointer: THREE.Vector2;
  scene: THREE.Scene;
  intersectionEvent!: string | null;
  cubeClicked: boolean;
  distanceCameraToCube: number;
  snakeGameOnRun: EventEmitter<string>;
  snakeGameRunning: boolean;
  orbitControls: OrbitControls;
  onClickCallback: () => void;
  intersectedObject!: THREE.Object3D<THREE.Event> | null;
  initialCameraQueaternionState: THREE.Quaternion;
  worldCubeQuaternion: THREE.Quaternion;
  listenerToReverseAnimation!: any;
  onAnimationState: boolean = false;
  linearRotationSetted: boolean = false;
  linearRotationAxis!: string;
  linearRotationSpeed!: number;
  linearRotationDireccion!: number;

  constructor(private experience: Experience) {
    this.camera = this.experience.camera.perspectiveCamera;
    this.orbitControls = this.experience.camera.controls;
    this.scene = this.experience.scene;
    this.pointer = new THREE.Vector2(10000, 10000);

    // Cube Animation Trigger State and Camera animation Stuff
    this.distanceCameraToCube = this.experience.camera.controls.getDistance();
    this.initialCameraQueaternionState =
      this.experience.camera.cameraInitialQuaternionState;
    this.worldCubeQuaternion =
      this.experience.world.cubeWorld.cubeWorldQuaternion;
    this.raycaster = new THREE.Raycaster();
    this.cubeClicked = false;

    this.onClickCallback = () => {
      if (this.intersectionEvent && !this.onAnimationState) {
        this.cubeClicked = true;
      }
    };

    //Snake Game stuff
    this.snakeGameRunning = false;
    this.snakeGameOnRun = new EventEmitter();

    // Set click event listener
    window.addEventListener('dblclick', this.onClickCallback.bind(this));

    this.setMouseMoveListener();
  }

  onIntersects() {
    // update the picking ray with the camera and pointer position
    this.raycaster.setFromCamera(this.pointer, this.camera);

    // calculate objects intersecting the picking ray
    const intersects = this.raycaster.intersectObjects(this.scene.children);
    this.intersectedObject = intersects[0] ? intersects[0].object : null;

    if (!this.intersectedObject?.name) {
      this.intersectionEvent = null;
      return;
    }
    if (
      this.intersectedObject?.name.includes('Door') ||
      this.intersectedObject?.name === 'WorldCube_4'
    ) {
      this.intersectionEvent = 'DoorFace';
    } else if (
      this.intersectedObject?.name.includes('Skate') ||
      this.intersectedObject?.name === 'WorldCube_5'
    ) {
      this.intersectionEvent = 'SkateFace';
    } else if (
      this.intersectedObject?.name.includes('City') ||
      this.intersectedObject?.name === 'WorldCube_3'
    ) {
      this.intersectionEvent = 'CityFace';
    } else if (
      this.intersectedObject?.name.includes('SetUp') ||
      this.intersectedObject?.name === 'WorldCube_1'
    ) {
      this.intersectionEvent = 'SetUpFace';
    } else if (
      this.intersectedObject?.name.includes('Nature') ||
      this.intersectedObject?.name === 'WorldCube_2'
    ) {
      this.intersectionEvent = 'NatureFace';
    } else if (this.intersectedObject?.name === 'WorldCube_6') {
      this.intersectionEvent = 'SnakeFace';
    }
    if (this.cubeClicked) {
      this.onAnimationState = true;
      const timeline = gsap.timeline();
      let initialQ = this.camera.quaternion.clone();
      let lerp = new Quaternion().slerpQuaternions(
        initialQ,
        new Quaternion().setFromEuler(new THREE.Euler(0, 0, Math.PI)),
        1
      );

      switch (this.intersectionEvent) {
        case 'CityFace':
          this.orbitControls.enabled = false;
          timeline
            .to(
              this.scene.children[0].rotation,
              {
                x: 0,
                y: 0,
                z: -Math.PI / 2,
                duration: 2,
              },
              'same'
            )
            .to(
              this.camera.position,
              {
                x: -0.5,
                y: 1.5,
                z: 2,
                duration: 2,
                ease: 'power2',
                onUpdate: () => {
                  this.camera.lookAt(-0.5, 1.5, 0);
                },
                onComplete: () => {
                  this.orbitControls.maxPolarAngle = Math.PI / 2;
                  this.orbitControls.minPolarAngle = -Math.PI / 4;
                  this.orbitControls.target = new THREE.Vector3(-0.5, 1.5, 0);
                  this.orbitControls.update();
                  this.orbitControls.enabled = true;
                  this.listenerToReverseAnimation = () => {
                    this.orbitControls.target = new THREE.Vector3();
                    this.orbitControls.maxPolarAngle = Math.PI;
                    this.orbitControls.minPolarAngle = 0;
                    this.orbitControls.update();
                    this.orbitControls.enabled = false;
                    gsap.to(this.camera.position, {
                      x: -0.5,
                      y: 1.5,
                      z: 2,
                      duration: 2,
                      ease: 'power2',
                      onUpdate: () => {
                        this.camera.lookAt(-0.5, 1.5, 0);
                      },
                      onComplete: () => {
                        window.removeEventListener(
                          'dblclick',
                          this.listenerToReverseAnimation,
                          false
                        );
                        timeline.reverse();
                      },
                    });
                  };
                  window.addEventListener(
                    'dblclick',
                    this.listenerToReverseAnimation,
                    false
                  );
                },
                onReverseComplete: () => {
                  this.orbitControls.enabled = true;
                  this.onAnimationState = false;
                },
              },
              'same'
            );
          break;
        case 'DoorFace':
          this.orbitControls.enabled = false;
          timeline.to(
            this.camera.position,
            {
              x: 0,
              y: -1,
              z: 2.65,
              duration: 2,
              ease: 'power2',
              onUpdate: () => {
                this.camera.lookAt(0, 0, 0);
              },
              onComplete: () => {
                this.scene.children[1].visible = true;
                this.scene.children[0].children.forEach((child) => {
                  if (child.name === 'Door_Door') {
                    gsap.to(child.rotation, {
                      x: 0,
                      y: -Math.PI * 0.1,
                      z: 0,
                      duration: 2,
                      ease: 'elastic.out(1, 0.75)',
                    });
                  }
                });
                this.orbitControls.target = new THREE.Vector3(0, 0, 0);
                this.orbitControls.maxAzimuthAngle = Math.PI / 12;
                this.orbitControls.minAzimuthAngle = -Math.PI / 12;
                this.orbitControls.maxPolarAngle = Math.PI * 0.65;
                this.orbitControls.minPolarAngle = Math.PI * 0.55;
                this.orbitControls.update();
                this.orbitControls.enabled = true;
                this.listenerToReverseAnimation = () => {
                  this.orbitControls.maxPolarAngle = Math.PI;
                  this.orbitControls.minPolarAngle = 0;
                  this.orbitControls.maxAzimuthAngle = Infinity;
                  this.orbitControls.minAzimuthAngle = Infinity;
                  this.orbitControls.update();
                  this.orbitControls.enabled = false;
                  this.scene.children[0].children.forEach((child) => {
                    if (child.name === 'Door_Door') {
                      gsap.to(child.rotation, {
                        x: 0,
                        y: 0,
                        z: 0,
                        duration: 0.5,
                        ease: 'power2',
                      });
                    }
                  });
                  gsap.to(this.camera.position, {
                    x: 0,
                    y: -1,
                    z: 2.65,
                    ease: 'power2',
                    onUpdate: () => {
                      this.camera.lookAt(0, 0, 0);
                    },
                    onComplete: () => {
                      window.removeEventListener(
                        'dblclick',
                        this.listenerToReverseAnimation,
                        false
                      );
                      timeline.reverse();
                    },
                  });
                };
                window.addEventListener(
                  'dblclick',
                  this.listenerToReverseAnimation,
                  false
                );
              },
              onReverseComplete: () => {
                this.orbitControls.enabled = true;
                this.scene.children[1].visible = false;
                this.onAnimationState = false;
              },
            },
            'same'
          );
          break;
        case 'NatureFace':
          this.orbitControls.enabled = false;
          timeline
            .to(
              this.scene.children[0].rotation,
              {
                x: 0,
                y: 0,
                z: Math.PI / 2,
                duration: 2,
              },
              'same'
            )
            .to(
              this.camera.position,
              {
                x: 0.5,
                y: 1.5,
                z: 2,
                duration: 2,
                ease: 'power2',
                onUpdate: () => {
                  this.camera.lookAt(0.5, 1.5, 0);
                },
                onComplete: () => {
                  this.orbitControls.maxPolarAngle = Math.PI / 2;
                  this.orbitControls.minPolarAngle = -Math.PI / 4;
                  this.orbitControls.target = new THREE.Vector3(0.5, 1.5, 0);
                  this.orbitControls.update();
                  this.orbitControls.enabled = true;
                  this.listenerToReverseAnimation = () => {
                    this.orbitControls.target = new THREE.Vector3();
                    this.orbitControls.maxPolarAngle = Math.PI;
                    this.orbitControls.minPolarAngle = 0;
                    this.orbitControls.update();
                    this.orbitControls.enabled = false;
                    gsap.to(this.camera.position, {
                      x: 0.5,
                      y: 1.5,
                      z: 2,
                      duration: 2,
                      ease: 'power2',
                      onUpdate: () => {
                        this.camera.lookAt(0.5, 1.5, 0);
                      },
                      onComplete: () => {
                        window.removeEventListener(
                          'dblclick',
                          this.listenerToReverseAnimation,
                          false
                        );
                        timeline.reverse();
                      },
                    });
                  };
                  window.addEventListener(
                    'dblclick',
                    this.listenerToReverseAnimation,
                    false
                  );
                },
                onReverseComplete: () => {
                  this.onAnimationState = false;
                  console.log(this.scene.children[0]);
                  setTimeout(() => {
                    this.orbitControls.enabled = true;
                  }, 1000);
                },
              },
              'same'
            );
          break;
        case 'SnakeFace':
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
                this.listenerToReverseAnimation = () => {
                  timeline.reverse();
                };
                window.addEventListener(
                  'dblclick',
                  this.listenerToReverseAnimation
                );
              },
              onReverseComplete: () => {
                this.orbitControls.enabled = true;
                window.removeEventListener(
                  'dblclick',
                  this.listenerToReverseAnimation
                );
                this.onAnimationState = false;
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
        case 'SkateFace':
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
                  this.listenerToReverseAnimation = () => {
                    timeline.reverse();
                  };
                  window.addEventListener(
                    'dblclick',
                    this.listenerToReverseAnimation
                  );
                },
                onReverseComplete: () => {
                  this.orbitControls.enabled = true;
                  window.removeEventListener(
                    'dblclick',
                    this.listenerToReverseAnimation
                  );
                  this.onAnimationState = false;
                },
              },
              'same'
            );

          break;
        case 'SetUpFace':
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
                  this.listenerToReverseAnimation = () => {
                    timeline.reverse();
                  };
                  window.addEventListener(
                    'dblclick',
                    this.listenerToReverseAnimation
                  );
                },
                onReverseComplete: () => {
                  this.orbitControls.enabled = true;
                  window.removeEventListener(
                    'dblclick',
                    this.listenerToReverseAnimation
                  );
                  this.onAnimationState = false;
                },
              },
              'same'
            );
          break;
        default:
          break;
      }
      this.intersectionEvent = null;
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

  setLinearRotation(axis: string, speed: number, direction: number) {
    this.linearRotationSetted = true;
    this.linearRotationAxis = axis;
    this.linearRotationSpeed = speed;
    this.linearRotationDireccion = direction;
  }

  runLinearRotation() {}

  onPointerMove(event: MouseEvent) {
    // calculate pointer position in normalized device coordinates
    // (-1 to +1) for both components
    this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  setMouseMoveListener() {
    window.addEventListener('pointermove', this.onPointerMove.bind(this));
  }

  resize() {}

  update() {
    this.onIntersects();
    if (this.linearRotationSetted) {
      this.runLinearRotation();
    }
  }

  ngOnDestroy(): void {
    window.removeEventListener('click', this.onClickCallback);
  }
}
