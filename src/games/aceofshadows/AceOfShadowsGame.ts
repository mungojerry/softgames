import { Texture, Application, Container } from "pixi.js";
import { Card } from "./Card";
import { CardStack } from "./CardStack";

export class AceOfShadowsGame {
  private cards: Card[] = [];
  private stacks: CardStack[] = [];
  private readonly TOTAL_CARDS = 144;
  private readonly NUM_STACKS = 5; // 1 main stack + 4 destination stacks
  private readonly STACK_SPACING = 200;
  private readonly MAIN_STACK_INDEX = 0; // Main stack index
  private animationInterval: number | null = null;
  private cardTexture: Texture;
  private currentDestStackIndex = 1;

  constructor(app: Application) {
    if (!app) {
      throw new Error("Application instance is required");
    }

    try {
      const basePath = import.meta?.env?.BASE_URL || "/";
      this.cardTexture = Texture.from(basePath + "assets/card.png");

      if (!this.cardTexture) {
        throw new Error("Failed to load card texture");
      }
    } catch (error) {
      console.error("Error loading card texture:", error);
      this.cardTexture = Texture.WHITE;
    }
  }

  public createCards(
    container: Container,
    centerX: number,
    centerY: number
  ): void {
    const totalWidth = (this.NUM_STACKS - 1) * this.STACK_SPACING;
    const startX = centerX - totalWidth / 2;
    const baseY = centerY - this.TOTAL_CARDS / 2;

    for (let i = 0; i < this.NUM_STACKS; i++) {
      const stackX = startX + i * this.STACK_SPACING;
      const stack = new CardStack(stackX, baseY);
      this.stacks.push(stack);
    }

    // Create 144 cards and add them ALL to the main stack
    for (let i = 0; i < this.TOTAL_CARDS; i++) {
      const card = new Card(this.cardTexture);
      const position = this.stacks[0].getNextCardPosition();
      card.setPosition(position.x, position.y);
      card.setRotation(Math.random() * 0.2 - 0.1); // Slight random rotation

      container.addChild(card.sprite);
      this.cards.push(card);
      this.stacks[0].addCard(card);
    }

    this.start();
  }

  private start(): void {
    this.animationInterval = window.setInterval(() => {
      this.moveTopCard();
    }, 1000);
  }

  private moveTopCard(): void {
    const mainStack = this.stacks[this.MAIN_STACK_INDEX];
    if (mainStack.isEmpty()) {
      return;
    }

    const destStackIndex = this.currentDestStackIndex;

    const card = mainStack.removeTopCard();
    if (!card) {
      return;
    }

    const destPosition = this.stacks[destStackIndex].getNextCardPosition();

    this.stacks[destStackIndex].addCard(card);

    card.moveTo(destPosition.x, destPosition.y, Math.random() * 0.2 - 0.1, 2);

    this.currentDestStackIndex++;
    if (this.currentDestStackIndex >= this.NUM_STACKS) {
      this.currentDestStackIndex = 1; // Reset to first destination stack
    }
  }

  public destroy(): void {
    if (this.animationInterval !== null) {
      clearInterval(this.animationInterval);
      this.animationInterval = null;
    }

    this.cards.forEach((card) => card.destroy());

    this.cards = [];
    this.stacks = [];
  }
}
