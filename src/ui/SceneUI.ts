import { Graphics } from "pixi.js";
import { SceneManager } from "../scenes/SceneManager";
import { UIConfig } from "../styles/UIConfig";
import { Button } from "./Button";
import { Label } from "./Label";

export class SceneUI {
  private scene: any;
  private sceneManager: SceneManager;

  constructor(scene: any, sceneManager: SceneManager) {
    this.scene = scene;
    this.sceneManager = sceneManager;
  }

  addBackground(color: number) {
    const bg = new Graphics();
    bg.beginFill(color);
    bg.drawRect(
      0,
      0,
      this.sceneManager.getAppWidth(),
      this.sceneManager.getAppHeight()
    );
    bg.endFill();
    this.scene.addChild(bg);
  }

  addTitle(text: string, y?: number) {
    const title = new Label(text, "title", {
      x: this.sceneManager.getAppWidth() / 2,
      y: y !== undefined ? y : UIConfig.POSITION.TITLE_Y,
      anchor: { x: 0.5, y: 0.5 },
    });
    this.scene.addChild(title);
  }

  addBackButton(color: number, onClick: () => void) {
    const button = new Button("Back to Menu", color, {
      small: true,
      onClick,
    });
    button.x = UIConfig.POSITION.BACK_BUTTON_X;
    button.y =
      this.sceneManager.getAppHeight() - UIConfig.POSITION.BACK_BUTTON_OFFSET_Y;
    this.scene.addChild(button);
  }
}
