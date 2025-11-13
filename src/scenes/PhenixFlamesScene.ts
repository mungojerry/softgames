import { Graphics, Text } from "pixi.js";
import { Scene } from "./Scene";
import { SceneManager } from "./SceneManager";
import { MainMenuScene } from "./MainMenuScene";
import { TextStyles } from "../styles/TextStyles";
import { Colors } from "../styles/Colors";
import { UIConfig } from "../styles/UIConfig";

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
    const title = new Text("PHENIX FLAMES", TextStyles.SCENE_TITLE_FLAMES);
    title.anchor.set(0.5);
    title.x = this.sceneManager.getAppWidth() / 2;
    title.y = 100;

    this.addChild(title);
  }

  private createBackButton(): void {
    const button = new Graphics();
    const width = UIConfig.BUTTON_SMALL.WIDTH;
    const height = UIConfig.BUTTON_SMALL.HEIGHT;

    button.beginFill(Colors.BTN_FLAMES);
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
