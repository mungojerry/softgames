import { Graphics, Text } from "pixi.js";
import { Scene } from "./Scene";
import { SceneManager } from "./SceneManager";
import { MainMenuScene } from "./MainMenuScene";
import { TextStyles } from "../styles/TextStyles";
import { Colors } from "../styles/Colors";
import { UIConfig } from "../styles/UIConfig";

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
    bg.beginFill(Colors.BG_MAGIC);
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
    const title = new Text("MAGIC WORDS", TextStyles.SCENE_TITLE_MAGIC);
    title.anchor.set(0.5);
    title.x = this.sceneManager.getAppWidth() / 2;
    title.y = 100;

    this.addChild(title);
  }

  private createBackButton(): void {
    const button = new Graphics();
    const width = UIConfig.BUTTON_SMALL.WIDTH;
    const height = UIConfig.BUTTON_SMALL.HEIGHT;

    button.beginFill(Colors.BTN_MAGIC);
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

  private createFloatingWords(): void {
    const words = ["ABRA", "CADABRA", "ALAKAZAM", "HOCUS", "POCUS", "PRESTO"];

    words.forEach((word, index) => {
      const text = new Text(word, TextStyles.MAGIC_WORD);
      text.anchor.set(0.5);
      text.x = 150 + (index % 3) * 400;
      text.y = 300 + Math.floor(index / 3) * 150;
      text.alpha = 0.7;

      this.floatingWords.push(text);
      this.addChild(text);
    });
  }
}
