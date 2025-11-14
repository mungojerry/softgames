import { Graphics } from "pixi.js";
import { Scene } from "./Scene";
import { SceneManager } from "./SceneManager";
import { MainMenuScene } from "./MainMenuScene";
import { Colors } from "../styles/Colors";
import { SceneUI } from "../ui/SceneUI";
import { AceOfShadowsGame } from "../games/aceofshadows/AceOfShadowsGame";
import { SceneConfig } from "./SceneConfig";
import gsap from "gsap";

export class AceOfShadowsScene extends Scene {
  private shadowParticles: Graphics[] = [];
  private game: AceOfShadowsGame | null = null;

  constructor(private sceneManager: SceneManager) {
    super();
  }

  onEnter(): void {
    const ui = new SceneUI(this, this.sceneManager);
    ui.addBackground(Colors.BG_SHADOWS);
    ui.addBackButton(Colors.BTN_SHADOWS, () =>
      this.sceneManager.changeScene(new MainMenuScene(this.sceneManager))
    );
    this.createShadowParticles();
    this.startGame();
  }

  onExit(): void {
    this.shadowParticles.forEach((particle) => {
      gsap.killTweensOf(particle);
      particle.destroy();
    });
    this.shadowParticles = [];

    if (this.game) {
      this.game.destroy();
      this.game = null;
    }

    this.removeChildren();
  }

  update(delta: number): void {
    // GSAP handles animation, no manual update needed
  }

  private startGame(): void {
    this.game = new AceOfShadowsGame(this.sceneManager.getApp());
    const centerX = this.sceneManager.getAppWidth() / 2;
    const centerY =
      this.sceneManager.getAppHeight() / SceneConfig.GAME_CENTER_Y_DIVISOR;
    this.game.createCards(this, centerX, centerY);
  }

  onResize(): void {
    // Recreate entire scene
    this.removeChildren();

    const ui = new SceneUI(this, this.sceneManager);
    ui.addBackground(Colors.BG_SHADOWS);
    ui.addBackButton(Colors.BTN_SHADOWS, () =>
      this.sceneManager.changeScene(new MainMenuScene(this.sceneManager))
    );

    this.shadowParticles.forEach((particle) => {
      gsap.killTweensOf(particle);
    });
    this.shadowParticles = [];
    this.createShadowParticles();

    if (this.game) {
      this.game.reposition(
        this.sceneManager.getAppWidth(),
        this.sceneManager.getAppHeight()
      );
    }
  }

  private createShadowParticles(): void {
    for (let i = 0; i < SceneConfig.SHADOW_PARTICLE_COUNT; i++) {
      const particle = new Graphics();
      const radiusRange =
        SceneConfig.SHADOW_PARTICLE_MAX_RADIUS -
        SceneConfig.SHADOW_PARTICLE_MIN_RADIUS;
      const radius =
        Math.random() * radiusRange + SceneConfig.SHADOW_PARTICLE_MIN_RADIUS;
      particle.beginFill(Colors.SHADOW_PARTICLE);
      particle.drawCircle(0, 0, radius);
      particle.endFill();
      particle.x = Math.random() * this.sceneManager.getAppWidth();
      particle.y = Math.random() * this.sceneManager.getAppHeight();
      particle.alpha = Math.random() * SceneConfig.SHADOW_PARTICLE_MAX_ALPHA;
      this.addChild(particle);
      this.shadowParticles.push(particle);

      // Animate shadow falling with GSAP
      const durationRange =
        SceneConfig.SHADOW_PARTICLE_MAX_DURATION -
        SceneConfig.SHADOW_PARTICLE_MIN_DURATION;
      gsap.to(particle, {
        y:
          "+=" +
          (this.sceneManager.getAppHeight() +
            SceneConfig.SHADOW_PARTICLE_FALL_BUFFER),
        alpha: 0,
        duration:
          SceneConfig.SHADOW_PARTICLE_MIN_DURATION +
          Math.random() * durationRange,
        ease: "none",
        repeat: -1,
        repeatDelay: 0,
        onRepeat: () => {
          particle.y = SceneConfig.SHADOW_PARTICLE_SPAWN_OFFSET;
          particle.alpha =
            Math.random() * SceneConfig.SHADOW_PARTICLE_MAX_ALPHA;
          particle.x = Math.random() * this.sceneManager.getAppWidth();
        },
      });
    }
  }
}
