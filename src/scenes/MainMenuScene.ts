import gsap from "gsap";
import { Graphics } from "pixi.js";
import { UIConfig } from "../styles/UIConfig";
import { Button } from "../ui/Button";
import { Label } from "../ui/Label";
import { AceOfShadowsScene } from "./AceOfShadowsScene";
import { MagicWordsScene } from "./MagicWordsScene";
import { PheonixFlamesScene } from "./PheonixFlamesScene";
import { Scene } from "./Scene";
import { SceneManager } from "./SceneManager";

export class MainMenuScene extends Scene {
  constructor(private sceneManager: SceneManager) {
    super();
  }

  onEnter(): void {
    this.createParchmentBackground();
    this.createTitle();
    this.createMenuButtons();
  }

  onExit(): void {
    this.removeChildren();
  }

  update(delta: number): void {
    // No manual update needed
  }

  private createParchmentBackground(): void {
    // Draw parchment background
    const bg = new Graphics();
    bg.beginFill(0xf5e2c4); // parchment color
    bg.drawRect(
      0,
      0,
      this.sceneManager.getAppWidth(),
      this.sceneManager.getAppHeight()
    );
    bg.endFill();
    // Draw thick dark border
    bg.lineStyle(10, 0x4a3a22, 1);
    bg.drawRect(
      20,
      20,
      this.sceneManager.getAppWidth() - 40,
      this.sceneManager.getAppHeight() - 40
    );
    this.addChild(bg);
  }

  private createTitle(): void {
    const title = new Label("MAIN MENU", "title", {
      x: this.sceneManager.getAppWidth() / 2,
      y: UIConfig.POSITION.TITLE_Y,
      anchor: { x: 0.5, y: 0.5 },
      style: {
        fontFamily: "'Orbitron', Arial, sans-serif",
        fontSize: 80,
        fontWeight: "800",
        fill: 0x4a3a22,
        align: "center",
        letterSpacing: 6,
        dropShadow: false,
      },
    });
    this.addChild(title);
  }

  private createMenuButtons(): void {
    const games = [
      {
        name: "ACE OF SHADOWS",
        scene: AceOfShadowsScene,
      },
      { name: "MAGIC WORDS", scene: MagicWordsScene },
      {
        name: "PHOENIX FLAMES",
        scene: PheonixFlamesScene,
      },
    ];

    const centerX = this.sceneManager.getAppWidth() / 2;
    const startY = UIConfig.POSITION.MENU_START_Y;
    const spacing = UIConfig.SPACING.BUTTON;

    games.forEach((game, index) => {
      const button = new Button(game.name, 0x4a3a22, {
        width: 600,
        height: 110,
        onClick: () => {
          this.sceneManager.changeScene(new game.scene(this.sceneManager));
        },
        style: {
          fontFamily: "'Orbitron', Arial, sans-serif",
          fontSize: 35,
          fontWeight: "600",
          fill: 0xf5e2c4,
          align: "center",
          letterSpacing: 2,
        },
      });
      button.x = centerX;
      button.y = startY + index * spacing;
      this.addChild(button);
    });
  }
}
