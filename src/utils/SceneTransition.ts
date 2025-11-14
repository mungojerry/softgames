import { Container, Graphics } from "pixi.js";
import gsap from "gsap";

export type TransitionType =
  | "fade"
  | "slideLeft"
  | "slideRight"
  | "wipe"
  | "circle"
  | "softWipe";

export class SceneTransition extends Container {
  private overlay: Graphics;
  private transitionMask: Graphics | null = null;
  private animationProgress: number = 0;
  private isTransitioning: boolean = false;
  private transitionType: TransitionType;
  private sceneWidth: number;
  private sceneHeight: number;
  private currentTween?: gsap.core.Timeline;

  constructor(width: number, height: number) {
    super();
    this.sceneWidth = width;
    this.sceneHeight = height;
    this.transitionType = "fade";

    this.overlay = new Graphics();
    this.addChild(this.overlay);
    this.transitionMask = null;
  }

  start(type: TransitionType, onComplete: () => void): void {
    // Kill any existing tween
    if (this.currentTween) {
      this.currentTween.kill();
    }

    this.transitionType = type;
    this.isTransitioning = true;
    this.animationProgress = 0;
    this.visible = true;

    // Create mask if needed
    if (type === "softWipe" || type === "circle") {
      if (!this.transitionMask) {
        this.transitionMask = new Graphics();
        this.addChild(this.transitionMask);
      }
      this.overlay.mask = this.transitionMask;
    } else {
      if (this.transitionMask) {
        this.overlay.mask = null;
        this.removeChild(this.transitionMask);
        this.transitionMask = null;
      }
    }

    // Use GSAP timeline for better control over the two-phase transition
    const timeline = gsap.timeline({
      onUpdate: () => this.updateTransition(),
      onComplete: () => {
        this.isTransitioning = false;
        this.visible = false;
        this.currentTween = undefined;
      },
    });

    // Phase 1: Transition in (0 to 1)
    timeline.to(this, {
      animationProgress: 1,
      duration: 0.4,
      ease: "power2.in",
      onComplete: () => {
        if (onComplete) onComplete();
      },
    });

    // Phase 2: Transition out (1 to 2)
    timeline.to(this, {
      animationProgress: 2,
      duration: 0.4,
      ease: "power2.out",
    });

    this.currentTween = timeline;
  }

  update(delta: number): boolean {
    // GSAP handles all animation timing
    return !this.isTransitioning;
  }

  private updateTransition(): void {
    this.overlay.clear();

    switch (this.transitionType) {
      case "fade":
        this.updateFade();
        break;
      case "slideLeft":
        this.updateSlide(-1);
        break;
      case "slideRight":
        this.updateSlide(1);
        break;
      case "wipe":
        this.updateWipe();
        break;
      case "circle":
        this.updateCircle();
        break;
      case "softWipe":
        this.updateSoftWipe();
        break;
    }
  }

  /**
   * Star Wars style soft wipe using a gradient mask
   */
  private updateSoftWipe(): void {
    // Progress: 0 to 1 (wipe in), 1 to 2 (wipe out)
    let progress: number;
    if (this.animationProgress < 1) {
      progress = this.animationProgress;
    } else {
      progress = this.animationProgress - 1;
    }

    // Wipe position
    const wipeX = this.sceneWidth * progress;
    const edgeWidth = 60; // Soft edge width

    // Draw black overlay
    this.overlay.beginFill(0x000000);
    this.overlay.drawRect(0, 0, wipeX, this.sceneHeight);
    this.overlay.endFill();

    // Draw soft edge using a gradient mask
    if (this.transitionMask) {
      this.transitionMask.clear();
      const steps = 20;
      for (let i = 0; i < steps; i++) {
        const alpha = 1 - i / steps;
        this.transitionMask.beginFill(0xffffff, alpha * 0.8);
        this.transitionMask.drawRect(
          wipeX + (i * edgeWidth) / steps,
          0,
          edgeWidth / steps,
          this.sceneHeight
        );
        this.transitionMask.endFill();
      }
    }
  }

  private updateFade(): void {
    let alpha: number;
    if (this.animationProgress < 1) {
      // Fade in
      alpha = this.animationProgress;
    } else {
      // Fade out
      alpha = 2 - this.animationProgress;
    }

    this.overlay.beginFill(0x000000, alpha);
    this.overlay.drawRect(0, 0, this.sceneWidth, this.sceneHeight);
    this.overlay.endFill();
  }

  private updateSlide(direction: number): void {
    let xPos: number;
    if (this.animationProgress < 1) {
      // Slide in
      xPos = (1 - this.animationProgress) * this.sceneWidth * direction;
    } else {
      // Slide out
      xPos = (this.animationProgress - 1) * this.sceneWidth * -direction;
    }

    this.overlay.beginFill(0x000000);
    this.overlay.drawRect(xPos, 0, this.sceneWidth, this.sceneHeight);
    this.overlay.endFill();
  }

  private updateWipe(): void {
    let progress: number;
    if (this.animationProgress < 1) {
      // Wipe in from top to bottom
      progress = this.animationProgress;
    } else {
      // Wipe out from top to bottom
      progress = this.animationProgress - 1;
    }

    const height = this.sceneHeight * progress;

    if (this.animationProgress < 1) {
      this.overlay.beginFill(0x000000);
      this.overlay.drawRect(0, 0, this.sceneWidth, height);
      this.overlay.endFill();
    } else {
      this.overlay.beginFill(0x000000);
      this.overlay.drawRect(
        0,
        height,
        this.sceneWidth,
        this.sceneHeight - height
      );
      this.overlay.endFill();
    }
  }

  private updateCircle(): void {
    const centerX = this.sceneWidth / 2;
    const centerY = this.sceneHeight / 2;
    const maxRadius = Math.sqrt(centerX * centerX + centerY * centerY);

    let radius: number;
    if (this.animationProgress < 1) {
      // Circle grows from center
      radius = this.animationProgress * maxRadius;
    } else {
      // Circle shrinks from full coverage
      radius = (2 - this.animationProgress) * maxRadius;
    }

    // Draw black overlay
    this.overlay.beginFill(0x000000);
    this.overlay.drawRect(0, 0, this.sceneWidth, this.sceneHeight);
    this.overlay.endFill();

    // Update persistent mask for the circle
    if (this.transitionMask) {
      this.transitionMask.clear();
      this.transitionMask.beginFill(0xffffff);
      this.transitionMask.drawCircle(centerX, centerY, radius);
      this.transitionMask.endFill();
    }
  }

  reset(): void {
    if (this.currentTween) {
      this.currentTween.kill();
      this.currentTween = undefined;
    }
    this.isTransitioning = false;
    this.animationProgress = 0;
    this.visible = false;
    this.overlay.clear();
    if (this.transitionMask) {
      this.overlay.mask = null;
      this.removeChild(this.transitionMask);
      this.transitionMask = null;
    }
  }
}
