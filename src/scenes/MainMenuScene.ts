import { Graphics, Text, TextStyle } from "pixi.js";
import { Scene } from "./Scene";
import { SceneManager } from "./SceneManager";
import { AceOfShadowsScene } from "./AceOfShadowsScene";
import { MagicWordsScene } from "./MagicWordsScene";
import { PhenixFlamesScene } from "./PhenixFlamesScene";

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
    const titleStyle = new TextStyle({
      fontFamily: "Arial",
      fontSize: 64,
      fontWeight: "bold",
      fill: 0xffffff,
      align: "center",
    });

    const title = new Text("MAIN MENU", titleStyle);
    title.anchor.set(0.5);
    title.x = this.sceneManager.getAppWidth() / 2;
    title.y = 150;

    this.addChild(title);
  }

  private createMenuButtons(): void {
    const games = [
      { name: "Ace of Shadows", scene: AceOfShadowsScene, color: 0x8b0000 },
      { name: "Magic Words", scene: MagicWordsScene, color: 0x4b0082 },
      { name: "Phenix Flames", scene: PhenixFlamesScene, color: 0xff4500 },
    ];

    const centerX = this.sceneManager.getAppWidth() / 2;
    const startY = 300;
    const spacing = 120;

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
    const width = 400;
    const height = 80;

    // Draw button
    this.drawButton(button, width, height, color, 0xffffff);

    // Button text
    const textStyle = new TextStyle({
      fontFamily: "Arial",
      fontSize: 32,
      fontWeight: "bold",
      fill: 0xffffff,
    });

    const buttonText = new Text(text, textStyle);
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
        this.lightenColor(color),
        0xffff00
      );
    });

    button.on("pointerout", () => {
      button.clear();
      this.drawButton(button, width, height, color, 0xffffff);
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
    graphics.lineStyle(3, strokeColor);
    graphics.drawRect(-width / 2, -height / 2, width, height);
    graphics.endFill();
  }

  private lightenColor(color: number): number {
    const r = Math.min(255, ((color >> 16) & 0xff) + 50);
    const g = Math.min(255, ((color >> 8) & 0xff) + 50);
    const b = Math.min(255, (color & 0xff) + 50);
    return (r << 16) | (g << 8) | b;
  }
}
