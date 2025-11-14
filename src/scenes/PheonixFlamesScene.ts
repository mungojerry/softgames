import { Scene } from "./Scene";
import { SceneManager } from "./SceneManager";
import { MainMenuScene } from "./MainMenuScene";
import { Colors } from "../styles/Colors";
import { SceneUI } from "../ui/SceneUI";
import { PhoenixFlamesGame } from "../games/phoenixflames/PhoenixFlamesGame";

export class PheonixFlamesScene extends Scene {
  private game: PhoenixFlamesGame | null = null;

  constructor(private sceneManager: SceneManager) {
    super();
  }

  onEnter(): void {
    const ui = new SceneUI(this, this.sceneManager);
    ui.addBackground(Colors.BG_FLAMES);
    ui.addTitle("PHOENIX FLAMES", 100);
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

  update(delta: number): void {
    // GSAP handles animation, no manual update needed
  }

  private startGame(): void {
    const width = this.sceneManager.getAppWidth();
    const height = this.sceneManager.getAppHeight();

    // Create game with full screen dimensions
    const gameWidth = width;
    const gameHeight = height - 200; // Leave space for title and back button

    this.game = new PhoenixFlamesGame(gameWidth, gameHeight);

    const x = 0;
    const y = 150; // Below title

    this.game.start(this, x, y);
  }
}
