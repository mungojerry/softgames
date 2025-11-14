import { SceneConfig } from "../scenes/SceneConfig";

export class Responsive {
  static isMobile(): boolean {
    return window.innerWidth < SceneConfig.MOBILE_BREAKPOINT;
  }

  static getCanvasSize(): { width: number; height: number } {
    const isMobile = this.isMobile();

    if (isMobile) {
      return {
        width: window.innerWidth,
        height: window.innerHeight,
      };
    }

    return {
      width: 1280,
      height: 720,
    };
  }
}
