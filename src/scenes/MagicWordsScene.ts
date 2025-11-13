import { Graphics, Text } from "pixi.js";
import { Scene } from "./Scene";
import { SceneManager } from "./SceneManager";
import { MainMenuScene } from "./MainMenuScene";
import { TextStyles } from "../styles/TextStyles";
import { Colors } from "../styles/Colors";
import { SceneUI } from "../ui/SceneUI";
import gsap from "gsap";

export class MagicWordsScene extends Scene {
  private floatingWords: Text[] = [];

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
    this.floatingWords.forEach((word) => gsap.killTweensOf(word));
    this.floatingWords = [];
    this.removeChildren();
  }

  update(delta: number): void {
    // GSAP handles animation, no manual update needed
  }

  private createFloatingWords(): void {
    const words = ["ABRA", "CADABRA", "ALAKAZAM", "HOCUS", "POCUS", "PRESTO"];

    words.forEach((word, index) => {
      const text = new Text(word, TextStyles.MAGIC_WORD);
      text.anchor.set(0.5);
      const baseX = 150 + (index % 3) * 400;
      const baseY = 300 + Math.floor(index / 3) * 150;
      text.x = baseX;
      text.y = baseY;
      text.alpha = 0.7;

      this.floatingWords.push(text);
      this.addChild(text);

      // Animate floating with GSAP
      gsap.to(text, {
        y: baseY - 20,
        duration: 2 + index * 0.3,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      gsap.to(text, {
        rotation: 0.1,
        duration: 1.5 + index * 0.2,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    });
  }
}
