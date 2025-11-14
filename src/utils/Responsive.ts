export class Responsive {
  static isMobile(): boolean {
    return window.innerWidth < 768;
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
