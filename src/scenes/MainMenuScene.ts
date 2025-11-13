import { Graphics, Text } from "pixi.js";
import { Scene } from "./Scene";
import { SceneManager } from "./SceneManager";
import { AceOfShadowsScene } from "./AceOfShadowsScene";
import { MagicWordsScene } from "./MagicWordsScene";
import { PhenixFlamesScene } from "./PhenixFlamesScene";
import { TextStyles } from "../styles/TextStyles";
import { Colors } from "../styles/Colors";
import { UIConfig } from "../styles/UIConfig";

export class MainMenuScene extends Scene {
  private sceneManager: SceneManager;

  constructor(sceneManager: SceneManager) {
    super();
    this.sceneManager = sceneManager;
  }

  onEnter(): void {
    this.createTitle();
    this.createMenuButtons();
  }

  onExit(): void {
    this.removeChildren();
  }

  update(delta: number): void {
    // Animation logic here if needed
  }

  private createTitle(): void {
    const title = new Text("MAIN MENU", TextStyles.TITLE);
    title.anchor.set(0.5);
    title.x = this.sceneManager.getAppWidth() / 2;
    title.y = UIConfig.POSITION.TITLE_Y;

    this.addChild(title);
  }

  private createMenuButtons(): void {
    const games = [
      {
        name: "Ace of Shadows",
        scene: AceOfShadowsScene,
        color: Colors.BTN_SHADOWS,
      },
      { name: "Magic Words", scene: MagicWordsScene, color: Colors.BTN_MAGIC },
      {
        name: "Phenix Flames",
        scene: PhenixFlamesScene,
        color: Colors.BTN_FLAMES,
      },
    ];

    const centerX = this.sceneManager.getAppWidth() / 2;
    const startY = UIConfig.POSITION.MENU_START_Y;
    const spacing = UIConfig.SPACING.BUTTON;

    games.forEach((game, index) => {
      const button = this.createButton(game.name, game.color);
      button.x = centerX;
      button.y = startY + index * spacing;
      button.on("pointerdown", () => {
        this.sceneManager.changeScene(new game.scene(this.sceneManager));
      });
      this.addChild(button);
    });
  }

  private createButton(text: string, color: number): Graphics {
    const button = new Graphics();
    const width = UIConfig.BUTTON.WIDTH;
    const height = UIConfig.BUTTON.HEIGHT;

    // Draw button
    this.drawButton(button, width, height, color, Colors.WHITE);

    // Button text
    const buttonText = new Text(text, TextStyles.BUTTON);
    buttonText.anchor.set(0.5);
    button.addChild(buttonText);

    // Make interactive
    button.eventMode = "static";
    button.cursor = "pointer";

    // Hover effects
    button.on("pointerover", () => {
      button.clear();
      this.drawButton(
        button,
        width,
        height,
        Colors.lighten(color),
        Colors.YELLOW
      );
    });

    button.on("pointerout", () => {
      button.clear();
      this.drawButton(button, width, height, color, Colors.WHITE);
    });

    return button;
  }

  private drawButton(
    graphics: Graphics,
    width: number,
    height: number,
    fillColor: number,
    strokeColor: number
  ): void {
    graphics.beginFill(fillColor);
    graphics.lineStyle(UIConfig.BUTTON.BORDER, strokeColor);
    graphics.drawRect(-width / 2, -height / 2, width, height);
    graphics.endFill();
  }
}
