import { Graphics, Text } from "pixi.js";
import { Scene } from "./Scene";
import { SceneManager } from "./SceneManager";
import { MainMenuScene } from "./MainMenuScene";
import { TextStyles } from "../styles/TextStyles";
import { Colors } from "../styles/Colors";
import { SceneUI } from "../ui/SceneUI";

export class MagicWordsScene extends Scene {
  private floatingWords: Text[] = [];
  private time: number = 0;

  constructor(private sceneManager: SceneManager) {
    super();
  }

  onEnter(): void {
    const ui = new SceneUI(this, this.sceneManager);
    ui.addBackground(Colors.BG_MAGIC);
    ui.addTitle("MAGIC WORDS", 100);
    ui.addBackButton(Colors.BTN_MAGIC, () =>
      this.sceneManager.changeScene(new MainMenuScene(this.sceneManager))
    );
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
