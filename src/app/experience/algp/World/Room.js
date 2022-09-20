import * as THREE from "three";
import Experience from "../Experience";

export default class Romm {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
  }
}
