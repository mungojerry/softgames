import { Container } from "pixi.js";

export abstract class Scene extends Container {
  abstract update(delta: number): void;
  abstract onEnter(): void;
  abstract onExit(): void;
}
