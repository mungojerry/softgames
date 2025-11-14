import { Texture, Application, Container } from "pixi.js";
import { Card } from "./Card";
import { CardStack } from "./CardStack";
import { Responsive } from "../../utils/Responsive";
import { AceOfShadowsConfig } from "./AceOfShadowsConfig";

export class AceOfShadowsGame {
  private cards: Card[] = [];
  private stacks: CardStack[] = [];
  private animationInterval: number | null = null;
  private cardTexture: Texture;
  private currentDestStackIndex = AceOfShadowsConfig.FIRST_DEST_STACK_INDEX;
  private container: Container | null = null;
  private appWidth: number = 0;
  private appHeight: number = 0;

  constructor(app: Application) {
    if (!app) {
      throw new Error("Application instance is required");
    }

    try {
      const basePath = import.meta.env.BASE_URL || "/softgames/";
      this.cardTexture = Texture.from(`${basePath}assets/card.png`);

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
      const topY = height * AceOfShadowsConfig.MOBILE_TOP_Y_RATIO;
      const bottomRowY = height * AceOfShadowsConfig.MOBILE_BOTTOM_ROW_Y_RATIO;
      const bottomRow2Y =
        height * AceOfShadowsConfig.MOBILE_BOTTOM_ROW2_Y_RATIO;
      const gridSpacing = width * AceOfShadowsConfig.MOBILE_GRID_SPACING_RATIO;

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
    const spacing = AceOfShadowsConfig.DESKTOP_STACK_SPACING;
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
      AceOfShadowsConfig.NUM_STACKS,
      this.appWidth,
      this.appHeight
    );
    const cardScale = Responsive.isMobile()
      ? AceOfShadowsConfig.MOBILE_CARD_SCALE
      : AceOfShadowsConfig.DESKTOP_CARD_SCALE;

    for (let i = 0; i < AceOfShadowsConfig.NUM_STACKS; i++) {
      const pos = layout.positions[i];
      const stack = new CardStack(
        pos.x,
        pos.y - AceOfShadowsConfig.TOTAL_CARDS / 2
      );
      this.stacks.push(stack);
    }
    for (let i = 0; i < AceOfShadowsConfig.TOTAL_CARDS; i++) {
      const card = new Card(this.cardTexture, cardScale);
      const position =
        this.stacks[AceOfShadowsConfig.MAIN_STACK_INDEX].getNextCardPosition();
      card.setPosition(position.x, position.y);
      card.setRotation(
        Math.random() * AceOfShadowsConfig.CARD_ROTATION_VARIANCE -
          AceOfShadowsConfig.CARD_ROTATION_VARIANCE / 2
      );

      container.addChild(card.sprite);
      this.cards.push(card);
      this.stacks[AceOfShadowsConfig.MAIN_STACK_INDEX].addCard(card);
    }

    this.start();
  }

  private start(): void {
    this.animationInterval = window.setInterval(() => {
      this.moveTopCard();
    }, AceOfShadowsConfig.CARD_MOVE_INTERVAL_MS);
  }

  private moveTopCard(): void {
    const mainStack = this.stacks[AceOfShadowsConfig.MAIN_STACK_INDEX];
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

    card.moveTo(
      destPosition.x,
      destPosition.y,
      Math.random() * AceOfShadowsConfig.CARD_ROTATION_VARIANCE -
        AceOfShadowsConfig.CARD_ROTATION_VARIANCE / 2,
      AceOfShadowsConfig.CARD_MOVE_DURATION_SEC
    );

    this.currentDestStackIndex++;
    if (this.currentDestStackIndex >= AceOfShadowsConfig.NUM_STACKS) {
      this.currentDestStackIndex = AceOfShadowsConfig.FIRST_DEST_STACK_INDEX;
    }
  }

  public reposition(width: number, height: number): void {
    if (!this.container) return;

    this.appWidth = width;
    this.appHeight = height;

    const layout = this.getCardStackLayout(
      AceOfShadowsConfig.NUM_STACKS,
      this.appWidth,
      this.appHeight
    );
    const cardScale = Responsive.isMobile()
      ? AceOfShadowsConfig.MOBILE_CARD_SCALE
      : AceOfShadowsConfig.DESKTOP_CARD_SCALE;

    for (let i = 0; i < AceOfShadowsConfig.NUM_STACKS; i++) {
      const pos = layout.positions[i];
      const stack = this.stacks[i];
      stack.setPosition(pos.x, pos.y - AceOfShadowsConfig.TOTAL_CARDS / 2);

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
