import { Graphics, Text } from "pixi.js";
import { Scene } from "./Scene";
import { SceneManager } from "./SceneManager";
import { AceOfShadowsScene } from "./AceOfShadowsScene";
import { MagicWordsScene } from "./MagicWordsScene";
import { PhenixFlamesScene } from "./PhenixFlamesScene";
import { Colors } from "../styles/Colors";
import { UIConfig } from "../styles/UIConfig";
import { UIHelpers } from "../utils/UIHelpers";

export class MainMenuScene extends Scene {
  private sceneManager: SceneManager;
  private particles: Graphics[] = [];
  private time: number = 0;

  constructor(sceneManager: SceneManager) {
    super();
    this.sceneManager = sceneManager;
  }

  onEnter(): void {
    this.createBackgroundParticles();
    this.createTitle();
    this.createMenuButtons();
  }

  onExit(): void {
    this.particles = [];
    this.removeChildren();
  }

  update(delta: number): void {
    this.time += delta * 0.01;

    // Animate background particles
    this.particles.forEach((particle, index) => {
      particle.alpha = 0.15 + Math.sin(this.time + index) * 0.1;
    });
  }
  private createBackgroundParticles(): void {
    for (let i = 0; i < 15; i++) {
      const particle = new Graphics();
      const size = Math.random() * 3 + 1;

      particle.beginFill(0xffffff, 0.2);
      particle.drawCircle(0, 0, size);
      particle.endFill();

      particle.x = Math.random() * this.sceneManager.getAppWidth();
      particle.y = Math.random() * this.sceneManager.getAppHeight();
      particle.alpha = Math.random() * 0.3;

      this.particles.push(particle);
      this.addChild(particle);
    }
  }

  private createTitle(): void {
    const title = UIHelpers.createTitle(
      "MAIN MENU",
      this.sceneManager.getAppWidth() / 2
    );
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
      const button = UIHelpers.createButton(game.name, game.color, {
        onClick: () => {
          this.sceneManager.changeScene(new game.scene(this.sceneManager));
        },
      });
      button.x = centerX;
      button.y = startY + index * spacing;
      this.addChild(button);
    });
  }
}
