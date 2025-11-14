import { Application } from "pixi.js";
import { SceneManager } from "./scenes/SceneManager";
import { MainMenuScene } from "./scenes/MainMenuScene";
import { Colors } from "./styles/Colors";
import { Responsive } from "./utils/Responsive";

class Game {
  private app: Application;
  private sceneManager: SceneManager;

  constructor() {
    const { width, height } = Responsive.getCanvasSize();
    this.app = new Application({
      width,
      height,
      backgroundColor: Colors.BG_DARK,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });
    this.sceneManager = new SceneManager(this.app);
    this.setupResize();
  }

  async init() {
    const appElement = document.querySelector("#app");
    if (appElement) {
      appElement.appendChild(this.app.view as HTMLCanvasElement);

      // Force initial resize on mobile
      if (Responsive.isMobile()) {
        const { width, height } = Responsive.getCanvasSize();
        this.app.renderer.resize(width, height);
        (this.app.view as HTMLCanvasElement).style.width = "100%";
        (this.app.view as HTMLCanvasElement).style.height = "100%";
      }
    }

    // Start with main menu
    this.sceneManager.changeScene(new MainMenuScene(this.sceneManager));
  }

  private setupResize(): void {
    let resizeTimeout: number;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(() => {
        const { width, height } = Responsive.getCanvasSize();
        this.app.renderer.resize(width, height);

        if (Responsive.isMobile()) {
          (this.app.view as HTMLCanvasElement).style.width = "100%";
          (this.app.view as HTMLCanvasElement).style.height = "100%";
        } else {
          (this.app.view as HTMLCanvasElement).style.width = "";
          (this.app.view as HTMLCanvasElement).style.height = "";
        }

        // Notify current scene to reposition elements
        const currentScene = this.sceneManager.getCurrentScene();
        if (currentScene && (currentScene as any).onResize) {
          (currentScene as any).onResize();
        }
      }, 100);
    });
  }
}

const game = new Game();
game.init();
