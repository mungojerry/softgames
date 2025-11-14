import { Scene } from "./Scene";
import { SceneManager } from "./SceneManager";
import { MainMenuScene } from "./MainMenuScene";
import { SceneConfig } from "./SceneConfig";
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
    ui.addBackButton(Colors.BTN_MAGIC, () =>
      this.sceneManager.changeScene(new MainMenuScene(this.sceneManager))
    );
    // Properly handle async startGame
    this.startGame().catch((error) => {
      console.error("Failed to start Magic Words game:", error);
    });
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

  onResize(): void {
    // Restart the scene on resize
    this.onExit();
    this.onEnter();
  }

  private async startGame(): Promise<void> {
    const width = this.sceneManager.getAppWidth();
    const height = this.sceneManager.getAppHeight();

    // Create game with phone-like dimensions
    const gameWidth = Math.min(
      SceneConfig.MAGIC_WORDS_MAX_WIDTH,
      width - SceneConfig.MAGIC_WORDS_PADDING
    );
    const gameHeight = height - SceneConfig.MAGIC_WORDS_HEIGHT_OFFSET;

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

    await this.game.start(
      this,
      (width - gameWidth) / 2,
      SceneConfig.MAGIC_WORDS_START_Y
    );
  }
}
