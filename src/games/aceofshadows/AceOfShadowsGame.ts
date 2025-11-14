import { Texture, Application, Container } from "pixi.js";
import { Card } from "./Card";
import { CardStack } from "./CardStack";
import { Responsive } from "../../utils/Responsive";

export class AceOfShadowsGame {
  private cards: Card[] = [];
  private stacks: CardStack[] = [];
  private readonly TOTAL_CARDS = 144;
  private readonly NUM_STACKS = 5; // 1 main stack + 4 destination stacks
  private readonly MAIN_STACK_INDEX = 0; // Main stack index
  private animationInterval: number | null = null;
  private cardTexture: Texture;
  private currentDestStackIndex = 1;
  private container: Container | null = null;
  private appWidth: number = 0;
  private appHeight: number = 0;

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

  private getCardStackLayout(
    numStacks: number,
    width: number,
    height: number
  ): {
    positions: Array<{ x: number; y: number }>;
  } {
    const isMobile = Responsive.isMobile();
    const centerX = width / 2;

    if (isMobile) {
      // Mobile: 1 main stack at top, then 2x2 grid below
      const positions = [];
      const topY = height * 0.4;
      const bottomRowY = height * 0.55;
      const bottomRow2Y = height * 0.75;
      const gridSpacing = width * 0.35;

      // Main stack at top center
      positions.push({ x: centerX, y: topY });

      // First row of 2 stacks
      positions.push({ x: centerX - gridSpacing / 2, y: bottomRowY });
      positions.push({ x: centerX + gridSpacing / 2, y: bottomRowY });

      // Second row of 2 stacks
      positions.push({ x: centerX - gridSpacing / 2, y: bottomRow2Y });
      positions.push({ x: centerX + gridSpacing / 2, y: bottomRow2Y });

      return { positions };
    }

    // Desktop: horizontal layout
    const spacing = 200;
    const totalWidth = (numStacks - 1) * spacing;
    const startX = centerX - totalWidth / 2;
    const y = height / 2;

    const positions = [];
    for (let i = 0; i < numStacks; i++) {
      positions.push({ x: startX + i * spacing, y });
    }

    return { positions };
  }

  public createCards(
    container: Container,
    centerX: number,
    centerY: number
  ): void {
    this.container = container;
    this.appWidth = container.parent
      ? (container.parent as any).width || centerX * 2
      : centerX * 2;
    this.appHeight = container.parent
      ? (container.parent as any).height || centerY * 2
      : centerY * 2;

    const layout = this.getCardStackLayout(
      this.NUM_STACKS,
      this.appWidth,
      this.appHeight
    );
    const cardScale = Responsive.isMobile() ? 0.4 : 1;

    for (let i = 0; i < this.NUM_STACKS; i++) {
      const pos = layout.positions[i];
      const stack = new CardStack(pos.x, pos.y - this.TOTAL_CARDS / 2);
      this.stacks.push(stack);
    }

    // Create 144 cards and add them ALL to the main stack
    for (let i = 0; i < this.TOTAL_CARDS; i++) {
      const card = new Card(this.cardTexture, cardScale);
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

  public reposition(width: number, height: number): void {
    if (!this.container) return;

    this.appWidth = width;
    this.appHeight = height;

    const layout = this.getCardStackLayout(
      this.NUM_STACKS,
      this.appWidth,
      this.appHeight
    );
    const cardScale = Responsive.isMobile() ? 0.4 : 1;

    for (let i = 0; i < this.NUM_STACKS; i++) {
      const pos = layout.positions[i];
      const stack = this.stacks[i];
      stack.setPosition(pos.x, pos.y - this.TOTAL_CARDS / 2);

      // Update all cards in this stack
      const cards = stack.getCards();
      cards.forEach((card, index) => {
        const cardPos = stack.getCardPosition(index);
        card.setPosition(cardPos.x, cardPos.y);
        card.setScale(cardScale);
      });
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
    this.container = null;
  }
}
