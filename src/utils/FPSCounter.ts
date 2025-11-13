import { Container, Graphics, Text, TextStyle } from "pixi.js";

export class FPSCounter extends Container {
  private fpsText: Text;
  private frameCount: number = 0;
  private lastTime: number = performance.now();
  private fps: number = 0;
  private background: Graphics;

  constructor() {
    super();

    // Create background
    this.background = new Graphics();
    this.background.beginFill(0x000000, 0.6);
    this.background.drawRoundedRect(0, 0, 100, 40, 5);
    this.background.endFill();
    this.addChild(this.background);

    // Create FPS text
    const textStyle = new TextStyle({
      fontFamily: "Arial, sans-serif",
      fontSize: 18,
      fontWeight: "bold",
      fill: "#00ff00",
    });

    this.fpsText = new Text("FPS: 60", textStyle);
    this.fpsText.x = 10;
    this.fpsText.y = 10;
    this.addChild(this.fpsText);

    // Position in top-left
    this.x = 10;
    this.y = 10;
  }

  update(): void {
    this.frameCount++;
    const currentTime = performance.now();
    const elapsed = currentTime - this.lastTime;

    // Update FPS every 500ms
    if (elapsed >= 500) {
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
