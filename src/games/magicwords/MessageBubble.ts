import { Container, Graphics, Text, Sprite, Texture } from "pixi.js";
import { MessageBubbleConfig } from "./MessageBubbleConfig";
import gsap from "gsap";

export class MessageBubble extends Container {
  private bubble: Graphics;
  private textContainer: Container;
  private avatar: Sprite | Container | null = null;
  private readonly MAX_WIDTH: number;

  constructor(
    private message: string,
    private isLeft: boolean,
    maxWidth: number = MessageBubbleConfig.DEFAULT_MAX_WIDTH,
    private avatarTexture?: Texture,
    private emojiTextures?: Map<string, Texture>
  ) {
    super();
    this.MAX_WIDTH = maxWidth;
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
        avatar.width = MessageBubbleConfig.AVATAR_SIZE;
        avatar.height = MessageBubbleConfig.AVATAR_SIZE;
        avatar.anchor.set(MessageBubbleConfig.AVATAR_ANCHOR);
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
    circle.drawCircle(0, 0, MessageBubbleConfig.AVATAR_SIZE / 2);
    circle.endFill();
    avatarContainer.addChild(circle);

    // Add question mark
    const questionMark = new Text("?", {
      fontFamily: "Arial",
      fontSize: MessageBubbleConfig.UNKNOWN_AVATAR_QUESTION_SIZE,
      fill: 0x666666,
      fontWeight: "bold",
    });
    questionMark.anchor.set(MessageBubbleConfig.AVATAR_ANCHOR);
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
        this.avatar.x = MessageBubbleConfig.AVATAR_SIZE / 2;
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
    this.alpha = MessageBubbleConfig.INITIAL_ALPHA;
  }

  private createMessageContent(): void {
    const parts = this.parseMessage(this.message);
    const layout = {
      currentX: MessageBubbleConfig.PADDING,
      currentY: MessageBubbleConfig.PADDING,
      maxWidth: this.MAX_WIDTH - MessageBubbleConfig.PADDING * 2,
      fontSize: MessageBubbleConfig.TEXT_FONT_SIZE,
      emojiSize: MessageBubbleConfig.EMOJI_SIZE,
      lineSpacing: MessageBubbleConfig.LINE_SPACING,
      emojiSpacing: MessageBubbleConfig.EMOJI_SPACING,
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
        layout.currentX = MessageBubbleConfig.PADDING;
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
        layout.currentX = MessageBubbleConfig.PADDING;
      } else if (layout.currentX > MessageBubbleConfig.PADDING) {
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
      layout.currentX = MessageBubbleConfig.PADDING;
    } else if (layout.currentX > MessageBubbleConfig.PADDING) {
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
      fontSize: size * MessageBubbleConfig.EMOJI_PLACEHOLDER_SIZE_RATIO,
      fill: this.isLeft ? 0x666666 : 0xcccccc,
      fontWeight: "bold",
    });
    label.anchor.set(MessageBubbleConfig.AVATAR_ANCHOR);
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
      currentX + elementWidth > MessageBubbleConfig.PADDING + maxWidth &&
      currentX > MessageBubbleConfig.PADDING
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
      Math.min(bounds.width + MessageBubbleConfig.PADDING * 2, this.MAX_WIDTH),
      MessageBubbleConfig.PADDING *
        MessageBubbleConfig.MIN_BUBBLE_WIDTH_MULTIPLIER
    );
    const height = Math.max(
      bounds.height + MessageBubbleConfig.PADDING * 2,
      MessageBubbleConfig.PADDING *
        MessageBubbleConfig.MIN_BUBBLE_HEIGHT_MULTIPLIER
    );

    this.bubble.clear();
    this.bubble.beginFill(this.isLeft ? 0xe8e8e8 : 0x0084ff);
    this.bubble.drawRoundedRect(
      0,
      0,
      width,
      height,
      MessageBubbleConfig.BUBBLE_RADIUS
    );
    this.bubble.endFill();

    this.addChildAt(this.bubble, 0);
  }

  private positionElements(): void {
    const avatarOffset = this.avatar
      ? MessageBubbleConfig.AVATAR_SIZE + MessageBubbleConfig.AVATAR_OFFSET
      : 0;

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

    this.y = targetY + MessageBubbleConfig.ANIMATION_Y_OFFSET;

    gsap.to(this, {
      alpha: MessageBubbleConfig.TARGET_ALPHA,
      y: targetY,
      duration: MessageBubbleConfig.ANIMATION_DURATION,
      delay,
      ease: MessageBubbleConfig.ANIMATION_EASE,
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
