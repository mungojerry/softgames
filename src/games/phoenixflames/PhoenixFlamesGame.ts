import { BLEND_MODES, Container, Sprite, Texture } from "pixi.js";
import { PhoenixFlamesConfig } from "./PhoenixFlamesConfig";
import gsap from "gsap";

interface Particle {
  sprite: Sprite;
  active: boolean;
}

export class PhoenixFlamesGame {
  private particles: Particle[] = [];
  private fireTexture: Texture;
  private emissionInterval: number | null = null;
  private container: Container | null = null;
  private startPosition = { x: 0, y: 0 };

  constructor(private gameWidth: number, private gameHeight: number) {
    // Load fire texture from assets with error handling
    // Use Vite's base URL for proper asset path in production
    const basePath = import.meta.env.BASE_URL || "/softgames/";
    try {
      this.fireTexture = Texture.from(`${basePath}assets/fire.png`);

      // Add error handler for texture loading
      if (!this.fireTexture.valid && this.fireTexture.baseTexture) {
        this.fireTexture.baseTexture.on("error", () => {
          console.error("Failed to load fire.png texture");
          this.fireTexture = Texture.WHITE;
        });
      }
    } catch (error) {
      console.error("Error loading fire texture:", error);
      this.fireTexture = Texture.WHITE;
    }

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
    for (let i = 0; i < PhoenixFlamesConfig.MAX_PARTICLES; i++) {
      const sprite = new Sprite(this.fireTexture);
      sprite.anchor.set(PhoenixFlamesConfig.SPRITE_ANCHOR);
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
    // Emit a new particle at configured interval
    this.emissionInterval = window.setInterval(() => {
      this.emitParticle();
    }, PhoenixFlamesConfig.EMISSION_INTERVAL_MS);
  }

  private emitParticle(): void {
    // Find inactive particle or reuse oldest
    let particle = this.particles.find((p) => !p.active);

    if (!particle) {
      // All particles active, reuse oldest
      particle = this.particles[0];
      gsap.killTweensOf(particle.sprite);
      gsap.killTweensOf(particle.sprite.scale);
    }

    particle.active = true;
    const sprite = particle.sprite;
    sprite.visible = true;

    // Reset sprite
    sprite.x = PhoenixFlamesConfig.INITIAL_X;
    sprite.y = PhoenixFlamesConfig.INITIAL_Y;
    sprite.alpha = PhoenixFlamesConfig.INITIAL_ALPHA;
    sprite.scale.set(PhoenixFlamesConfig.INITIAL_SCALE);
    sprite.rotation = 0;

    // Calculate random trajectory
    const randomX =
      (Math.random() - PhoenixFlamesConfig.RANDOM_X_CENTER) *
      PhoenixFlamesConfig.RANDOM_X_RANGE;
    const randomY =
      -PhoenixFlamesConfig.BASE_RISE_DISTANCE -
      Math.random() * PhoenixFlamesConfig.RANDOM_Y_RANGE;
    const randomRotation =
      (Math.random() - PhoenixFlamesConfig.RANDOM_ROTATION_CENTER) *
      PhoenixFlamesConfig.ROTATION_MAX_RADIANS;
    const randomScale =
      PhoenixFlamesConfig.MIN_SCALE +
      Math.random() *
        (PhoenixFlamesConfig.MAX_SCALE - PhoenixFlamesConfig.MIN_SCALE);

    // Animate particle with timeline
    const tl = gsap.timeline({
      onComplete: () => {
        particle!.active = false;
        sprite.visible = false;
      },
    });

    // Movement and fade
    tl.to(sprite, {
      x: randomX,
      y: randomY,
      alpha: PhoenixFlamesConfig.TARGET_ALPHA,
      duration: PhoenixFlamesConfig.MOVE_DURATION,
      ease: PhoenixFlamesConfig.MOVE_EASE,
    });

    // Scale up
    tl.to(
      sprite.scale,
      {
        x: randomScale,
        y: randomScale,
        duration: PhoenixFlamesConfig.SCALE_DURATION,
        ease: PhoenixFlamesConfig.SCALE_EASE,
      },
      PhoenixFlamesConfig.SCALE_START_TIME
    );

    // Rotation
    tl.to(
      sprite,
      {
        rotation: randomRotation,
        duration: PhoenixFlamesConfig.ROTATION_DURATION,
        ease: PhoenixFlamesConfig.ROTATION_EASE,
      },
      PhoenixFlamesConfig.ROTATION_START_TIME
    );
  }

  public destroy(): void {
    // Stop emission first to prevent new particles
    if (this.emissionInterval !== null) {
      clearInterval(this.emissionInterval);
      this.emissionInterval = null;
    }

    // Kill all GSAP animations and clean up sprites
    this.particles.forEach((particle) => {
      // Kill all tweens on the sprite and its properties
      gsap.killTweensOf(particle.sprite);
      gsap.killTweensOf(particle.sprite.scale);

      // Destroy the sprite
      particle.sprite.destroy({ texture: false, baseTexture: false });
    });

    this.particles = [];

    // Destroy container (children are already destroyed)
    if (this.container) {
      this.container.destroy({ children: false });
      this.container = null;
    }

    // Don't destroy the shared texture as it might be reused
  }
}
