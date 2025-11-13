import { Application } from "pixi.js";
import { SceneManager } from "./scenes/SceneManager";
import { MainMenuScene } from "./scenes/MainMenuScene";
import { Colors } from "./styles/Colors";

class Game {
  private app: Application;
  private sceneManager: SceneManager;

  constructor() {
    this.app = new Application({
      width: 1280,
      height: 720,
      backgroundColor: Colors.BG_DARK,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });
    this.sceneManager = new SceneManager(this.app);
  }

  async init() {
    const appElement = document.querySelector("#app");
    if (appElement) {
      appElement.appendChild(this.app.view as HTMLCanvasElement);
    }

    // Start with main menu
    this.sceneManager.changeScene(new MainMenuScene(this.sceneManager));
  }
}

const game = new Game();
game.init();
