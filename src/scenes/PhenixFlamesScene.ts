import { Graphics } from "pixi.js";
import { Scene } from "./Scene";
import { SceneManager } from "./SceneManager";
import { MainMenuScene } from "./MainMenuScene";
import { Colors } from "../styles/Colors";
import { SceneUI } from "../ui/SceneUI";

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
    this.createFlameEffects();
  }

  onExit(): void {
    this.removeChildren();
    this.flames = [];
  }

  update(delta: number): void {
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

  private createFlameEffects(): void {
    for (let i = 0; i < 15; i++) {
      const flame = new Graphics();
      const size = Math.random() * 15 + 10;

      flame.beginFill(i % 2 === 0 ? Colors.FLAME_ORANGE : Colors.FLAME_YELLOW);
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
