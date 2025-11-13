import { Graphics, Text } from "pixi.js";
import { Scene } from "./Scene";
import { SceneManager } from "./SceneManager";
import { MainMenuScene } from "./MainMenuScene";
import { TextStyles } from "../styles/TextStyles";
import { Colors } from "../styles/Colors";
import { UIConfig } from "../styles/UIConfig";

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
    bg.beginFill(Colors.BG_SHADOWS);
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
    const title = new Text("ACE OF SHADOWS", TextStyles.SCENE_TITLE_SHADOWS);
    title.anchor.set(0.5);
    title.x = this.sceneManager.getAppWidth() / 2;
    title.y = 100;

    this.addChild(title);
  }

  private createBackButton(): void {
    const button = new Graphics();
    const width = UIConfig.BUTTON_SMALL.WIDTH;
    const height = UIConfig.BUTTON_SMALL.HEIGHT;

    button.beginFill(Colors.BTN_SHADOWS);
    button.lineStyle(UIConfig.BUTTON_SMALL.BORDER, Colors.WHITE);
    button.drawRect(0, 0, width, height);
    button.endFill();

    const buttonText = new Text("Back to Menu", TextStyles.BUTTON_SMALL);
    buttonText.anchor.set(0.5);
    buttonText.x = width / 2;
    buttonText.y = height / 2;
    button.addChild(buttonText);

    button.x = UIConfig.POSITION.BACK_BUTTON_X;
    button.y =
      this.sceneManager.getAppHeight() - UIConfig.POSITION.BACK_BUTTON_OFFSET_Y;
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
      particle.beginFill(Colors.SHADOW_PARTICLE);
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
