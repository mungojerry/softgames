import { Graphics } from "pixi.js";
import { Scene } from "./Scene";
import { SceneManager } from "./SceneManager";
import { MainMenuScene } from "./MainMenuScene";
import { Colors } from "../styles/Colors";
import { SceneUI } from "../ui/SceneUI";
import { AceOfShadowsGame } from "../games/aceofshadows/AceOfShadowsGame";
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
    ui.addTitle("ACE OF SHADOWS", 100);
    ui.addBackButton(Colors.BTN_SHADOWS, () =>
      this.sceneManager.changeScene(new MainMenuScene(this.sceneManager))
    );
    this.createShadowParticles();
    this.startGame();
  }

  onExit(): void {
    this.shadowParticles.forEach((particle) => gsap.killTweensOf(particle));
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
    const centerY = this.sceneManager.getAppHeight() / 1.5;
    this.game.createCards(this, centerX, centerY);
  }

  private createShadowParticles(): void {
    for (let i = 0; i < 20; i++) {
      const particle = new Graphics();
      const radius = Math.random() * 10 + 5;
      particle.beginFill(Colors.SHADOW_PARTICLE);
      particle.drawCircle(0, 0, radius);
      particle.endFill();
      particle.x = Math.random() * this.sceneManager.getAppWidth();
      particle.y = Math.random() * this.sceneManager.getAppHeight();
      particle.alpha = Math.random() * 0.5;
      this.addChild(particle);
      this.shadowParticles.push(particle);

      // Animate shadow falling with GSAP
      gsap.to(particle, {
        y: "+=" + (this.sceneManager.getAppHeight() + 100),
        alpha: 0,
        duration: 3 + Math.random() * 2,
        ease: "none",
        repeat: -1,
        repeatDelay: 0,
        onRepeat: () => {
          particle.y = -50;
          particle.alpha = Math.random() * 0.5;
          particle.x = Math.random() * this.sceneManager.getAppWidth();
        },
      });
    }
  }
}
