import { Container, Graphics, Text } from "pixi.js";
import { Colors } from "../styles/Colors";
import { UIConfig } from "../styles/UIConfig";
import { TextStyles } from "../styles/TextStyles";
import gsap from "gsap";

export class Button extends Container {
  private bg: Graphics;
  private label: Text;
  private color: number;
  private border: number;
  private cornerRadius: number;
  private btnWidth: number;
  private btnHeight: number;
  private small: boolean;

  constructor(
    text: string,
    color: number,
    options: {
      width?: number;
      height?: number;
      small?: boolean;
      onClick?: () => void;
      style?: any;
    } = {}
  ) {
    super();
    this.color = color;
    this.small = !!options.small;
    this.btnWidth = options.width || UIConfig.BUTTON.WIDTH;
    this.btnHeight = options.height || UIConfig.BUTTON.HEIGHT;
    this.border = 6;
    this.cornerRadius = 18;

    this.bg = new Graphics();
    this.addChild(this.bg);

    const textStyle = options.style || TextStyles.BUTTON;
    this.label = new Text(text, textStyle);
    this.label.anchor.set(0.5);
    this.addChild(this.label);
    this.drawButton(this.color);

    this.eventMode = "static";
    this.cursor = "pointer";
    this.scale.set(1);

    this.on("pointerover", () => {
      this.drawButton(Colors.lighten(this.color, 20));
      gsap.to(this.scale, {
        x: 1.03,
        y: 1.03,
        duration: 0.15,
        ease: "power2.out",
      });
    });
    this.on("pointerout", () => {
      this.drawButton(this.color);
      gsap.to(this.scale, { x: 1, y: 1, duration: 0.15, ease: "power2.out" });
    });
    this.on("pointerdown", () => {
      gsap.to(this.scale, {
        x: 0.98,
        y: 0.98,
        duration: 0.1,
        ease: "power2.in",
      });
    });
    this.on("pointerup", () => {
      gsap.to(this.scale, {
        x: 1.03,
        y: 1.03,
        duration: 0.1,
        ease: "power2.out",
      });
    });
    if (options.onClick) {
      this.on("pointerdown", options.onClick);
    }
  }

  private drawButton(fillColor: number) {
    this.bg.clear();
    // Drop shadow
    this.bg.beginFill(0x000000, 0.25);
    this.bg.drawRoundedRect(
      -this.btnWidth / 2 + 8,
      -this.btnHeight / 2 + 8,
      this.btnWidth,
      this.btnHeight,
      this.cornerRadius
    );
    this.bg.endFill();
    // Outer border
    this.bg.lineStyle(6, 0x2d2012, 1);
    this.bg.beginFill(fillColor);
    this.bg.drawRoundedRect(
      -this.btnWidth / 2,
      -this.btnHeight / 2,
      this.btnWidth,
      this.btnHeight,
      this.cornerRadius
    );
    this.bg.endFill();
    // Inner border
    this.bg.lineStyle(3, 0xf5e2c4, 1);
    this.bg.drawRoundedRect(
      -this.btnWidth / 2 + 8,
      -this.btnHeight / 2 + 8,
      this.btnWidth - 16,
      this.btnHeight - 16,
      this.cornerRadius - 8
    );
    // Center label
    this.label.x = 0;
    this.label.y = 0;
  }

  public destroy(options?: any): void {
    // Kill any ongoing scale tweens
    gsap.killTweensOf(this.scale);
    gsap.killTweensOf(this);
    super.destroy(options);
  }
}
