import { Graphics } from "pixi.js";
import { Scene } from "./Scene";
import { SceneManager } from "./SceneManager";
import { MainMenuScene } from "./MainMenuScene";
import { Colors } from "../styles/Colors";
import { SceneUI } from "../ui/SceneUI";
import gsap from "gsap";

export class PhenixFlamesScene extends Scene {
  private flames: Graphics[] = [];

  constructor(private sceneManager: SceneManager) {
    super();
  }

  onEnter(): void {
    const ui = new SceneUI(this, this.sceneManager);
    ui.addBackground(Colors.BG_FLAMES);
    ui.addTitle("PHENIX FLAMES", 100);
    ui.addBackButton(Colors.BTN_FLAMES, () =>
      this.sceneManager.changeScene(new MainMenuScene(this.sceneManager))
    );
    this.createFlameParticles();
  }

  onExit(): void {
    this.flames.forEach((flame) => gsap.killTweensOf(flame));
    this.flames = [];
    this.removeChildren();
  }

  update(delta: number): void {
    // GSAP handles animation, no manual update needed
  }

  private createFlameParticles(): void {
    for (let i = 0; i < 15; i++) {
      const color = i % 2 === 0 ? Colors.FLAME_ORANGE : Colors.FLAME_YELLOW;
      const flame = new Graphics();
      const radius = Math.random() * 8 + 7;
      flame.beginFill(color);
      flame.drawCircle(0, 0, radius);
      flame.endFill();
      flame.x = Math.random() * this.sceneManager.getAppWidth();
      flame.y = this.sceneManager.getAppHeight();
      flame.alpha = 1;
      this.addChild(flame);
      this.flames.push(flame);

      // Animate flame upward with GSAP
      gsap.to(flame, {
        y: -50,
        alpha: 0,
        scale: Math.random() * 0.5 + 1.2,
        duration: 2 + Math.random() * 2,
        ease: "power1.out",
        repeat: -1,
        repeatDelay: 0,
        onRepeat: () => {
          flame.y = this.sceneManager.getAppHeight();
          flame.alpha = 1;
          flame.scale.set(1);
          flame.x = Math.random() * this.sceneManager.getAppWidth();
        },
      });
    }
  }
}
