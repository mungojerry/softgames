import { TextStyle } from "pixi.js";

export class TextStyles {
  static readonly TITLE = new TextStyle({
    fontFamily: "Arial, sans-serif",
    fontSize: 80,
    fontWeight: "bold",
    fill: "#ffffff",
    stroke: "#333333",
    strokeThickness: 3,
    dropShadow: true,
    dropShadowColor: "#000000",
    dropShadowBlur: 10,
    dropShadowAngle: Math.PI / 4,
    dropShadowDistance: 6,
    letterSpacing: 6,
    align: "center",
  });

  static readonly SCENE_TITLE_SHADOWS = new TextStyle({
    fontFamily: "Arial",
    fontSize: 72,
    fontWeight: "bold",
    fill: ["#8b0000", "#000000"],
    stroke: "#ffffff",
    strokeThickness: 3,
    dropShadow: true,
    dropShadowColor: "#000000",
    dropShadowBlur: 4,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
  });

  static readonly SCENE_TITLE_MAGIC = new TextStyle({
    fontFamily: "Arial",
    fontSize: 72,
    fontWeight: "bold",
    fill: ["#9370db", "#4b0082"],
    stroke: "#ffffff",
    strokeThickness: 3,
    dropShadow: true,
    dropShadowColor: "#9370db",
    dropShadowBlur: 10,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 6,
  });

  static readonly SCENE_TITLE_FLAMES = new TextStyle({
    fontFamily: "Arial",
    fontSize: 72,
    fontWeight: "bold",
    fill: ["#ff4500", "#ffa500", "#ff0000"],
    stroke: "#8b0000",
    strokeThickness: 4,
    dropShadow: true,
    dropShadowColor: "#ff4500",
    dropShadowBlur: 15,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 8,
  });

  static readonly BUTTON = new TextStyle({
    fontFamily: "Arial, sans-serif",
    fontSize: 32,
    fontWeight: "bold",
    fill: "#ffffff",
    letterSpacing: 1,
  });

  static readonly BUTTON_SMALL = new TextStyle({
    fontFamily: "Arial",
    fontSize: 24,
    fill: 0xffffff,
  });

  static readonly MAGIC_WORD = new TextStyle({
    fontFamily: "Arial",
    fontSize: 36,
    fill: 0x9370db,
    fontStyle: "italic",
  });
}
