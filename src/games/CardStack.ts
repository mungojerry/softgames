import { Card } from "./Card";

export class CardStack {
  private cards: Card[] = [];
  private x: number;
  private baseY: number;
  private readonly cardOffsetY: number;

  constructor(x: number, baseY: number, cardOffsetY: number = 2) {
    this.x = x;
    this.baseY = baseY;
    this.cardOffsetY = cardOffsetY;
  }

  public addCard(card: Card): void {
    this.cards.push(card);
  }

  public removeTopCard(): Card | null {
    return this.cards.pop() || null;
  }

  public getTopCard(): Card | null {
    return this.cards[this.cards.length - 1] || null;
  }

  public getCardCount(): number {
    return this.cards.length;
  }

  public isEmpty(): boolean {
    return this.cards.length === 0;
  }

  public getNextCardPosition(): { x: number; y: number } {
    const cardIndex = this.cards.length;
    // Add small random variation to x position
    const randomX = 0; // Math.random() * 20 - 10;
    return {
      x: this.x + randomX,
      y: this.baseY, // + cardIndex * this.cardOffsetY,
    };
  }

  public getCurrentTopCardPosition(): { x: number; y: number } {
    const cardIndex = Math.max(0, this.cards.length - 1);
    return {
      x: this.x,
      y: this.baseY + cardIndex * this.cardOffsetY,
    };
  }

  public getPosition(): { x: number; y: number } {
    return { x: this.x, y: this.baseY };
  }

  public setPosition(x: number, baseY: number): void {
    this.x = x;
    this.baseY = baseY;
  }
}
