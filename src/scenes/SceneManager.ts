import { Application } from "pixi.js";
import { Scene } from "./Scene";

export class SceneManager {
  private app: Application;
  private currentScene: Scene | null = null;

  constructor(app: Application) {
    this.app = app;
    this.app.ticker.add((delta) => this.update(delta));
  }

  changeScene(newScene: Scene): void {
    if (this.currentScene) {
      this.currentScene.onExit();
      this.app.stage.removeChild(this.currentScene);
    }

    this.currentScene = newScene;
    this.app.stage.addChild(this.currentScene);
    this.currentScene.onEnter();
  }

  private update(delta: number): void {
    if (this.currentScene) {
      this.currentScene.update(delta);
    }
  }

  getAppWidth(): number {
    return this.app.screen.width;
  }

  getAppHeight(): number {
    return this.app.screen.height;
  }
}
