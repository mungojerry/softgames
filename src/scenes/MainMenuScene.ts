import gsap from "gsap";
import { Graphics } from "pixi.js";
import { UIConfig } from "../styles/UIConfig";
import { Button } from "../ui/Button";
import { Label } from "../ui/Label";
import { AceOfShadowsScene } from "./AceOfShadowsScene";
import { MagicWordsScene } from "./MagicWordsScene";
import { Scene } from "./Scene";
import { SceneManager } from "./SceneManager";
import { SceneConfig } from "./SceneConfig";
import { PhoenixFlamesScene } from "./PhoenixFlamesScene";

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
    const bg = new Graphics();
    bg.beginFill(0xf5e2c4); // parchment color
    bg.drawRect(
      0,
      0,
      this.sceneManager.getAppWidth(),
      this.sceneManager.getAppHeight()
    );
    bg.endFill();
    bg.lineStyle(SceneConfig.MENU_BORDER_WIDTH, 0x4a3a22, 1);
    bg.drawRect(
      SceneConfig.MENU_BORDER_PADDING,
      SceneConfig.MENU_BORDER_PADDING,
      this.sceneManager.getAppWidth() - SceneConfig.MENU_BORDER_INSET,
      this.sceneManager.getAppHeight() - SceneConfig.MENU_BORDER_INSET
    );
    this.addChild(bg);
  }

  private createTitle(): void {
    const isMobile = window.innerWidth < SceneConfig.MOBILE_BREAKPOINT;
    const appWidth = this.sceneManager.getAppWidth();
    const title = new Label("MENU", "title", {
      x: appWidth / 2,
      y: UIConfig.POSITION.TITLE_Y,
      anchor: { x: 0.5, y: 0.5 },
      style: {
        fontFamily: "'Orbitron', Arial, sans-serif",
        fontSize: isMobile
          ? SceneConfig.MOBILE_TITLE_FONT_SIZE
          : SceneConfig.DESKTOP_TITLE_FONT_SIZE,
        fontWeight: "800",
        fill: 0x4a3a22,
        align: "center",
        letterSpacing: isMobile
          ? SceneConfig.MOBILE_TITLE_LETTER_SPACING
          : SceneConfig.DESKTOP_TITLE_LETTER_SPACING,
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
        scene: PhoenixFlamesScene,
      },
    ];

    const isMobile = window.innerWidth < SceneConfig.MOBILE_BREAKPOINT;
    const appWidth = this.sceneManager.getAppWidth();
    const centerX = appWidth / 2;
    const startY = UIConfig.POSITION.MENU_START_Y;
    const spacing = UIConfig.SPACING.BUTTON;

    games.forEach((game, index) => {
      const buttonWidth = isMobile
        ? Math.min(
            appWidth - SceneConfig.MOBILE_BUTTON_PADDING,
            SceneConfig.MOBILE_MAX_BUTTON_WIDTH
          )
        : Math.min(
            SceneConfig.DESKTOP_MAX_BUTTON_WIDTH,
            appWidth - SceneConfig.DESKTOP_BUTTON_PADDING
          );

      const button = new Button(game.name, 0x4a3a22, {
        width: buttonWidth,
        height: isMobile
          ? SceneConfig.MOBILE_BUTTON_HEIGHT
          : SceneConfig.DESKTOP_BUTTON_HEIGHT,
        onClick: () => {
          this.sceneManager.changeScene(new game.scene(this.sceneManager));
        },
        style: {
          fontFamily: "'Orbitron', Arial, sans-serif",
          fontSize: isMobile
            ? SceneConfig.MOBILE_BUTTON_FONT_SIZE
            : SceneConfig.DESKTOP_BUTTON_FONT_SIZE,
          fontWeight: "600",
          fill: 0xf5e2c4,
          align: "center",
          letterSpacing: isMobile
            ? SceneConfig.MOBILE_BUTTON_LETTER_SPACING
            : SceneConfig.DESKTOP_BUTTON_LETTER_SPACING,
        },
      });
      button.x = centerX;
      button.y = startY + index * spacing;
      this.addChild(button);
    });
  }
}
