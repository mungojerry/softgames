import { Sprite, Texture } from "pixi.js";
import gsap from "gsap";

export class Card {
  public sprite: Sprite;

  constructor(texture: Texture) {
    this.sprite = new Sprite(texture);
    this.sprite.anchor.set(0.5, 0.5);
  }

  public setPosition(x: number, y: number): void {
    this.sprite.x = x;
    this.sprite.y = y;
  }

  public getPosition(): { x: number; y: number } {
    return { x: this.sprite.x, y: this.sprite.y };
  }
  public setRotation(r: number): void {
    this.sprite.rotation = r;
  }

  public getRotation(): number {
    return this.sprite.rotation;
  }

  public moveTo(x: number, y: number, r: number, duration: number = 2): void {
    const originalScale = this.sprite.scale.x;

    gsap.to(this.sprite, {
      x,
      y,
      rotation: this.getRotation() + r,
      duration,
      ease: "power2.out",
      onStart: () => {
        // Bring card to front during animation
        this.sprite.parent?.setChildIndex(
          this.sprite,
          this.sprite.parent.children.length - 1
        );
      },
    });

    // Scale up to 1.2 and back to original
    gsap.to(this.sprite.scale, {
      x: originalScale * 1.2,
      y: originalScale * 1.2,
      duration: duration / 3,
      ease: "cubic.out",
      yoyo: true,
      repeat: 1,
    });
  }

  public destroy(): void {
    gsap.killTweensOf(this.sprite);
    this.sprite.destroy();
  }
}
