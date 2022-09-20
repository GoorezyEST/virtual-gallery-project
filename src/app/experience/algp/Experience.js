import * as THREE from "three";

// Utility modules --------------------------
import Sizes from "./Utils/Sizes";
import Time from "./Utils/Time";

// Main Modules
import Renderer from "./Renderer";
import Camera from "./Camera";

// 3D Space Management
import World from "./World/World";

export default class Experience {
  constructor(canvas) {
    if (Experience.instance) {
      return Experience.instance;
    }
    Experience.instance = this;
    // Utils Instances
    this.sizes = new Sizes();
    this.time = new Time();

    // Main Instances
    this.canvas = canvas;
    this.scene = new THREE.Scene();
    this.camera = new Camera();
    this.renderer = new Renderer();

    // 3D Space
    this.world = new World();

    this.sizes.on("resize", () => {
      this.resize();
    });
    this.time.on("update", () => {
      this.update();
    });
  }

  resize() {
    this.camera.resize();
    this.renderer.resize();
    this.world.resize();
  }

  update() {
    this.camera.update();
    this.renderer.update();
    this.world.update();
  }
}
