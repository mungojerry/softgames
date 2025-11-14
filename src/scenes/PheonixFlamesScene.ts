import { Scene } from "./Scene";
import { SceneManager } from "./SceneManager";
import { MainMenuScene } from "./MainMenuScene";
import { SceneConfig } from "./SceneConfig";
import { Colors } from "../styles/Colors";
import { SceneUI } from "../ui/SceneUI";
import { PhoenixFlamesGame } from "../games/phoenixflames/PhoenixFlamesGame";

export class PhoenixFlamesScene extends Scene {
  private game: PhoenixFlamesGame | null = null;

  constructor(private sceneManager: SceneManager) {
    super();
  }

  onEnter(): void {
    const ui = new SceneUI(this, this.sceneManager);
    ui.addBackground(Colors.BG_FLAMES);
    ui.addBackButton(Colors.BTN_FLAMES, () =>
      this.sceneManager.changeScene(new MainMenuScene(this.sceneManager))
    );
    this.startGame();
  }

  onExit(): void {
    if (this.game) {
      this.game.destroy();
      this.game = null;
    }
    this.removeChildren();
  }
  update(_delta: number): void {
    // GSAP handles animation, no manual update needed
  }
  onResize(): void {
    this.onExit();
    this.onEnter();
  }

  private startGame(): void {
    const width = this.sceneManager.getAppWidth();
    const height = this.sceneManager.getAppHeight();

    const gameWidth = width;
    const gameHeight = height - SceneConfig.PHOENIX_HEIGHT_OFFSET;

    this.game = new PhoenixFlamesGame(gameWidth, gameHeight);

    this.game.start(
      this,
      SceneConfig.PHOENIX_START_X,
      SceneConfig.PHOENIX_START_Y
    );
  }
}
