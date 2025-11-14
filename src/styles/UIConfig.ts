import { Responsive } from "../utils/Responsive";

export class UIConfig {
  static get BUTTON() {
    const isMobile = Responsive.isMobile();
    return {
      WIDTH: isMobile ? 280 : 420,
      HEIGHT: isMobile ? 60 : 70,
      BORDER: 4,
      CORNER_RADIUS: 12,
    };
  }

  static get BUTTON_SMALL() {
    const isMobile = Responsive.isMobile();
    return {
      WIDTH: isMobile ? 120 : 180,
      HEIGHT: isMobile ? 40 : 50,
      BORDER: 2,
    };
  }

  static get SPACING() {
    const isMobile = Responsive.isMobile();
    return {
      BUTTON: isMobile ? 90 : 130,
    };
  }

  static get POSITION() {
    const isMobile = Responsive.isMobile();
    return {
      TITLE_Y: isMobile ? 80 : 150,
      MENU_START_Y: isMobile ? 180 : 300,
      BACK_BUTTON_X: isMobile ? 70 : 110,
      BACK_BUTTON_OFFSET_Y: isMobile ? 30 : 50,
    };
  }
}
