import { Application } from "pixi.js";
import { Scene } from "./Scene";
import { FPSCounter } from "../utils/FPSCounter";
import { SceneTransition, TransitionType } from "../utils/SceneTransition";

export class SceneManager {
  private app: Application;
  private currentScene: Scene | null = null;
  private nextScene: Scene | null = null;
  private fpsCounter: FPSCounter;
  private transition: SceneTransition;
  private transitions: TransitionType[] = [
    "fade",
    "slideLeft",
    "slideRight",
    "wipe",
    "circle",
    "softWipe",
  ];

  constructor(app: Application) {
    this.app = app;
    this.app.ticker.add((delta) => this.update(delta));

    // Add transition overlay
    this.transition = new SceneTransition(
      this.app.screen.width,
      this.app.screen.height
    );
    this.transition.visible = false;
    this.app.stage.addChild(this.transition);

    // Add FPS counter
    this.fpsCounter = new FPSCounter();
    this.app.stage.addChild(this.fpsCounter);
  }

  changeScene(newScene: Scene, transitionType?: TransitionType): void {
    // Prevent scene change during active transition
    if (this.nextScene !== null) {
      console.warn("Scene change already in progress, ignoring new request");
      return;
    }

    // Store the next scene
    this.nextScene = newScene;

    // Pick random transition if not specified
    const type =
      transitionType ||
      this.transitions[Math.floor(Math.random() * this.transitions.length)];

    // Start transition
    this.transition.start(type, () => {
      // This callback runs at the halfway point of the transition
      if (this.currentScene) {
        this.currentScene.onExit();
        this.app.stage.removeChild(this.currentScene);
      }

      this.currentScene = this.nextScene;
      this.nextScene = null;

      if (this.currentScene) {
        this.app.stage.addChild(this.currentScene);
        this.currentScene.onEnter();

        // Keep transition and FPS counter on top
        this.app.stage.setChildIndex(
          this.transition,
          this.app.stage.children.length - 1
        );
        this.app.stage.setChildIndex(
          this.fpsCounter,
          this.app.stage.children.length - 1
        );
      }
    });
  }

  private update(delta: number): void {
    if (this.currentScene) {
      this.currentScene.update(delta);
    }
    this.transition.update(delta);
    this.fpsCounter.update();
  }

  getAppWidth(): number {
    return this.app.screen.width;
  }

  getAppHeight(): number {
    return this.app.screen.height;
  }

  getApp(): Application {
    return this.app;
  }

  getCurrentScene(): Scene | null {
    return this.currentScene;
  }
}
