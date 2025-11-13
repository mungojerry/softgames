import { Container, Graphics, Text } from "pixi.js";
import { Colors } from "../styles/Colors";
import { UIConfig } from "../styles/UIConfig";
import { TextStyles } from "../styles/TextStyles";

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
    } = {}
  ) {
    super();
    this.color = color;
    this.small = !!options.small;
    this.btnWidth = this.small
      ? UIConfig.BUTTON_SMALL.WIDTH
      : options.width || UIConfig.BUTTON.WIDTH;
    this.btnHeight = this.small
      ? UIConfig.BUTTON_SMALL.HEIGHT
      : options.height || UIConfig.BUTTON.HEIGHT;
    this.border = this.small
      ? UIConfig.BUTTON_SMALL.BORDER
      : UIConfig.BUTTON.BORDER;
    this.cornerRadius = UIConfig.BUTTON.CORNER_RADIUS;

    this.bg = new Graphics();
    this.addChild(this.bg);

    const textStyle = this.small ? TextStyles.BUTTON_SMALL : TextStyles.BUTTON;
    this.label = new Text(text, textStyle);
    this.label.anchor.set(0.5);
    this.addChild(this.label);
    this.drawButton(this.color);

    this.eventMode = "static";
    this.cursor = "pointer";
    this.scale.set(1);

    this.on("pointerover", () => {
      this.drawButton(Colors.lighten(this.color, 40));
      this.scale.set(1.03);
    });
    this.on("pointerout", () => {
      this.drawButton(this.color);
      this.scale.set(1);
    });
    this.on("pointerdown", () => {
      this.scale.set(0.98);
    });
    this.on("pointerup", () => {
      this.scale.set(1.03);
    });
    if (options.onClick) {
      this.on("pointerdown", options.onClick);
    }
  }

  private drawButton(fillColor: number) {
    this.bg.clear();
    // Shadow
    this.bg.beginFill(0x000000, 0.3);
    this.bg.drawRoundedRect(
      -this.btnWidth / 2 + 4,
      -this.btnHeight / 2 + 4,
      this.btnWidth,
      this.btnHeight,
      this.cornerRadius
    );
    this.bg.endFill();
    // Main button
    this.bg.beginFill(fillColor);
    this.bg.lineStyle(this.border, Colors.WHITE, 1);
    this.bg.drawRoundedRect(
      -this.btnWidth / 2,
      -this.btnHeight / 2,
      this.btnWidth,
      this.btnHeight,
      this.cornerRadius
    );
    this.bg.endFill();
    // Center label
    this.label.x = 0;
    this.label.y = 0;
  }
}
