import { Container, Graphics, Text, Sprite, Texture } from "pixi.js";
import gsap from "gsap";

export class MessageBubble extends Container {
  private bubble: Graphics;
  private textContainer: Container;
  private avatar: Sprite | Container | null = null;
  private readonly MAX_WIDTH = 400;
  private readonly PADDING = 15;
  private readonly AVATAR_SIZE = 40;
  private readonly BUBBLE_RADIUS = 15;

  constructor(
    private message: string,
    private isLeft: boolean,
    private avatarTexture?: Texture,
    private emojiTextures?: Map<string, Texture>
  ) {
    super();
    this.bubble = new Graphics();
    this.textContainer = new Container();
    // Validate and sanitize message
    this.message = message?.trim() || "[No message]";
    this.create();
  }

  private createAvatar(): Sprite | Container {
    if (this.avatarTexture && this.avatarTexture.valid) {
      // Use provided avatar texture
      try {
        const avatar = new Sprite(this.avatarTexture);
        avatar.width = this.AVATAR_SIZE;
        avatar.height = this.AVATAR_SIZE;
        avatar.anchor.set(0.5);
        return avatar;
      } catch (error) {
        console.warn("Error creating avatar sprite:", error);
      }
    }

    // Create unknown avatar - circle with question mark
    const avatarContainer = new Container();

    // Draw circle background
    const circle = new Graphics();
    circle.beginFill(0xcccccc);
    circle.drawCircle(0, 0, this.AVATAR_SIZE / 2);
    circle.endFill();
    avatarContainer.addChild(circle);

    // Add question mark
    const questionMark = new Text("?", {
      fontFamily: "Arial",
      fontSize: 24,
      fill: 0x666666,
      fontWeight: "bold",
    });
    questionMark.anchor.set(0.5);
    questionMark.x = 0;
    questionMark.y = 0;
    avatarContainer.addChild(questionMark);

    return avatarContainer;
  }

  private create(): void {
    // Create avatar - use provided texture or fallback to unknown avatar
    this.avatar = this.createAvatar();
    if (this.avatar) {
      if (this.isLeft) {
        this.avatar.x = this.AVATAR_SIZE / 2;
      }
      this.addChild(this.avatar);
    }

    // Parse message and create text with emojis
    this.createMessageContent();

    // Draw bubble background
    this.drawBubble();

    // Position elements
    this.positionElements();

    // Initial animation state (will be animated in later)
    this.alpha = 0;
  }

  private createMessageContent(): void {
    const parts = this.parseMessage(this.message);
    const layout = {
      currentX: this.PADDING,
      currentY: this.PADDING,
      maxWidth: this.MAX_WIDTH - this.PADDING * 2,
      fontSize: 16,
      emojiSize: 20,
      lineSpacing: 5,
      emojiSpacing: 4,
    };

    parts.forEach((part) => {
      if (part.type === "text" && part.content) {
        this.addTextPart(part.content, layout);
      } else if (part.type === "emoji") {
        this.addEmojiPart(part.content, layout);
      }
    });

    this.addChild(this.textContainer);
  }

  private addTextPart(content: string, layout: any): void {
    const words = content.split(" ").filter((word) => word.length > 0);

    words.forEach((word, wordIndex) => {
      const text = new Text(word + (wordIndex < words.length - 1 ? " " : ""), {
        fontFamily: "Arial",
        fontSize: layout.fontSize,
        fill: this.isLeft ? 0x000000 : 0xffffff,
      });

      if (
        this.shouldWrapToNewLine(text.width, layout.currentX, layout.maxWidth)
      ) {
        layout.currentY += layout.fontSize + layout.lineSpacing;
        layout.currentX = this.PADDING;
      }

      text.x = layout.currentX;
      text.y = layout.currentY;
      this.textContainer.addChild(text);
      layout.currentX += text.width;
    });
  }

  private addEmojiPart(emojiName: string, layout: any): void {
    const emojiTexture = this.emojiTextures?.get(emojiName);

    if (emojiTexture?.valid) {
      this.addEmojiSprite(emojiTexture, layout);
    } else {
      this.addEmojiPlaceholder(layout);
    }
  }

  private addEmojiSprite(texture: Texture, layout: any): void {
    try {
      const totalWidth = layout.emojiSpacing + layout.emojiSize;

      if (
        this.shouldWrapToNewLine(totalWidth, layout.currentX, layout.maxWidth)
      ) {
        layout.currentY += layout.fontSize + layout.lineSpacing;
        layout.currentX = this.PADDING;
      } else if (layout.currentX > this.PADDING) {
        layout.currentX += layout.emojiSpacing;
      }

      const emoji = new Sprite(texture);
      emoji.width = layout.emojiSize;
      emoji.height = layout.emojiSize;
      emoji.x = layout.currentX;
      emoji.y = layout.currentY;
      this.textContainer.addChild(emoji);
      layout.currentX += layout.emojiSize + layout.emojiSpacing;
    } catch (error) {
      console.warn(`Error creating emoji sprite:`, error);
      this.addEmojiPlaceholder(layout);
    }
  }

  private addEmojiPlaceholder(layout: any): void {
    const totalWidth = layout.emojiSpacing + layout.emojiSize;

    if (
      this.shouldWrapToNewLine(totalWidth, layout.currentX, layout.maxWidth)
    ) {
      layout.currentY += layout.fontSize + layout.lineSpacing;
      layout.currentX = this.PADDING;
    } else if (layout.currentX > this.PADDING) {
      layout.currentX += layout.emojiSpacing;
    }

    const placeholder = this.createEmojiPlaceholderGraphics(layout.emojiSize);
    placeholder.x = layout.currentX;
    placeholder.y = layout.currentY;
    this.textContainer.addChild(placeholder);
    layout.currentX += layout.emojiSize + layout.emojiSpacing;
  }

  private createEmojiPlaceholderGraphics(size: number): Container {
    const container = new Container();

    const circle = new Graphics();
    circle.beginFill(this.isLeft ? 0xcccccc : 0x666666);
    circle.drawCircle(size / 2, size / 2, size / 2);
    circle.endFill();
    container.addChild(circle);

    const label = new Text("?", {
      fontFamily: "Arial",
      fontSize: size * 0.6,
      fill: this.isLeft ? 0x666666 : 0xcccccc,
      fontWeight: "bold",
    });
    label.anchor.set(0.5);
    label.x = size / 2;
    label.y = size / 2;
    container.addChild(label);

    return container;
  }

  private shouldWrapToNewLine(
    elementWidth: number,
    currentX: number,
    maxWidth: number
  ): boolean {
    return (
      currentX + elementWidth > this.PADDING + maxWidth &&
      currentX > this.PADDING
    );
  }

  private parseMessage(
    message: string
  ): Array<{ type: "text" | "emoji"; content: string }> {
    const parts: Array<{ type: "text" | "emoji"; content: string }> = [];
    const emojiRegex = /\{(\w+)\}/g;
    let lastIndex = 0;
    let match;

    while ((match = emojiRegex.exec(message)) !== null) {
      // Add text before emoji
      if (match.index > lastIndex) {
        parts.push({
          type: "text",
          content: message.substring(lastIndex, match.index),
        });
      }
      // Add emoji
      parts.push({
        type: "emoji",
        content: match[1],
      });
      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < message.length) {
      parts.push({
        type: "text",
        content: message.substring(lastIndex),
      });
    }

    return parts;
  }

  private drawBubble(): void {
    const bounds = this.textContainer.getLocalBounds();
    // Ensure minimum bubble size even if content is empty
    const width = Math.max(
      Math.min(bounds.width + this.PADDING * 2, this.MAX_WIDTH),
      this.PADDING * 4
    );
    const height = Math.max(bounds.height + this.PADDING * 2, this.PADDING * 3);

    this.bubble.clear();
    this.bubble.beginFill(this.isLeft ? 0xe8e8e8 : 0x0084ff);
    this.bubble.drawRoundedRect(0, 0, width, height, this.BUBBLE_RADIUS);
    this.bubble.endFill();

    this.addChildAt(this.bubble, 0);
  }

  private positionElements(): void {
    const avatarOffset = this.avatar ? this.AVATAR_SIZE + 10 : 0;

    if (this.isLeft) {
      this.bubble.x = avatarOffset;
      this.textContainer.x = avatarOffset;
      if (this.avatar) {
        this.avatar.y = this.bubble.height / 2;
      }
    } else {
      if (this.avatar) {
        this.avatar.x = this.bubble.width + avatarOffset;
        this.avatar.y = this.bubble.height / 2;
      }
    }
  }

  public animateIn(delay: number = 0): void {
    const targetY = this.y;

    this.y = targetY + 20;

    gsap.to(this, {
      alpha: 1,
      y: targetY,
      duration: 0.4,
      delay,
      ease: "back.out(1.7)",
    });
  }

  public getHeight(): number {
    return this.bubble.height;
  }

  public destroy(): void {
    gsap.killTweensOf(this);

    if (this.avatar) {
      if (this.avatar instanceof Sprite) {
        // Don't destroy shared texture, just the sprite
        this.avatar.destroy({ texture: false, baseTexture: false });
      } else {
        this.avatar.destroy({ children: true });
      }
      this.avatar = null;
    }

    super.destroy({ children: true });
  }
}
