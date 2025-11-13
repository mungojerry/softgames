import { Container, Text, TextStyle } from "pixi.js";

export class FPSCounter extends Container {
  private fpsText: Text;
  private frameCount: number = 0;
  private lastTime: number = performance.now();
  private fps: number = 0;
  private updateInterval: number = 500;

  constructor() {
    super();

    const textStyle = new TextStyle({
      fontFamily: "Courier New, monospace",
      fontSize: 18,
      fontWeight: "bold",
      fill: "#00ff00",
    });

    this.fpsText = new Text("FPS: 60", textStyle);
    this.fpsText.x = 10;
    this.fpsText.y = 10;
    this.addChild(this.fpsText);

    this.x = 10;
    this.y = 10;
  }

  update(): void {
    this.frameCount++;
    const currentTime = performance.now();
    const elapsed = currentTime - this.lastTime;

    if (elapsed >= this.updateInterval) {
      this.fps = Math.round((this.frameCount / elapsed) * 1000);
      this.fpsText.text = `FPS: ${this.fps}`;

      // Color code based on FPS
      if (this.fps >= 55) {
        this.fpsText.style.fill = "#00ff00"; // Green for good FPS
      } else if (this.fps >= 30) {
        this.fpsText.style.fill = "#ffff00"; // Yellow for moderate FPS
      } else {
        this.fpsText.style.fill = "#ff0000"; // Red for poor FPS
      }

      this.frameCount = 0;
      this.lastTime = currentTime;
    }
  }
}
