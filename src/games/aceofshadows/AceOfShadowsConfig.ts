export class AceOfShadowsConfig {
  // Card configuration
  static readonly TOTAL_CARDS = 144;
  static readonly NUM_STACKS = 5;
  static readonly MAIN_STACK_INDEX = 0;
  static readonly FIRST_DEST_STACK_INDEX = 1;

  // Animation timing
  static readonly CARD_MOVE_INTERVAL_MS = 1000;
  static readonly CARD_MOVE_DURATION_SEC = 2;

  // Card rotation
  static readonly CARD_ROTATION_VARIANCE = 0.2;

  // Mobile layout ratios
  static readonly MOBILE_TOP_Y_RATIO = 0.4;
  static readonly MOBILE_BOTTOM_ROW_Y_RATIO = 0.6;
  static readonly MOBILE_BOTTOM_ROW2_Y_RATIO = 0.8;
  static readonly MOBILE_GRID_SPACING_RATIO = 0.35;

  // Desktop layout
  static readonly DESKTOP_STACK_SPACING = 200;

  // Scale factors
  static readonly MOBILE_CARD_SCALE = 0.5;
  static readonly DESKTOP_CARD_SCALE = 1;
}
