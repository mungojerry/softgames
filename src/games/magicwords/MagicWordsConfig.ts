export class MagicWordsConfig {
  // Phone frame
  static readonly PHONE_BEZEL = 20;
  static readonly PHONE_RADIUS = 30;
  static readonly PHONE_INNER_RADIUS = 15;

  // Loading screen
  static readonly LOADING_BG_ALPHA = 0.9;
  static readonly LOADING_SPINNER_RADIUS = 30;
  static readonly LOADING_SPINNER_LINE_WIDTH = 4;
  static readonly LOADING_SPINNER_ARC_ANGLE = Math.PI * 1.5;
  static readonly LOADING_SPINNER_Y_OFFSET = -30;
  static readonly LOADING_TEXT_Y_OFFSET = 30;
  static readonly LOADING_TEXT_SIZE = 18;
  static readonly LOADING_FADE_DURATION = 0.5;
  static readonly LOADING_SPINNER_DURATION = 1;

  // Error display
  static readonly ERROR_BG_ALPHA = 0.95;
  static readonly ERROR_ICON_LINE_WIDTH = 6;
  static readonly ERROR_ICON_SIZE = 20;
  static readonly ERROR_ICON_Y_OFFSET = -60;
  static readonly ERROR_TEXT_Y_OFFSET = 20;
  static readonly ERROR_TEXT_SIZE = 18;
  static readonly ERROR_TEXT_PADDING = 40;

  // Message animation
  static readonly MESSAGE_INTERVAL_MS = 2000;
  static readonly MESSAGE_INITIAL_Y = 10;
  static readonly MESSAGE_SPACING = 15;
  static readonly MESSAGE_SIDE_PADDING = 20;
  static readonly MAX_BUBBLE_WIDTH = 400;
  static readonly BUBBLE_WIDTH_PADDING = 100;

  // Scrolling
  static readonly SCROLL_BOTTOM_PADDING = 20;
  static readonly SCROLL_DURATION = 0.5;
  static readonly SCROLL_MIN_Y = 0;

  // Animation
  static readonly INITIAL_ROTATION_MAX = Math.PI * 2;
}
