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
    if (!this.sprite || !this.sprite.parent) {
      console.warn("Cannot animate card: sprite or parent is null");
      return;
    }

    try {
      const originalScale = this.sprite.scale.x;

      gsap.to(this.sprite, {
        x,
        y,
        rotation: this.getRotation() + r,
        duration,
        ease: "power2.out",
        onStart: () => {
          try {
            // Bring card to front during animation
            if (this.sprite?.parent && this.sprite.parent.children.length > 0) {
              this.sprite.parent.setChildIndex(
                this.sprite,
                this.sprite.parent.children.length - 1
              );
            }
          } catch (error) {
            console.warn("Error bringing card to front:", error);
          }
        },
      });

      // Scale up to 1.2 and back to original
      if (this.sprite?.scale) {
        gsap.to(this.sprite.scale, {
          x: originalScale * 1.2,
          y: originalScale * 1.2,
          duration: duration / 3,
          ease: "cubic.out",
          yoyo: true,
          repeat: 1,
        });
      }
    } catch (error) {
      console.error("Error animating card movement:", error);
    }
  }

  public destroy(): void {
    try {
      if (this.sprite) {
        gsap.killTweensOf(this.sprite);
        if (this.sprite.scale) {
          gsap.killTweensOf(this.sprite.scale);
        }
        this.sprite.destroy();
      }
    } catch (error) {
      console.error("Error destroying card:", error);
    }
  }
}
