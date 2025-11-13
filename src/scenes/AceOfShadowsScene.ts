import { Graphics } from "pixi.js";
import { Scene } from "./Scene";
import { SceneManager } from "./SceneManager";
import { MainMenuScene } from "./MainMenuScene";
import { Colors } from "../styles/Colors";
import { SceneUI } from "../ui/SceneUI";

export class AceOfShadowsScene extends Scene {
  private shadowParticles: Graphics[] = [];

  constructor(private sceneManager: SceneManager) {
    super();
  }

  onEnter(): void {
    const ui = new SceneUI(this, this.sceneManager);
    ui.addBackground(Colors.BG_SHADOWS);
    ui.addTitle("ACE OF SHADOWS", 100);
    ui.addBackButton(Colors.BTN_SHADOWS, () =>
      this.sceneManager.changeScene(new MainMenuScene(this.sceneManager))
    );
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
