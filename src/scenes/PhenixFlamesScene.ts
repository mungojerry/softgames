import { Graphics, Text, TextStyle } from "pixi.js";
import { Scene } from "./Scene";
import { SceneManager } from "./SceneManager";
import { MainMenuScene } from "./MainMenuScene";

export class PhenixFlamesScene extends Scene {
  private sceneManager: SceneManager;
  private flames: Graphics[] = [];

  constructor(sceneManager: SceneManager) {
    super();
    this.sceneManager = sceneManager;
  }

  onEnter(): void {
    this.createBackground();
    this.createTitle();
    this.createBackButton();
    this.createFlameEffects();
  }

  onExit(): void {
    this.removeChildren();
    this.flames = [];
  }

  update(delta: number): void {
    // Animate flames
    this.flames.forEach((flame) => {
      flame.y -= 3 * delta;
      flame.alpha -= 0.02 * delta;
      flame.scale.x += 0.01 * delta;

      if (flame.alpha <= 0) {
        flame.y = this.sceneManager.getAppHeight();
        flame.alpha = 1;
        flame.scale.x = 1;
      }
    });
  }

  private createBackground(): void {
    const bg = new Graphics();
    bg.beginFill(0x1a0000);
    bg.drawRect(
      0,
      0,
      this.sceneManager.getAppWidth(),
      this.sceneManager.getAppHeight()
    );
    bg.endFill();
    this.addChild(bg);
  }

  private createTitle(): void {
    const titleStyle = new TextStyle({
      fontFamily: "Arial",
      fontSize: 72,
      fontWeight: "bold",
      fill: ["#ff4500", "#ffa500", "#ff0000"],
      stroke: "#8b0000",
      strokeThickness: 4,
      dropShadow: true,
      dropShadowColor: "#ff4500",
      dropShadowBlur: 15,
      dropShadowAngle: Math.PI / 6,
      dropShadowDistance: 8,
    });

    const title = new Text("PHENIX FLAMES", titleStyle);
    title.anchor.set(0.5);
    title.x = this.sceneManager.getAppWidth() / 2;
    title.y = 100;

    this.addChild(title);
  }

  private createBackButton(): void {
    const button = new Graphics();
    const width = 200;
    const height = 60;

    button.beginFill(0xff4500);
    button.lineStyle(2, 0xffffff);
    button.drawRect(0, 0, width, height);
    button.endFill();

    const textStyle = new TextStyle({
      fontFamily: "Arial",
      fontSize: 24,
      fill: 0xffffff,
    });

    const buttonText = new Text("Back to Menu", textStyle);
    buttonText.anchor.set(0.5);
    buttonText.x = width / 2;
    buttonText.y = height / 2;
    button.addChild(buttonText);

    button.x = 50;
    button.y = this.sceneManager.getAppHeight() - 80;
    button.eventMode = "static";
    button.cursor = "pointer";

    button.on("pointerdown", () => {
      this.sceneManager.changeScene(new MainMenuScene(this.sceneManager));
    });

    this.addChild(button);
  }

  private createFlameEffects(): void {
    for (let i = 0; i < 15; i++) {
      const flame = new Graphics();
      const size = Math.random() * 15 + 10;

      flame.beginFill(i % 2 === 0 ? 0xff4500 : 0xffa500);
      flame.moveTo(0, size);
      flame.bezierCurveTo(-size / 2, size / 2, -size / 2, -size / 2, 0, -size);
      flame.bezierCurveTo(size / 2, -size / 2, size / 2, size / 2, 0, size);
      flame.endFill();

      flame.x = Math.random() * this.sceneManager.getAppWidth();
      flame.y = Math.random() * this.sceneManager.getAppHeight();
      flame.alpha = Math.random() * 0.8 + 0.2;

      this.flames.push(flame);
      this.addChild(flame);
    }
  }
}
