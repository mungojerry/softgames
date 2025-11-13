import { Scene } from "./Scene";
import { SceneManager } from "./SceneManager";
import { MainMenuScene } from "./MainMenuScene";
import { Colors } from "../styles/Colors";
import { SceneUI } from "../ui/SceneUI";
import { MagicWordsGame } from "../games/magicwords/MagicWordsGame";

export class MagicWordsScene extends Scene {
  private game: MagicWordsGame | null = null;

  constructor(private sceneManager: SceneManager) {
    super();
  }

  onEnter(): void {
    const ui = new SceneUI(this, this.sceneManager);
    ui.addBackground(Colors.BG_MAGIC);
    ui.addTitle("MAGIC WORDS", 100);
    ui.addBackButton(Colors.BTN_MAGIC, () =>
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

  private async startGame(): Promise<void> {
    const width = this.sceneManager.getAppWidth();
    const height = this.sceneManager.getAppHeight();

    // Create game with phone-like dimensions
    const gameWidth = Math.min(500, width - 40);
    const gameHeight = height - 200; // Leave space for title and back button

    // Optional: Pass an endpoint URL to load dialogue data from
    // Example: 'https://api.example.com/dialogue'
    // If not provided, uses hardcoded data

    // Simulate network error by using an invalid endpoint
    // Set to undefined or valid endpoint to see normal behavior
    const simulateNetworkError = false;
    const dataEndpoint = simulateNetworkError
      ? "https://invalid-endpoint-that-does-not-exist.com/error"
      : "https://private-624120-softgamesassignment.apiary-mock.com/v2/magicwords";

    this.game = new MagicWordsGame(gameWidth, gameHeight, dataEndpoint);

    const x = (width - gameWidth) / 2;
    const y = 150; // Below title

    await this.game.start(this, x, y);
  }
}
