export class MessageBubbleConfig {
  // Bubble dimensions
  static readonly PADDING = 15;
  static readonly DEFAULT_MAX_WIDTH = 400;
  static readonly BUBBLE_RADIUS = 15;
  static readonly MIN_BUBBLE_WIDTH_MULTIPLIER = 4;
  static readonly MIN_BUBBLE_HEIGHT_MULTIPLIER = 3;

  // Avatar
  static readonly AVATAR_SIZE = 40;
  static readonly AVATAR_OFFSET = 10;
  static readonly AVATAR_ANCHOR = 0.5;
  static readonly UNKNOWN_AVATAR_QUESTION_SIZE = 24;

  // Text layout
  static readonly TEXT_FONT_SIZE = 16;
  static readonly EMOJI_SIZE = 20;
  static readonly LINE_SPACING = 5;
  static readonly EMOJI_SPACING = 4;

  // Animation
  static readonly ANIMATION_Y_OFFSET = 20;
  static readonly ANIMATION_DURATION = 0.4;
  static readonly ANIMATION_EASE = "back.out(1.7)";
  static readonly INITIAL_ALPHA = 0;
  static readonly TARGET_ALPHA = 1;

  // Emoji placeholder
  static readonly EMOJI_PLACEHOLDER_SIZE_RATIO = 0.6;
}
