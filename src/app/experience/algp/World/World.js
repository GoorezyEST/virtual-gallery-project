import Experience from "../Experience";

export default class World {
  constructor() {
    this.experience = new Experience();
    this.sizes = this.experience.Sizes;
    this.scene = this.experience.scene;
    this.canvas = this.experience.canvas;
    this.camera = this.experience.camera;
  }

  resize() {}

  update() {}
}
