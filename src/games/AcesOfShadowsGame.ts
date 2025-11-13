import { Texture, Application, Container } from "pixi.js";
import { Card } from "./Card";
import { CardStack } from "./CardStack";

export class AcesOfShadowsGame {
  private cards: Card[] = [];
  private stacks: CardStack[] = [];
  private readonly TOTAL_CARDS = 144;
  private readonly NUM_STACKS = 5; // 1 main stack + 4 destination stacks
  private readonly CARD_OFFSET_Y = 2; // Vertical offset to show stacking
  private readonly STACK_SPACING = 200;
  private animationInterval: number | null = null;
  private cardTexture: Texture;
  private currentDestStackIndex = 1; // Start with stack 1 (skip main stack at index 0)

  constructor(app: Application) {
    // Load card texture from assets (works with any base path in dev and production)
    this.cardTexture = Texture.from(
      import.meta.env.BASE_URL + "assets/card.png"
    );
  }

  public createCards(
    container: Container,
    centerX: number,
    centerY: number
  ): void {
    // Initialize 5 stacks (1 main + 4 destination)
    const totalWidth = (this.NUM_STACKS - 1) * this.STACK_SPACING;
    const startX = centerX - totalWidth / 2;
    const baseY = centerY - (this.TOTAL_CARDS * this.CARD_OFFSET_Y) / 2;

    for (let i = 0; i < this.NUM_STACKS; i++) {
      const stackX = startX + i * this.STACK_SPACING;
      const stack = new CardStack(stackX, baseY, this.CARD_OFFSET_Y);
      this.stacks.push(stack);
    }

    // Create 144 cards and add them ALL to the main stack (stack 0)
    for (let i = 0; i < this.TOTAL_CARDS; i++) {
      const card = new Card(this.cardTexture);
      const position = this.stacks[0].getNextCardPosition();
      card.setPosition(position.x, position.y);
      card.setRotation(Math.random() * 0.2 - 0.1); // Slight random rotation

      container.addChild(card.sprite);
      this.cards.push(card);
      this.stacks[0].addCard(card);
    }

    // Start the animation cycle
    this.startAnimationCycle();
  }

  private startAnimationCycle(): void {
    // Every 1 second, move the top card from a stack to another stack
    this.animationInterval = window.setInterval(() => {
      this.moveTopCard();
    }, 1000);
  }

  private moveTopCard(): void {
    // Always take from the main stack (stack 0)
    const sourceStackIndex = 0;

    // If main stack is empty, stop
    if (this.stacks[sourceStackIndex].isEmpty()) {
      console.log("Main stack is empty - stopping");
      return;
    }

    // Current destination stack (cycles through 1, 2, 3, 4)
    const destStackIndex = this.currentDestStackIndex;

    console.log(
      `Moving card from main stack (${this.stacks[
        sourceStackIndex
      ].getCardCount()} cards) to stack ${destStackIndex} (${this.stacks[
        destStackIndex
      ].getCardCount()} cards)`
    );

    // Get the top card from the main stack
    const card = this.stacks[sourceStackIndex].removeTopCard();
    if (!card) {
      console.log("No card returned from removeTopCard");
      return;
    }

    // Get the destination position BEFORE adding the card
    const destPosition = this.stacks[destStackIndex].getNextCardPosition();

    // Now add card to destination stack
    this.stacks[destStackIndex].addCard(card);

    // Animate the card movement
    card.moveTo(destPosition.x, destPosition.y, Math.random() * 0.2 - 0.1, 2);

    // Move to next destination stack (1 -> 2 -> 3 -> 4 -> 1 -> ...)
    this.currentDestStackIndex++;
    if (this.currentDestStackIndex >= this.NUM_STACKS) {
      this.currentDestStackIndex = 1; // Reset to first destination stack
    }
  }

  public destroy(): void {
    // Stop the animation interval
    if (this.animationInterval !== null) {
      clearInterval(this.animationInterval);
      this.animationInterval = null;
    }

    // Destroy all cards
    this.cards.forEach((card) => card.destroy());

    this.cards = [];
    this.stacks = [];
  }
}
