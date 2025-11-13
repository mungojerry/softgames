import { Container, Texture, Graphics, Text } from "pixi.js";
import { MessageBubble } from "./MessageBubble";
import { DialogueData, Avatar } from "./types";
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
  private readonly PHONE_BEZEL = 20;
  private readonly PHONE_RADIUS = 30;
  private isDragging = false;
  private lastPointerY = 0;
  private autoScroll = true;
  private loadingContainer: Container;
  private loadingSpinner!: Graphics;
  private loadingText!: Text;
  private assetsLoaded = false;
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

    // Create mask for scrolling area
    this.maskGraphics = new Graphics();
    this.maskGraphics.beginFill(0xffffff);
    this.maskGraphics.drawRect(0, 0, containerWidth, containerHeight);
    this.maskGraphics.endFill();
    this.scrollContainer.mask = this.maskGraphics;

    // Create phone frame
    this.createPhoneFrame();

    // Create loading screen
    this.createLoadingScreen();

    // Set data endpoint (use default hardcoded data if not provided)
    this.dataEndpoint = dataEndpoint || "";

    // Initialize with empty data structure
    this.data = { dialogue: [], emojies: [], avatars: [] };
  }

  private createPhoneFrame(): void {
    const totalWidth = this.containerWidth + this.PHONE_BEZEL * 2;
    const totalHeight = this.containerHeight + this.PHONE_BEZEL * 2;

    // Phone outer frame (dark border)
    this.phoneFrame.beginFill(0x1a1a1a);
    this.phoneFrame.drawRoundedRect(
      -this.PHONE_BEZEL,
      -this.PHONE_BEZEL,
      totalWidth,
      totalHeight,
      this.PHONE_RADIUS
    );
    this.phoneFrame.endFill();

    // Screen area (inner cutout)
    this.phoneFrame.beginFill(0xffffff);
    this.phoneFrame.drawRoundedRect(
      0,
      0,
      this.containerWidth,
      this.containerHeight,
      15
    );
    this.phoneFrame.endFill();

    // Camera notch at top
    this.phoneFrame.beginFill(0x1a1a1a);
    this.phoneFrame.drawRoundedRect(
      this.containerWidth / 2 - 40,
      -this.PHONE_BEZEL + 5,
      80,
      10,
      5
    );
    this.phoneFrame.endFill();
  }

  private async loadDialogueData(): Promise<DialogueData> {
    // If endpoint is provided, fetch data from it
    if (this.dataEndpoint) {
      try {
        const response = await fetch(this.dataEndpoint);
        if (!response.ok) {
          throw new Error(
            `Failed to fetch dialogue data: ${response.statusText}`
          );
        }
        const data = await response.json();
        // Validate data structure
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
    // Clear loading screen content
    this.loadingContainer.removeChildren();

    // Error background
    const bg = new Graphics();
    bg.beginFill(0xffffff, 0.95);
    bg.drawRect(0, 0, this.containerWidth, this.containerHeight);
    bg.endFill();
    this.loadingContainer.addChild(bg);

    // Error icon (red X)
    const errorIcon = new Graphics();
    errorIcon.lineStyle(6, 0xff4444);
    errorIcon.moveTo(-20, -20);
    errorIcon.lineTo(20, 20);
    errorIcon.moveTo(20, -20);
    errorIcon.lineTo(-20, 20);
    errorIcon.x = this.containerWidth / 2;
    errorIcon.y = this.containerHeight / 2 - 60;
    this.loadingContainer.addChild(errorIcon);

    // Error message
    const errorText = new Text(
      "I'm sorry, we encountered an error.\nPlease try again later.",
      {
        fontSize: 18,
        fill: 0x333333,
        fontFamily: "Arial",
        align: "center",
        wordWrap: true,
        wordWrapWidth: this.containerWidth - 40,
      }
    );
    errorText.anchor.set(0.5);
    errorText.x = this.containerWidth / 2;
    errorText.y = this.containerHeight / 2 + 20;
    this.loadingContainer.addChild(errorText);
  }

  private createLoadingScreen(): void {
    // Semi-transparent background
    const bg = new Graphics();
    bg.beginFill(0xffffff, 0.9);
    bg.drawRect(0, 0, this.containerWidth, this.containerHeight);
    bg.endFill();
    this.loadingContainer.addChild(bg);

    // Loading spinner
    this.loadingSpinner = new Graphics();
    this.loadingSpinner.lineStyle(4, 0x4a90e2);
    this.loadingSpinner.arc(0, 0, 30, 0, Math.PI * 1.5);
    this.loadingSpinner.x = this.containerWidth / 2;
    this.loadingSpinner.y = this.containerHeight / 2 - 30;
    this.loadingContainer.addChild(this.loadingSpinner);

    // Loading text
    this.loadingText = new Text("Loading...", {
      fontSize: 18,
      fill: 0x333333,
      fontFamily: "Arial",
    });
    this.loadingText.anchor.set(0.5);
    this.loadingText.x = this.containerWidth / 2;
    this.loadingText.y = this.containerHeight / 2 + 30;
    this.loadingContainer.addChild(this.loadingText);

    // Animate spinner
    gsap.to(this.loadingSpinner, {
      rotation: Math.PI * 2,
      duration: 1,
      repeat: -1,
      ease: "none",
    });
  }

  private async loadAssets(): Promise<void> {
    const loadPromises: Promise<void>[] = [];

    // Load emojis
    this.data.emojies?.forEach((emoji) => {
      if (!emoji?.name || !emoji?.url) {
        console.warn("Invalid emoji data:", emoji);
        return;
      }

      try {
        const texture = Texture.from(emoji.url);
        this.emojiTextures.set(emoji.name, texture);

        // Wait for texture to load
        if (!texture.valid) {
          loadPromises.push(
            new Promise<void>((resolve) => {
              if (texture.baseTexture.valid) {
                resolve();
              } else {
                texture.baseTexture.on("loaded", () => resolve());
                texture.baseTexture.on("error", () => {
                  console.warn(`Failed to load emoji: ${emoji.name}`);
                  resolve();
                });
              }
            })
          );
        }
      } catch (error) {
        console.warn(`Error loading emoji '${emoji.name}':`, error);
      }
    });

    // Load avatars
    this.data.avatars?.forEach((avatar) => {
      if (!avatar?.name || !avatar?.url) {
        console.warn("Invalid avatar data:", avatar);
        return;
      }

      try {
        const texture = Texture.from(avatar.url);
        this.avatarTextures.set(avatar.name, texture);
        this.avatarMap.set(avatar.name, avatar);

        // Wait for texture to load
        if (!texture.valid) {
          loadPromises.push(
            new Promise<void>((resolve) => {
              if (texture.baseTexture.valid) {
                resolve();
              } else {
                texture.baseTexture.on("loaded", () => resolve());
                texture.baseTexture.on("error", () => {
                  console.warn(`Failed to load avatar: ${avatar.name}`);
                  resolve();
                });
              }
            })
          );
        }
      } catch (error) {
        console.warn(`Error loading avatar '${avatar.name}':`, error);
      }
    });

    // Wait for all assets to load
    await Promise.all(loadPromises);
    this.assetsLoaded = true;
  }

  public async start(
    container: Container,
    x: number,
    y: number
  ): Promise<void> {
    // Position the phone frame
    this.phoneFrame.x = x;
    this.phoneFrame.y = y;
    container.addChild(this.phoneFrame);

    // Position the mask at the correct location
    this.maskGraphics.x = x;
    this.maskGraphics.y = y;

    // Position the scroll container
    this.scrollContainer.x = x;
    this.scrollContainer.y = y;

    container.addChild(this.maskGraphics);
    container.addChild(this.scrollContainer);

    // Show loading screen
    this.loadingContainer.x = x;
    this.loadingContainer.y = y;
    container.addChild(this.loadingContainer);

    try {
      // Load dialogue data
      this.data = await this.loadDialogueData();

      // Load assets
      await this.loadAssets();

      // Stop spinner animation before fading out
      gsap.killTweensOf(this.loadingSpinner);

      // Hide loading screen with fade out
      gsap.to(this.loadingContainer, {
        alpha: 0,
        duration: 0.5,
        onComplete: () => {
          container.removeChild(this.loadingContainer);
          this.loadingContainer.destroy({ children: true });
        },
      });

      // Enable scroll interactions
      this.setupScrollInteraction();

      // Start showing messages
      this.startMessageAnimation();
    } catch (error) {
      // Stop spinner animation
      gsap.killTweensOf(this.loadingSpinner);

      // Show error message
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
      this.autoScroll = false; // Disable auto-scroll when user interacts
      this.lastPointerY = event.global.y;
      gsap.killTweensOf(this.messageContainer); // Stop any ongoing animations
    });

    this.scrollContainer.on("pointermove", (event) => {
      if (this.isDragging) {
        const deltaY = event.global.y - this.lastPointerY;
        this.lastPointerY = event.global.y;

        // Update scroll position
        const newY = this.messageContainer.y + deltaY;
        const contentHeight = this.messageContainer.height;
        const minY = Math.min(0, this.containerHeight - contentHeight - 20);

        // Clamp the scroll position
        this.messageContainer.y = Math.max(minY, Math.min(0, newY));
      }
    });

    const endDrag = () => {
      this.isDragging = false;
    };

    this.scrollContainer.on("pointerup", endDrag);
    this.scrollContainer.on("pointerupoutside", endDrag);

    // Mouse wheel support
    this.scrollContainer.on("wheel", (event: any) => {
      this.autoScroll = false;
      const deltaY = event.deltaY;
      const newY = this.messageContainer.y - deltaY;
      const contentHeight = this.messageContainer.height;
      const minY = Math.min(0, this.containerHeight - contentHeight - 20);

      gsap.killTweensOf(this.messageContainer);
      this.messageContainer.y = Math.max(minY, Math.min(0, newY));
    });
  }

  private startMessageAnimation(): void {
    this.animationInterval = window.setInterval(() => {
      if (this.currentMessageIndex < this.data.dialogue.length) {
        this.addMessage(this.currentMessageIndex);
        this.currentMessageIndex++;
      } else {
        if (this.animationInterval !== null) {
          clearInterval(this.animationInterval);
          this.animationInterval = null;
        }
      }
    }, 2000); // Show a new message every 2 seconds
  }

  private scrollToBottom(): void {
    // Only auto-scroll if user hasn't manually scrolled
    if (!this.autoScroll) return;

    const contentHeight = this.messageContainer.height;
    // If content is taller than container, scroll up (negative y)
    // Otherwise stay at 0
    const targetY = Math.min(0, this.containerHeight - contentHeight - 20);

    gsap.to(this.messageContainer, {
      y: targetY,
      duration: 0.5,
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
      const bubble = new MessageBubble(
        dialogueItem.text,
        isLeft,
        avatarTexture,
        this.emojiTextures
      );

      // Add to container first so we can get proper bounds
      this.messageContainer.addChild(bubble);

      // Calculate position
      let yPos = 10;
      if (this.messages.length > 0) {
        const lastMessage = this.messages[this.messages.length - 1];
        yPos = lastMessage.y + lastMessage.getHeight() + 15;
      }

      // Get bubble width from bounds
      const bubbleWidth = bubble.getBounds().width;
      const xPos = isLeft ? 20 : this.containerWidth - bubbleWidth - 20;

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

    this.messages.forEach((message) => message.destroy());
    this.messages = [];
    this.scrollContainer.destroy({ children: true });
    this.maskGraphics.destroy();
    this.phoneFrame.destroy();

    if (this.loadingContainer.parent) {
      this.loadingContainer.destroy({ children: true });
    }
  }

  public getContainer(): Container {
    return this.scrollContainer;
  }
}
