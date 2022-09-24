export default class Config {
  public dom_canvas: HTMLCanvasElement;
  public CTX: CanvasRenderingContext2D | null;
  public W: number;
  public H: number;
  public cells: number;
  public cellSize: number;
  public cellsCount: number;
  public isGameOver: boolean;

  constructor() {
    this.dom_canvas = document.createElement('canvas');

    //CanvasRenderingContext
    this.CTX = this.dom_canvas.getContext('2d');
    if (this.CTX) {
      this.CTX.imageSmoothingEnabled = false;
    }

    // Valores default de canvas (300x150) a (400x400)
    this.W = this.dom_canvas.width = 400;
    this.H = this.dom_canvas.height = 400;

    this.cells = 20;
    this.cellSize = this.W / this.cells;
    this.cellsCount = this.cells * this.cells;

    // State Vars
    this.isGameOver = false;
  }
}
