import { Graphics } from "pixi.js";
import { Scene } from "./Scene";
import { SceneManager } from "./SceneManager";
import { MainMenuScene } from "./MainMenuScene";
import { Colors } from "../styles/Colors";
import { UIConfig } from "../styles/UIConfig";
import { UIHelpers } from "../utils/UIHelpers";

export class AceOfShadowsScene extends Scene {
  private shadowParticles: Graphics[] = [];

  constructor(private sceneManager: SceneManager) {
    super();
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
    const bg = UIHelpers.createBackground(
      this.sceneManager.getAppWidth(),
      this.sceneManager.getAppHeight(),
      Colors.BG_SHADOWS
    );
    this.addChild(bg);
  }

  private createTitle(): void {
    const title = UIHelpers.createTitle(
      "ACE OF SHADOWS",
      this.sceneManager.getAppWidth() / 2,
      100
    );
    this.addChild(title);
  }

  private createBackButton(): void {
    const button = UIHelpers.createBackButton(
      () => this.sceneManager.changeScene(new MainMenuScene(this.sceneManager)),
      Colors.BTN_SHADOWS
    );
    button.x = UIConfig.POSITION.BACK_BUTTON_X;
    button.y =
      this.sceneManager.getAppHeight() - UIConfig.POSITION.BACK_BUTTON_OFFSET_Y;
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
