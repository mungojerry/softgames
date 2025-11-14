import { TextStyle } from "pixi.js";
import { Responsive } from "../utils/Responsive";

export class TextStyles {
  static get TITLE(): TextStyle {
    const isMobile = Responsive.isMobile();
    return new TextStyle({
      fontFamily: "'Orbitron', Arial, sans-serif",
      fontSize: isMobile ? 32 : 50,
      fontWeight: "700",
      fill: 0xffffff,
      stroke: 0x333333,
      strokeThickness: isMobile ? 2 : 3,
      dropShadow: true,
      dropShadowColor: 0x000000,
      dropShadowBlur: isMobile ? 6 : 10,
      dropShadowAngle: Math.PI / 4,
      dropShadowDistance: isMobile ? 4 : 6,
      letterSpacing: isMobile ? 3 : 6,
      align: "center",
    });
  }

  static get BUTTON(): TextStyle {
    const isMobile = Responsive.isMobile();
    return new TextStyle({
      fontFamily: "'Orbitron', Arial, sans-serif",
      fontSize: isMobile ? 18 : 24,
      fontWeight: "500",
      fill: 0xffffff,
      letterSpacing: 1,
    });
  }

  static get BUTTON_SMALL(): TextStyle {
    const isMobile = Responsive.isMobile();
    return new TextStyle({
      fontFamily: "'Orbitron', Arial, sans-serif",
      fontSize: isMobile ? 14 : 16,
      fontWeight: "500",
      fill: 0xffffff,
    });
  }

  static readonly MAGIC_WORD = new TextStyle({
    fontFamily: "'Orbitron', Arial, sans-serif",
    fontSize: 36,
    fontWeight: "600",
    fill: 0x9370db,
  });
}
