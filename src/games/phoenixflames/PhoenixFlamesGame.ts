import { BLEND_MODES, Container, Sprite, Texture } from "pixi.js";
import gsap from "gsap";

interface Particle {
  sprite: Sprite;
  active: boolean;
}

export class PhoenixFlamesGame {
  private particles: Particle[] = [];
  private readonly MAX_PARTICLES = 10;
  private fireTexture: Texture;
  private emissionInterval: number | null = null;
  private container: Container | null = null;
  private startPosition = { x: 0, y: 0 };

  constructor(private gameWidth: number, private gameHeight: number) {
    // Load fire texture from assets
    const basePath = import.meta?.env?.BASE_URL || "/";
    this.fireTexture = Texture.from(basePath + "assets/fire.png");
    this.startPosition.x = gameWidth / 2;
    this.startPosition.y = gameHeight / 2;
  }

  public start(scene: Container, x: number, y: number): void {
    // Create a container for all particles
    this.container = new Container();
    this.container.x = x;
    this.container.y = y;
    scene.addChild(this.container);

    // Initialize particle pool
    this.initializeParticlePool();

    // Start emitting particles
    this.startEmission();
  }

  private initializeParticlePool(): void {
    // Create exactly MAX_PARTICLES sprites
    for (let i = 0; i < this.MAX_PARTICLES; i++) {
      const sprite = new Sprite(this.fireTexture);
      sprite.anchor.set(0.5);
      sprite.visible = false;
      sprite.blendMode = BLEND_MODES.ADD;

      this.particles.push({
        sprite,
        active: false,
      });

      this.container?.addChild(sprite);
    }
  }

  private startEmission(): void {
    // Emit a new particle every 200ms
    this.emissionInterval = window.setInterval(() => {
      this.emitParticle();
    }, 200);
  }

  private emitParticle(): void {
    // Find an inactive particle to reuse
    const particle = this.particles.find((p) => !p.active);

    if (!particle) {
      return;
    }

    // Activate and reset the particle
    particle.active = true;
    particle.sprite.visible = true;

    // Random starting position at the bottom center area
    const startX = this.startPosition.x + (Math.random() - 0.5) * 5;
    const startY = this.startPosition.y;

    particle.sprite.x = startX;
    particle.sprite.y = startY;
    particle.sprite.alpha = 1;
    particle.sprite.scale.set(0.015 + Math.random() * 0.03);
    particle.sprite.rotation = Math.random() * Math.PI * 2;

    const endX = startX + (Math.random() - 0.5) * 0.5;
    const endY = startY - this.gameHeight * 0.1 - Math.random() * 5;

    // Animate with GSAP
    const duration = 1 + Math.random() * 0.5;

    // Upward movement with fade out
    gsap.to(particle.sprite, {
      x: endX,
      y: endY,
      alpha: 0,
      rotation: particle.sprite.rotation + (Math.random() - 0.5) * Math.PI,
      duration,

      ease: "power1.out",
      onComplete: () => {
        // Deactivate particle for reuse
        particle.active = false;
        particle.sprite.visible = false;
      },
    });

    // Scale animation (grow then shrink)
    gsap.to(particle.sprite.scale, {
      x: particle.sprite.scale.x * 10.5,
      y: particle.sprite.scale.y * 10.5,
      duration: duration * 0.5,
      ease: "power2.out",
      yoyo: true,
      repeat: 1,
    });
  }

  public destroy(): void {
    // Stop emission
    if (this.emissionInterval !== null) {
      clearInterval(this.emissionInterval);
      this.emissionInterval = null;
    }

    // Kill all GSAP animations
    this.particles.forEach((particle) => {
      gsap.killTweensOf(particle.sprite);
      gsap.killTweensOf(particle.sprite.scale);
      particle.sprite.destroy();
    });

    this.particles = [];

    if (this.container) {
      this.container.destroy();
      this.container = null;
    }
  }
}
