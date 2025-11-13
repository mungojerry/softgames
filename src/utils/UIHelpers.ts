import { Graphics, Text } from "pixi.js";
import { TextStyles } from "../styles/TextStyles";
import { Colors } from "../styles/Colors";
import { UIConfig } from "../styles/UIConfig";

export class UIHelpers {
  /**
   * Creates a styled button with text
   */
  static createButton(
    text: string,
    color: number,
    options: {
      width?: number;
      height?: number;
      onClick?: () => void;
      small?: boolean;
    } = {}
  ): Graphics {
    const button = new Graphics();
    const width = options.small
      ? UIConfig.BUTTON_SMALL.WIDTH
      : options.width || UIConfig.BUTTON.WIDTH;
    const height = options.small
      ? UIConfig.BUTTON_SMALL.HEIGHT
      : options.height || UIConfig.BUTTON.HEIGHT;
    const border = options.small
      ? UIConfig.BUTTON_SMALL.BORDER
      : UIConfig.BUTTON.BORDER;
    const cornerRadius = UIConfig.BUTTON.CORNER_RADIUS;

    // Draw initial button state
    this.drawButtonShape(
      button,
      width,
      height,
      color,
      Colors.WHITE,
      border,
      cornerRadius
    );

    // Add button text
    const textStyle = options.small
      ? TextStyles.BUTTON_SMALL
      : TextStyles.BUTTON;
    const buttonText = new Text(text, textStyle);
    buttonText.anchor.set(0.5);
    button.addChild(buttonText);

    // Make interactive
    button.eventMode = "static";
    button.cursor = "pointer";
    button.scale.set(1);

    // Hover effects
    button.on("pointerover", () => {
      button.clear();
      this.drawButtonShape(
        button,
        width,
        height,
        Colors.lighten(color, 40),
        Colors.WHITE,
        border,
        cornerRadius
      );
      button.scale.set(1.03);
    });

    button.on("pointerout", () => {
      button.clear();
      this.drawButtonShape(
        button,
        width,
        height,
        color,
        Colors.WHITE,
        border,
        cornerRadius
      );
      button.scale.set(1);
    });

    button.on("pointerdown", () => {
      button.scale.set(0.98);
    });

    button.on("pointerup", () => {
      button.scale.set(1.03);
    });

    // Add click handler if provided
    if (options.onClick) {
      button.on("pointerdown", options.onClick);
    }

    return button;
  }

  /**
   * Draws a button shape with shadow
   */
  private static drawButtonShape(
    graphics: Graphics,
    width: number,
    height: number,
    fillColor: number,
    strokeColor: number,
    strokeWidth: number,
    cornerRadius: number
  ): void {
    // Shadow
    graphics.beginFill(0x000000, 0.3);
    graphics.drawRoundedRect(
      -width / 2 + 4,
      -height / 2 + 4,
      width,
      height,
      cornerRadius
    );
    graphics.endFill();

    // Main button
    graphics.beginFill(fillColor);
    graphics.lineStyle(strokeWidth, strokeColor, 1);
    graphics.drawRoundedRect(
      -width / 2,
      -height / 2,
      width,
      height,
      cornerRadius
    );
    graphics.endFill();
  }

  /**
   * Creates styled text
   */
  static createText(
    text: string,
    style: "title" | "button" | "buttonSmall" | "sceneTitle" | "magicWord",
    options: {
      x?: number;
      y?: number;
      anchor?: { x: number; y: number };
    } = {}
  ): Text {
    let textStyle;
    switch (style) {
      case "title":
        textStyle = TextStyles.TITLE;
        break;
      case "button":
        textStyle = TextStyles.BUTTON;
        break;
      case "buttonSmall":
        textStyle = TextStyles.BUTTON_SMALL;
        break;
      case "magicWord":
        textStyle = TextStyles.MAGIC_WORD;
        break;
      default:
        textStyle = TextStyles.BUTTON;
    }

    const textObj = new Text(text, textStyle);

    if (options.anchor) {
      textObj.anchor.set(options.anchor.x, options.anchor.y);
    }

    if (options.x !== undefined) {
      textObj.x = options.x;
    }

    if (options.y !== undefined) {
      textObj.y = options.y;
    }

    return textObj;
  }

  /**
   * Creates a back button with standard styling
   */
  static createBackButton(onClick: () => void, color: number): Graphics {
    return this.createButton("Back to Menu", color, {
      small: true,
      onClick: onClick,
    });
  }

  /**
   * Creates a centered title text
   */
  static createTitle(
    text: string,
    centerX: number,
    y: number = UIConfig.POSITION.TITLE_Y
  ): Text {
    return this.createText(text, "title", {
      x: centerX,
      y: y,
      anchor: { x: 0.5, y: 0.5 },
    });
  }

  /**
   * Creates a background rectangle
   */
  static createBackground(
    width: number,
    height: number,
    color: number
  ): Graphics {
    const bg = new Graphics();
    bg.beginFill(color);
    bg.drawRect(0, 0, width, height);
    bg.endFill();
    return bg;
  }
}
