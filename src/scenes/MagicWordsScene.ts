import { Graphics, Text, TextStyle } from "pixi.js";
import { Scene } from "./Scene";
import { SceneManager } from "./SceneManager";
import { MainMenuScene } from "./MainMenuScene";

export class MagicWordsScene extends Scene {
  private sceneManager: SceneManager;
  private floatingWords: Text[] = [];
  private time: number = 0;

  constructor(sceneManager: SceneManager) {
    super();
    this.sceneManager = sceneManager;
  }

  onEnter(): void {
    this.createBackground();
    this.createTitle();
    this.createBackButton();
    this.createFloatingWords();
  }

  onExit(): void {
    this.removeChildren();
    this.floatingWords = [];
  }

  update(delta: number): void {
    this.time += delta * 0.05;

    // Animate floating words
    this.floatingWords.forEach((word, index) => {
      word.y += Math.sin(this.time + index) * 0.5;
      word.rotation = Math.sin(this.time + index * 0.5) * 0.1;
    });
  }

  private createBackground(): void {
    const bg = new Graphics();
    bg.beginFill(0x1a0033);
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
      fill: ["#9370db", "#4b0082"],
      stroke: "#ffffff",
      strokeThickness: 3,
      dropShadow: true,
      dropShadowColor: "#9370db",
      dropShadowBlur: 10,
      dropShadowAngle: Math.PI / 6,
      dropShadowDistance: 6,
    });

    const title = new Text("MAGIC WORDS", titleStyle);
    title.anchor.set(0.5);
    title.x = this.sceneManager.getAppWidth() / 2;
    title.y = 100;

    this.addChild(title);
  }

  private createBackButton(): void {
    const button = new Graphics();
    const width = 200;
    const height = 60;

    button.beginFill(0x4b0082);
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

  private createFloatingWords(): void {
    const words = ["ABRA", "CADABRA", "ALAKAZAM", "HOCUS", "POCUS", "PRESTO"];
    const wordStyle = new TextStyle({
      fontFamily: "Arial",
      fontSize: 36,
      fill: 0x9370db,
      fontStyle: "italic",
    });

    words.forEach((word, index) => {
      const text = new Text(word, wordStyle);
      text.anchor.set(0.5);
      text.x = 150 + (index % 3) * 400;
      text.y = 300 + Math.floor(index / 3) * 150;
      text.alpha = 0.7;

      this.floatingWords.push(text);
      this.addChild(text);
    });
  }
}
