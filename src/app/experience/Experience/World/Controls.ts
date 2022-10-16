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
  timeline!: gsap.core.Timeline;
  cubeDoor: THREE.Object3D<THREE.Event>;
  whitePlane: THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>;

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

    // Cube Assets for animation
    this.cubeDoor = this.experience.world.cubeWorld.cubeDoor;
    this.whitePlane = this.experience.world.cubeWorld.fixPlane;

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

    // Guard claw, si el puntero no esta sobre ninguna cara, entonces salimos de esta funcion
    if (!this.intersectedObject?.name) {
      this.intersectionEvent = null;
      return;
    }

    // Averiguar que cara se toco del cubo
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
    // Condicional a entrar a la hora de registrar doble click sobre una cara
    if (this.cubeClicked) {
      // Animations Timeline
      this.timeline = gsap.timeline();
      this.onAnimationState = true;
      let initialQ = this.camera.quaternion.clone();

      // Deshabilitar los orbit controls o las animaciones no fucionan
      this.orbitControls.enabled = false;

      // Animaciones a accionar dependiendo la cara del cubo cliqueada
      switch (this.intersectionEvent) {
        case 'CityFace':
          this.timeline
            // Movimiento del Mesh
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
            // Movimiento de camara
            .to(
              this.camera.position,
              {
                x: -0.5,
                y: 1.5,
                z: 2,
                duration: 2,
                ease: 'power2',
                // Que frame x frame la camara siempre mire al punto central de la cara
                onUpdate: () => {
                  if (!this.timeline.reversed()) {
                    this.camera.quaternion.slerp(
                      new THREE.Quaternion(0, 0, 0, 1),
                      0.05
                    );
                  }
                  if (this.timeline.reversed()) {
                    this.camera.quaternion.slerp(initialQ, 0.05);
                  }
                },
                // Finalizada la animacion de acercamiento...
                onComplete: () => {
                  // Setear orbit controls adecuados y activarlos nuevamente
                  this.orbitControls.enabled = true;
                  this.orbitControls.target = new THREE.Vector3(-0.5, 1.5, 0);
                  this.orbitControls.maxPolarAngle = Math.PI / 2;
                  this.orbitControls.minPolarAngle = -Math.PI / 4;
                  this.orbitControls.update();

                  // Callback de preparacion para revertir las animaciones y retornar al estado original
                  this.listenerToReverseAnimation = () => {
                    this.orbitControls.enabled = false;
                    this.orbitControls.target = new THREE.Vector3();
                    this.orbitControls.maxPolarAngle = Math.PI;
                    this.orbitControls.minPolarAngle = 0;
                    this.orbitControls.update();

                    // Volver a la posicion inicial de la camara antes de iniciar el reverse de las animaciones
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
                        // Removemos el event listener
                        window.removeEventListener(
                          'dblclick',
                          this.listenerToReverseAnimation,
                          false
                        );
                        // Revertimos el this.timeline
                        this.timeline.reverse();
                      },
                    });
                  };
                  // Seteamos el event listener para dispara la callback de retorno a la posicion inicial
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
          this.timeline
            .to(
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
              },
              'same'
            )
            .to(
              this.cubeDoor.rotation,
              {
                x: 0,
                y: -Math.PI * 0.1,
                z: 0,
                duration: 2,
                ease: 'elastic.out(1, 0.75)',
                onComplete: () => {
                  this.orbitControls.target = new THREE.Vector3(0, 0, 0);
                  this.orbitControls.maxAzimuthAngle = Math.PI / 12;
                  this.orbitControls.minAzimuthAngle = -Math.PI / 12;
                  this.orbitControls.maxPolarAngle = Math.PI * 0.65;
                  this.orbitControls.minPolarAngle = Math.PI * 0.55;
                  this.orbitControls.update();
                  this.orbitControls.enabled = true;
                  this.listenerToReverseAnimation = () => {
                    this.raycaster.setFromCamera(this.pointer, this.camera);
                    if (
                      this.raycaster.intersectObjects(this.scene.children)[0]
                        .object.name === 'Door_Door_1'
                    ) {
                      this.goIntoGallery();
                      return;
                    } else {
                      this.orbitControls.maxPolarAngle = Math.PI;
                      this.orbitControls.minPolarAngle = 0;
                      this.orbitControls.maxAzimuthAngle = Infinity;
                      this.orbitControls.minAzimuthAngle = Infinity;
                      this.orbitControls.update();
                      this.orbitControls.enabled = false;
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
                          this.timeline.reverse();
                        },
                      });
                    }
                  };
                  window.addEventListener(
                    'dblclick',
                    this.listenerToReverseAnimation,
                    false
                  );
                },
                onReverseComplete: () => {
                  this.whitePlane.visible = false;
                  this.orbitControls.enabled = true;
                  this.onAnimationState = false;
                },
              },
              'door'
            )
            .to(
              {},
              {
                onStart: () => {
                  this.whitePlane.visible = true;
                },
              },
              'door'
            );
          break;
        case 'NatureFace':
          this.timeline
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
                  if (!this.timeline.reversed()) {
                    this.camera.quaternion.slerp(
                      new THREE.Quaternion(0, 0, 0, 1),
                      0.05
                    );
                  }
                  if (this.timeline.reversed()) {
                    this.camera.quaternion.slerp(initialQ, 0.05);
                  }
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
                        this.timeline.reverse();
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
                  this.orbitControls.enabled = true;
                },
              },
              'same'
            );
          break;
        case 'SnakeFace':
          this.timeline.to(
            this.camera.position,
            {
              x: 0,
              y: -1,
              z: -2.65,
              duration: 2,
              ease: 'power2',
              onUpdate: () => {
                this.camera.lookAt(0, 0, 0);
              },
              onComplete: () => {
                this.callSnakeGameRunner();
                this.orbitControls.target = new THREE.Vector3(0, 0, 0);
                this.orbitControls.maxAzimuthAngle = Math.PI;
                this.orbitControls.minAzimuthAngle = Math.PI;
                this.orbitControls.maxPolarAngle = Math.PI * 0.65;
                this.orbitControls.minPolarAngle = Math.PI * 0.55;
                this.orbitControls.update();
                this.orbitControls.enabled = true;
                this.listenerToReverseAnimation = () => {
                  this.experience.world.cubeWorld.snakeGame.startGame = false;
                  this.orbitControls.maxPolarAngle = Math.PI;
                  this.orbitControls.minPolarAngle = 0;
                  this.orbitControls.maxAzimuthAngle = Infinity;
                  this.orbitControls.minAzimuthAngle = Infinity;
                  this.orbitControls.update();
                  this.orbitControls.enabled = false;
                  gsap.to(this.camera.position, {
                    x: 0,
                    y: -1,
                    z: -2.65,
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
                      this.timeline.reverse();
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
        case 'SkateFace':
          this.timeline
            // Movimiento del Mesh
            .to(
              this.scene.children[0].rotation,
              {
                x: 0,
                y: 0,
                z: -Math.PI,
                duration: 2,
              },
              'same'
            )
            // Movimiento de camara
            .to(
              this.camera.position,
              {
                x: 0,
                y: 2.5,
                z: 2,
                duration: 2,
                ease: 'power2',
                // Que frame x frame la camara siempre mire al punto central de la cara
                onUpdate: () => {
                  if (!this.timeline.reversed()) {
                    this.camera.quaternion.slerp(
                      new THREE.Quaternion(
                        -0.316227766016838,
                        0,
                        0,
                        0.9486832980505138
                      ),
                      0.05
                    );
                  }
                  if (this.timeline.reversed()) {
                    this.camera.quaternion.slerp(initialQ, 0.05);
                  }
                },
                // Finalizada la animacion de acercamiento...
                onComplete: () => {
                  // Setear orbit controls adecuados y activarlos nuevamente
                  this.orbitControls.enabled = true;
                  this.orbitControls.target = new THREE.Vector3(0, 1, 0);
                  this.orbitControls.maxPolarAngle = Math.PI * 0.3;
                  this.orbitControls.minPolarAngle = 0;
                  this.orbitControls.maxAzimuthAngle = Infinity;
                  this.orbitControls.minAzimuthAngle = Infinity;
                  this.orbitControls.update();
                  // Callback de preparacion para revertir las animaciones y retornar al estado original
                  this.listenerToReverseAnimation = () => {
                    this.orbitControls.enabled = false;
                    this.orbitControls.target = new THREE.Vector3();
                    this.orbitControls.maxPolarAngle = Math.PI;
                    this.orbitControls.minPolarAngle = 0;
                    this.orbitControls.update();

                    // Volver a la posicion inicial de la camara antes de iniciar el reverse de las animaciones
                    gsap.to(this.camera.position, {
                      x: 0,
                      y: 2.5,
                      z: 2,
                      duration: 2,
                      ease: 'power2',
                      onUpdate: () => {
                        this.camera.lookAt(0, 1, 0);
                      },
                      onComplete: () => {
                        // Removemos el event listener
                        window.removeEventListener(
                          'dblclick',
                          this.listenerToReverseAnimation,
                          false
                        );
                        // Revertimos el this.timeline
                        this.timeline.reverse();
                      },
                    });
                  };
                  // Seteamos el event listener para dispara la callback de retorno a la posicion inicial
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
        case 'SetUpFace':
          this.timeline.to(
            this.camera.position,
            {
              x: 0,
              y: 2,
              z: 2.3,
              duration: 2,
              ease: 'power2',
              onUpdate: () => {
                if (!this.timeline.reversed()) {
                  this.camera.quaternion.slerp(
                    new THREE.Quaternion(
                      -0.20362949657007579,
                      0,
                      0,
                      0.9790480213588185
                    ),
                    this.timeline.progress() * 0.1
                  );
                }
                if (this.timeline.reversed()) {
                  this.camera.quaternion.slerp(initialQ, 0.05);
                }
              },
              onComplete: () => {
                this.orbitControls.target = new THREE.Vector3(0, 1, 0);
                this.orbitControls.maxPolarAngle = Math.PI * 0.45;
                this.orbitControls.minPolarAngle = 0;
                this.orbitControls.maxAzimuthAngle = Infinity;
                this.orbitControls.minAzimuthAngle = Infinity;
                this.orbitControls.update();
                this.orbitControls.enabled = true;
                console.log(this.camera.quaternion);
                this.listenerToReverseAnimation = () => {
                  this.orbitControls.target = new THREE.Vector3(0, 0, 0);
                  this.orbitControls.maxPolarAngle = Math.PI;
                  this.orbitControls.minPolarAngle = 0;
                  this.orbitControls.maxAzimuthAngle = Infinity;
                  this.orbitControls.minAzimuthAngle = Infinity;
                  this.orbitControls.update();
                  this.orbitControls.enabled = false;
                  gsap.to(this.camera.position, {
                    x: 0,
                    y: 2,
                    z: 2.3,
                    ease: 'power2',
                    onUpdate: () => {
                      this.camera.lookAt(0, 1, 0);
                    },
                    onComplete: () => {
                      window.removeEventListener(
                        'dblclick',
                        this.listenerToReverseAnimation,
                        false
                      );
                      this.timeline.reverse();
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
        default:
          break;
      }
      this.intersectionEvent = null;
      this.cubeClicked = false;
    }
  }

  goIntoGallery() {
    this.timeline = gsap.timeline();
    this.timeline
      .to(
        this.cubeDoor.rotation,
        {
          x: 0,
          y: -Math.PI * 0.85,
          z: 0,
        },
        'open'
      )
      .to(
        this.camera.position,
        {
          x: 0,
          y: 0,
          z: 2.65,
          duration: 2,
          onUpdate: () => {
            this.camera.lookAt(0, 0, 0);
          },
        },
        'open'
      )
      .to(
        this.whitePlane.scale,
        {
          x: 5,
          y: 5,
          z: 5,
        },
        'in'
      )
      .to(
        this.whitePlane.position,
        {
          x: this.whitePlane.position.x,
          y: this.whitePlane.position.y,
          z: 1.8,
          onUpdate: () => {
            this.whitePlane.material.color.lerp(
              new THREE.Color('rgb(210, 210, 210)'),
              this.timeline.progress()
            );
          },
        },
        'in'
      )
      .to(
        this.camera.position,
        {
          x: 0,
          y: 0,
          z: 2,
          duration: 2,
          onUpdate: () => {
            this.camera.lookAt(0, -2.5, 0);
          },
          onComplete: () => {
            this.experience.finishExperience();
          },
        },
        'in'
      );
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
    if (!this.onAnimationState) {
      this.onIntersects();
    }
    if (this.linearRotationSetted) {
      this.runLinearRotation();
    }
  }

  ngOnDestroy(): void {
    window.removeEventListener('click', this.onClickCallback);
  }
}
