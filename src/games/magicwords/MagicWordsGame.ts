import { Container, Texture, Graphics, Text } from "pixi.js";
import { MessageBubble } from "./MessageBubble";
import { DialogueData, Avatar } from "./types";
import { MagicWordsConfig } from "./MagicWordsConfig";
import gsap from "gsap";

export class MagicWordsGame {
  private messageContainer: Container;
  private scrollContainer: Container;
  private phoneFrame: Graphics;
  private messages: MessageBubble[] = [];
  private data: DialogueData;
  private emojiTextures: Map<string, Texture> = new Map();
  private avatarTextures: Map<string, Texture> = new Map();
  private avatarMap: Map<string, Avatar> = new Map();
  private currentMessageIndex = 0;
  private animationInterval: number | null = null;
  private maskGraphics: Graphics;
  private isDragging = false;
  private lastPointerY = 0;
  private autoScroll = true;
  private loadingContainer: Container;
  private loadingSpinner!: Graphics;
  private loadingText!: Text;
  private dataEndpoint: string;

  constructor(
    private containerWidth: number,
    private containerHeight: number,
    dataEndpoint?: string
  ) {
    this.scrollContainer = new Container();
    this.messageContainer = new Container();
    this.phoneFrame = new Graphics();
    this.loadingContainer = new Container();
    this.scrollContainer.addChild(this.messageContainer);

    this.maskGraphics = new Graphics();
    this.maskGraphics.beginFill(0xffffff);
    this.maskGraphics.drawRect(0, 0, containerWidth, containerHeight);
    this.maskGraphics.endFill();
    this.scrollContainer.mask = this.maskGraphics;

    this.createPhoneFrame();

    this.createLoadingScreen();

    // Set data endpoint (use default hardcoded data if not provided)
    this.dataEndpoint = dataEndpoint || "";

    // Initialize with empty data structure
    this.data = { dialogue: [], emojies: [], avatars: [] };
  }

  private createPhoneFrame(): void {
    const totalWidth = this.containerWidth + MagicWordsConfig.PHONE_BEZEL * 2;
    const totalHeight = this.containerHeight + MagicWordsConfig.PHONE_BEZEL * 2;

    this.phoneFrame.beginFill(0x1a1a1a);
    this.phoneFrame.drawRoundedRect(
      -MagicWordsConfig.PHONE_BEZEL,
      -MagicWordsConfig.PHONE_BEZEL,
      totalWidth,
      totalHeight,
      MagicWordsConfig.PHONE_RADIUS
    );
    this.phoneFrame.endFill();

    this.phoneFrame.beginFill(0xffffff);
    this.phoneFrame.drawRoundedRect(
      0,
      0,
      this.containerWidth,
      this.containerHeight,
      MagicWordsConfig.PHONE_INNER_RADIUS
    );
    this.phoneFrame.endFill();
  }

  private async loadDialogueData(): Promise<DialogueData> {
    if (this.dataEndpoint) {
      try {
        const response = await fetch(this.dataEndpoint);
        if (!response.ok) {
          throw new Error(
            `Failed to fetch dialogue data: ${response.statusText}`
          );
        }
        const data = await response.json();
        if (!this.isValidDialogueData(data)) {
          throw new Error("Invalid dialogue data structure");
        }
        return data as DialogueData;
      } catch (error) {
        console.error("Error loading dialogue data from endpoint:", error);
        throw error; // Propagate error instead of falling back
      }
    }

    // No endpoint provided, return empty data
    throw new Error("No data endpoint configured");
  }

  private isValidDialogueData(data: any): boolean {
    return (
      data &&
      Array.isArray(data.dialogue) &&
      Array.isArray(data.emojies) &&
      Array.isArray(data.avatars)
    );
  }

  private showErrorMessage(): void {
    this.loadingContainer.removeChildren();

    // Error background
    const bg = new Graphics();
    bg.beginFill(0xffffff, MagicWordsConfig.ERROR_BG_ALPHA);
    bg.drawRect(0, 0, this.containerWidth, this.containerHeight);
    bg.endFill();
    this.loadingContainer.addChild(bg);

    // Error icon (red X)
    const errorIcon = new Graphics();
    const iconSize = MagicWordsConfig.ERROR_ICON_SIZE;
    errorIcon.lineStyle(MagicWordsConfig.ERROR_ICON_LINE_WIDTH, 0xff4444);
    errorIcon.moveTo(-iconSize, -iconSize);
    errorIcon.lineTo(iconSize, iconSize);
    errorIcon.moveTo(iconSize, -iconSize);
    errorIcon.lineTo(-iconSize, iconSize);
    errorIcon.x = this.containerWidth / 2;
    errorIcon.y =
      this.containerHeight / 2 + MagicWordsConfig.ERROR_ICON_Y_OFFSET;
    this.loadingContainer.addChild(errorIcon);

    // Error message
    const errorText = new Text(
      "I'm sorry, we encountered an error.\nPlease try again later.",
      {
        fontSize: MagicWordsConfig.ERROR_TEXT_SIZE,
        fill: 0x333333,
        fontFamily: "Arial",
        align: "center",
        wordWrap: true,
        wordWrapWidth:
          this.containerWidth - MagicWordsConfig.ERROR_TEXT_PADDING,
      }
    );
    errorText.anchor.set(0.5);
    errorText.x = this.containerWidth / 2;
    errorText.y =
      this.containerHeight / 2 + MagicWordsConfig.ERROR_TEXT_Y_OFFSET;
    this.loadingContainer.addChild(errorText);
  }

  private createLoadingScreen(): void {
    // Semi-transparent background
    const bg = new Graphics();
    bg.beginFill(0xffffff, MagicWordsConfig.LOADING_BG_ALPHA);
    bg.drawRect(0, 0, this.containerWidth, this.containerHeight);
    bg.endFill();
    this.loadingContainer.addChild(bg);

    // Loading spinner
    this.loadingSpinner = new Graphics();
    this.loadingSpinner.lineStyle(
      MagicWordsConfig.LOADING_SPINNER_LINE_WIDTH,
      0x4a90e2
    );
    this.loadingSpinner.arc(
      0,
      0,
      MagicWordsConfig.LOADING_SPINNER_RADIUS,
      0,
      MagicWordsConfig.LOADING_SPINNER_ARC_ANGLE
    );
    this.loadingSpinner.x = this.containerWidth / 2;
    this.loadingSpinner.y =
      this.containerHeight / 2 + MagicWordsConfig.LOADING_SPINNER_Y_OFFSET;
    this.loadingContainer.addChild(this.loadingSpinner);

    this.loadingText = new Text("Loading...", {
      fontSize: MagicWordsConfig.LOADING_TEXT_SIZE,
      fill: 0x333333,
      fontFamily: "Arial",
    });
    this.loadingText.anchor.set(0.5);
    this.loadingText.x = this.containerWidth / 2;
    this.loadingText.y =
      this.containerHeight / 2 + MagicWordsConfig.LOADING_TEXT_Y_OFFSET;
    this.loadingContainer.addChild(this.loadingText);

    // Animate spinner
    gsap.to(this.loadingSpinner, {
      rotation: MagicWordsConfig.INITIAL_ROTATION_MAX,
      duration: MagicWordsConfig.LOADING_SPINNER_DURATION,
      repeat: -1,
      ease: "none",
    });
  }

  private async loadAssets(): Promise<void> {
    const emojiPromises = this.loadEmojis();
    const avatarPromises = this.loadAvatars();
    await Promise.all([...emojiPromises, ...avatarPromises]);
  }

  private loadEmojis(): Promise<void>[] {
    return (this.data.emojies || [])
      .filter((emoji) => emoji?.name && emoji?.url)
      .map((emoji) => {
        try {
          const texture = Texture.from(emoji.url);
          this.emojiTextures.set(emoji.name, texture);
          return this.waitForTextureLoad(texture, `emoji: ${emoji.name}`);
        } catch (error) {
          console.warn(`Error loading emoji '${emoji.name}':`, error);
          return Promise.resolve();
        }
      });
  }

  private loadAvatars(): Promise<void>[] {
    return (this.data.avatars || [])
      .filter((avatar) => avatar?.name && avatar?.url)
      .map((avatar) => {
        try {
          const texture = Texture.from(avatar.url);
          this.avatarTextures.set(avatar.name, texture);
          this.avatarMap.set(avatar.name, avatar);
          return this.waitForTextureLoad(texture, `avatar: ${avatar.name}`);
        } catch (error) {
          console.warn(`Error loading avatar '${avatar.name}':`, error);
          return Promise.resolve();
        }
      });
  }

  private waitForTextureLoad(texture: Texture, label: string): Promise<void> {
    if (texture.valid || texture.baseTexture.valid) {
      return Promise.resolve();
    }

    return new Promise<void>((resolve) => {
      texture.baseTexture.once("loaded", () => resolve());
      texture.baseTexture.once("error", () => {
        console.warn(`Failed to load ${label}`);
        resolve();
      });
    });
  }

  public async start(
    container: Container,
    x: number,
    y: number
  ): Promise<void> {
    this.phoneFrame.x = x;
    this.phoneFrame.y = y;
    container.addChild(this.phoneFrame);

    this.maskGraphics.x = x;
    this.maskGraphics.y = y;

    this.scrollContainer.x = x;
    this.scrollContainer.y = y;

    container.addChild(this.maskGraphics);
    container.addChild(this.scrollContainer);

    this.loadingContainer.x = x;
    this.loadingContainer.y = y;
    container.addChild(this.loadingContainer);

    try {
      this.data = await this.loadDialogueData();

      await this.loadAssets();
      gsap.killTweensOf(this.loadingSpinner);

      gsap.to(this.loadingContainer, {
        alpha: 0,
        duration: MagicWordsConfig.LOADING_FADE_DURATION,
        onComplete: () => {
          container.removeChild(this.loadingContainer);
          this.loadingContainer.destroy({ children: true });
        },
      });

      this.setupScrollInteraction();

      this.startMessageAnimation();
    } catch (error) {
      gsap.killTweensOf(this.loadingSpinner);

      this.showErrorMessage();

      console.error("Failed to start game:", error);
    }
  }

  private setupScrollInteraction(): void {
    this.scrollContainer.eventMode = "static";
    this.scrollContainer.hitArea = {
      contains: (x: number, y: number) => {
        return (
          x >= 0 &&
          x <= this.containerWidth &&
          y >= 0 &&
          y <= this.containerHeight
        );
      },
    };

    this.scrollContainer.on("pointerdown", (event) => {
      this.isDragging = true;
      this.autoScroll = false;
      this.lastPointerY = event.global.y;
      gsap.killTweensOf(this.messageContainer);
    });

    this.scrollContainer.on("pointermove", (event) => {
      if (this.isDragging) {
        const deltaY = event.global.y - this.lastPointerY;
        this.lastPointerY = event.global.y;

        const newY = this.messageContainer.y + deltaY;
        const contentHeight = this.messageContainer.height;
        const minY = Math.min(
          MagicWordsConfig.SCROLL_MIN_Y,
          this.containerHeight -
            contentHeight -
            MagicWordsConfig.SCROLL_BOTTOM_PADDING
        );

        // Clamp the scroll position
        this.messageContainer.y = Math.max(
          minY,
          Math.min(MagicWordsConfig.SCROLL_MIN_Y, newY)
        );
      }
    });

    const endDrag = () => {
      this.isDragging = false;
    };

    this.scrollContainer.on("pointerup", endDrag);
    this.scrollContainer.on("pointerupoutside", endDrag);

    this.scrollContainer.on("wheel", (event: any) => {
      this.autoScroll = false;
      const deltaY = event.deltaY;
      const newY = this.messageContainer.y - deltaY;
      const contentHeight = this.messageContainer.height;
      const minY = Math.min(
        MagicWordsConfig.SCROLL_MIN_Y,
        this.containerHeight -
          contentHeight -
          MagicWordsConfig.SCROLL_BOTTOM_PADDING
      );

      gsap.killTweensOf(this.messageContainer);
      this.messageContainer.y = Math.max(
        minY,
        Math.min(MagicWordsConfig.SCROLL_MIN_Y, newY)
      );
    });
  }

  private startMessageAnimation(): void {
    // Show first message immediately
    if (this.currentMessageIndex < this.data.dialogue.length) {
      this.showCurrentMessage();
    }

    // Then show remaining messages with delay
    this.animationInterval = window.setInterval(() => {
      if (this.currentMessageIndex < this.data.dialogue.length) {
        this.showCurrentMessage();
      } else {
        if (this.animationInterval !== null) {
          clearInterval(this.animationInterval);
          this.animationInterval = null;
        }
      }
    }, MagicWordsConfig.MESSAGE_INTERVAL_MS);
  }

  private showCurrentMessage(): void {
    if (this.currentMessageIndex < this.data.dialogue.length) {
      this.addMessage(this.currentMessageIndex);
      this.currentMessageIndex++;
    }
  }

  private scrollToBottom(): void {
    // Only auto-scroll if user hasn't manually scrolled
    if (!this.autoScroll) return;

    const contentHeight = this.messageContainer.height;
    // If content is taller than container, scroll up (negative y)
    // Otherwise stay at 0
    const targetY = Math.min(
      MagicWordsConfig.SCROLL_MIN_Y,
      this.containerHeight -
        contentHeight -
        MagicWordsConfig.SCROLL_BOTTOM_PADDING
    );

    gsap.to(this.messageContainer, {
      y: targetY,
      duration: MagicWordsConfig.SCROLL_DURATION,
      ease: "power2.out",
    });
  }

  private addMessage(index: number): void {
    // Validate index and dialogue data
    if (!this.data?.dialogue || index >= this.data.dialogue.length) {
      console.warn(`Invalid message index: ${index}`);
      return;
    }

    const dialogueItem = this.data.dialogue[index];
    if (!dialogueItem?.name || !dialogueItem?.text) {
      console.warn("Invalid dialogue item:", dialogueItem);
      return;
    }

    const avatar = this.avatarMap.get(dialogueItem.name);
    const isLeft = avatar?.position === "left";

    const avatarTexture = this.avatarTextures.get(dialogueItem.name);

    try {
      // Calculate max width: container width minus padding and avatar space
      const maxBubbleWidth = Math.min(
        MagicWordsConfig.MAX_BUBBLE_WIDTH,
        this.containerWidth - MagicWordsConfig.BUBBLE_WIDTH_PADDING
      );

      const bubble = new MessageBubble(
        dialogueItem.text,
        isLeft,
        maxBubbleWidth,
        avatarTexture,
        this.emojiTextures
      );

      // Add to container first so we can get proper bounds
      this.messageContainer.addChild(bubble);

      // Calculate position
      let yPos = MagicWordsConfig.MESSAGE_INITIAL_Y;
      if (this.messages.length > 0) {
        const lastMessage = this.messages[this.messages.length - 1];
        yPos =
          lastMessage.y +
          lastMessage.getHeight() +
          MagicWordsConfig.MESSAGE_SPACING;
      }

      // Get bubble width from bounds
      const bubbleWidth = bubble.getBounds().width;
      const xPos = isLeft
        ? MagicWordsConfig.MESSAGE_SIDE_PADDING
        : this.containerWidth -
          bubbleWidth -
          MagicWordsConfig.MESSAGE_SIDE_PADDING;

      bubble.x = xPos;
      bubble.y = yPos;

      this.messages.push(bubble);

      // Animate in
      bubble.animateIn();

      // Scroll to bottom
      this.scrollToBottom();
    } catch (error) {
      console.error(
        `Error creating message bubble for '${dialogueItem.name}':`,
        error
      );
    }
  }

  public destroy(): void {
    if (this.animationInterval !== null) {
      clearInterval(this.animationInterval);
      this.animationInterval = null;
    }

    gsap.killTweensOf(this.loadingSpinner);
    gsap.killTweensOf(this.loadingContainer);
    gsap.killTweensOf(this.messageContainer);

    // Properly destroy all message bubbles (which kills their tweens)
    this.messages.forEach((message) => {
      message.destroy();
    });
    this.messages = [];

    this.scrollContainer.destroy({ children: true });
    this.maskGraphics.destroy();
    this.phoneFrame.destroy();

    if (this.loadingContainer.parent) {
      this.loadingContainer.destroy({ children: true });
    }

    // Clear texture maps (textures themselves are shared and managed by PixiJS)
    this.emojiTextures.clear();
    this.avatarTextures.clear();
    this.avatarMap.clear();
  }

  public getContainer(): Container {
    return this.scrollContainer;
  }
}
