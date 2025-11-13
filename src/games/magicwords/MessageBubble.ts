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

    let currentX = this.PADDING;
    let currentY = this.PADDING;
    const maxWidth = this.MAX_WIDTH - this.PADDING * 2;
    const fontSize = 16;
    const emojiSize = 20;
    const lineSpacing = 5;

    parts.forEach((part, index) => {
      if (part.type === "text" && part.content) {
        // Split text into words for manual wrapping
        const words = part.content.split(" ").filter((word) => word.length > 0);

        words.forEach((word, wordIndex) => {
          const text = new Text(
            word + (wordIndex < words.length - 1 ? " " : ""),
            {
              fontFamily: "Arial",
              fontSize: fontSize,
              fill: this.isLeft ? 0x000000 : 0xffffff,
            }
          );

          // Check if we need to wrap to next line
          if (
            currentX + text.width > this.PADDING + maxWidth &&
            currentX > this.PADDING
          ) {
            currentY += fontSize + lineSpacing;
            currentX = this.PADDING;
          }

          text.x = currentX;
          text.y = currentY;
          this.textContainer.addChild(text);
          currentX += text.width;
        });
      } else if (part.type === "emoji") {
        const emojiTexture = this.emojiTextures?.get(part.content);

        // Try to use emoji texture if available and valid
        if (emojiTexture && emojiTexture.valid) {
          try {
            // Add spacing before emoji
            const emojiSpacing = 4;

            // Check if emoji needs to wrap
            if (
              currentX + emojiSpacing + emojiSize > this.PADDING + maxWidth &&
              currentX > this.PADDING
            ) {
              currentY += fontSize + lineSpacing;
              currentX = this.PADDING;
            } else if (currentX > this.PADDING) {
              // Add spacing before emoji if not at start of line
              currentX += emojiSpacing;
            }

            const emoji = new Sprite(emojiTexture);
            emoji.width = emojiSize;
            emoji.height = emojiSize;
            emoji.x = currentX;
            emoji.y = currentY;
            this.textContainer.addChild(emoji);
            currentX += emojiSize + emojiSpacing; // Add spacing after emoji
          } catch (error) {
            console.warn(
              `Error creating emoji sprite for '${part.content}':`,
              error
            );
            // Fall through to text fallback below
          }
        } else {
          // Fallback: show emoji name as text if texture not found
          const fallbackText = new Text(`[${part.content}]`, {
            fontFamily: "Arial",
            fontSize: fontSize - 2,
            fill: this.isLeft ? 0x666666 : 0xcccccc,
            fontStyle: "italic",
          });

          const emojiSpacing = 4;

          // Check if fallback text needs to wrap
          if (
            currentX + emojiSpacing + fallbackText.width >
              this.PADDING + maxWidth &&
            currentX > this.PADDING
          ) {
            currentY += fontSize + lineSpacing;
            currentX = this.PADDING;
          } else if (currentX > this.PADDING) {
            // Add spacing before emoji if not at start of line
            currentX += emojiSpacing;
          }

          fallbackText.x = currentX;
          fallbackText.y = currentY;
          this.textContainer.addChild(fallbackText);
          currentX += fallbackText.width + emojiSpacing;
        }
      }
    });

    this.addChild(this.textContainer);
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
      // Right align
      if (this.avatar) {
        this.avatar.x = this.bubble.width + avatarOffset;
        this.avatar.y = this.bubble.height / 2;
      }
    }
  }

  public animateIn(delay: number = 0): void {
    // Store the target position
    const targetY = this.y;

    // Start position (slightly below)
    this.y = targetY + 20;

    // Animate to target position
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
    super.destroy({ children: true });
  }
}
