import { TextStyle } from "pixi.js";

export class TextStyles {
  static readonly TITLE = new TextStyle({
    fontFamily: "'Orbitron', Arial, sans-serif",
    fontSize: 50,
    fontWeight: "700",
    fill: 0xffffff,
    stroke: 0x333333,
    strokeThickness: 3,
    dropShadow: true,
    dropShadowColor: 0x000000,
    dropShadowBlur: 10,
    dropShadowAngle: Math.PI / 4,
    dropShadowDistance: 6,
    letterSpacing: 6,
    align: "center",
  });

  static readonly BUTTON = new TextStyle({
    fontFamily: "'Orbitron', Arial, sans-serif",
    fontSize: 24,
    fontWeight: "500",
    fill: 0xffffff,
    letterSpacing: 1,
  });

  static readonly BUTTON_SMALL = new TextStyle({
    fontFamily: "'Orbitron', Arial, sans-serif",
    fontSize: 16,
    fontWeight: "500",
    fill: 0xffffff,
  });

  static readonly MAGIC_WORD = new TextStyle({
    fontFamily: "'Orbitron', Arial, sans-serif",
    fontSize: 36,
    fontWeight: "600",
    fill: 0x9370db,
  });
}
