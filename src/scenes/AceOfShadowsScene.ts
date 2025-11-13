import { Graphics, Text, TextStyle } from "pixi.js";
import { Scene } from "./Scene";
import { SceneManager } from "./SceneManager";
import { MainMenuScene } from "./MainMenuScene";

export class AceOfShadowsScene extends Scene {
  private sceneManager: SceneManager;
  private shadowParticles: Graphics[] = [];

  constructor(sceneManager: SceneManager) {
    super();
    this.sceneManager = sceneManager;
  }

  onEnter(): void {
    this.createBackground();
    this.createTitle();
    this.createBackButton();
    this.createShadowEffects();
  }

  onExit(): void {
    this.removeChildren();
    this.shadowParticles = [];
  }

  update(delta: number): void {
    // Animate shadow particles
    this.shadowParticles.forEach((particle) => {
      particle.y += 2 * delta;
      particle.alpha -= 0.01 * delta;

      if (particle.alpha <= 0) {
        particle.y = 0;
        particle.alpha = 0.5;
      }
    });
  }

  private createBackground(): void {
    const bg = new Graphics();
    bg.beginFill(0x0a0a0a);
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
      fill: ["#8b0000", "#000000"],
      stroke: "#ffffff",
      strokeThickness: 3,
      dropShadow: true,
      dropShadowColor: "#000000",
      dropShadowBlur: 4,
      dropShadowAngle: Math.PI / 6,
      dropShadowDistance: 6,
    });

    const title = new Text("ACE OF SHADOWS", titleStyle);
    title.anchor.set(0.5);
    title.x = this.sceneManager.getAppWidth() / 2;
    title.y = 100;

    this.addChild(title);
  }

  private createBackButton(): void {
    const button = new Graphics();
    const width = 200;
    const height = 60;

    button.beginFill(0x8b0000);
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

  private createShadowEffects(): void {
    for (let i = 0; i < 20; i++) {
      const particle = new Graphics();
      particle.beginFill(0x333333);
      particle.drawCircle(0, 0, Math.random() * 10 + 5);
      particle.endFill();
      particle.x = Math.random() * this.sceneManager.getAppWidth();
      particle.y = Math.random() * this.sceneManager.getAppHeight();
      particle.alpha = Math.random() * 0.5;

      this.shadowParticles.push(particle);
      this.addChild(particle);
    }
  }
}
