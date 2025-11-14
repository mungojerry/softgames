import { Card } from "./Card";

export class CardStack {
  private cards: Card[] = [];
  private x: number;
  private baseY: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.baseY = y;
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
    return {
      x: this.x,
      y: this.baseY,
    };
  }

  public getPosition(): { x: number; y: number } {
    return { x: this.x, y: this.baseY };
  }

  public setPosition(x: number, baseY: number): void {
    this.x = x;
    this.baseY = baseY;
  }

  public getCards(): Card[] {
    return this.cards;
  }

  public getCardPosition(index: number): { x: number; y: number } {
    return {
      x: this.x,
      y: this.baseY,
    };
  }
}
