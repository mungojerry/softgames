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

  onResize(): void {
    this.removeChildren();
    this.createParchmentBackground();
    this.createTitle();
    this.createMenuButtons();
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
    const isMobile = window.innerWidth < 768;
    const appWidth = this.sceneManager.getAppWidth();
    const title = new Label("MAIN MENU", "title", {
      x: appWidth / 2,
      y: UIConfig.POSITION.TITLE_Y,
      anchor: { x: 0.5, y: 0.5 },
      style: {
        fontFamily: "'Orbitron', Arial, sans-serif",
        fontSize: isMobile ? 48 : 80,
        fontWeight: "800",
        fill: 0x4a3a22,
        align: "center",
        letterSpacing: isMobile ? 3 : 6,
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

    const isMobile = window.innerWidth < 768;
    const appWidth = this.sceneManager.getAppWidth();
    const centerX = appWidth / 2;
    const startY = UIConfig.POSITION.MENU_START_Y;
    const spacing = UIConfig.SPACING.BUTTON;

    games.forEach((game, index) => {
      const buttonWidth = isMobile
        ? Math.min(appWidth - 60, 400)
        : Math.min(600, appWidth - 100);

      const button = new Button(game.name, 0x4a3a22, {
        width: buttonWidth,
        height: isMobile ? 80 : 110,
        onClick: () => {
          this.sceneManager.changeScene(new game.scene(this.sceneManager));
        },
        style: {
          fontFamily: "'Orbitron', Arial, sans-serif",
          fontSize: isMobile ? 22 : 35,
          fontWeight: "600",
          fill: 0xf5e2c4,
          align: "center",
          letterSpacing: isMobile ? 1 : 2,
        },
      });
      button.x = centerX;
      button.y = startY + index * spacing;
      this.addChild(button);
    });
  }
}
