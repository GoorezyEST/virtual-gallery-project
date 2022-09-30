export default class Config {
  dom_canvas: HTMLCanvasElement;
  CTX: CanvasRenderingContext2D | null;
  W: number;
  H: number;
  cells: number;
  cellSize: number;
  cellsCount: number;
  isGameOver: boolean;

  constructor() {
    this.dom_canvas = document.createElement('canvas');

    //CanvasRenderingContext
    this.CTX = this.dom_canvas.getContext('2d');
    if (this.CTX) {
      this.CTX.imageSmoothingEnabled = false;
    }

    // Valores default de canvas (300x150) a (400x400)
    this.W = this.dom_canvas.width = 256;
    this.H = this.dom_canvas.height = 256;

    this.cells = 10;
    this.cellSize = this.W / this.cells;
    this.cellsCount = this.cells * this.cells;

    // State Vars
    this.isGameOver = false;
  }
}
