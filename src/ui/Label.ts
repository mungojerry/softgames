import { Text } from "pixi.js";
import { TextStyles } from "../styles/TextStyles";

export class Label extends Text {
  constructor(
    text: string,
    style:
      | "title"
      | "button"
      | "buttonSmall"
      | "sceneTitle"
      | "magicWord" = "button",
    options: {
      x?: number;
      y?: number;
      anchor?: { x: number; y: number };
    } = {}
  ) {
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
    super(text, textStyle);
    if (options.anchor) {
      this.anchor.set(options.anchor.x, options.anchor.y);
    }
    if (options.x !== undefined) {
      this.x = options.x;
    }
    if (options.y !== undefined) {
      this.y = options.y;
    }
  }
}
