export class SceneConfig {
  // Shadow particles
  static readonly SHADOW_PARTICLE_COUNT = 20;
  static readonly SHADOW_PARTICLE_MIN_RADIUS = 5;
  static readonly SHADOW_PARTICLE_MAX_RADIUS = 10;
  static readonly SHADOW_PARTICLE_MAX_ALPHA = 0.5;
  static readonly SHADOW_PARTICLE_SPAWN_OFFSET = -50;
  static readonly SHADOW_PARTICLE_FALL_BUFFER = 100;
  static readonly SHADOW_PARTICLE_MIN_DURATION = 3;
  static readonly SHADOW_PARTICLE_MAX_DURATION = 5;

  // Main menu
  static readonly MENU_BORDER_WIDTH = 10;
  static readonly MENU_BORDER_PADDING = 20;
  static readonly MENU_BORDER_INSET = 40;

  static readonly MOBILE_BREAKPOINT = 768;
  static readonly MOBILE_TITLE_FONT_SIZE = 48;
  static readonly DESKTOP_TITLE_FONT_SIZE = 80;
  static readonly MOBILE_TITLE_LETTER_SPACING = 3;
  static readonly DESKTOP_TITLE_LETTER_SPACING = 6;

  static readonly MOBILE_BUTTON_PADDING = 60;
  static readonly DESKTOP_BUTTON_PADDING = 100;
  static readonly MOBILE_MAX_BUTTON_WIDTH = 400;
  static readonly DESKTOP_MAX_BUTTON_WIDTH = 600;
  static readonly MOBILE_BUTTON_HEIGHT = 80;
  static readonly DESKTOP_BUTTON_HEIGHT = 110;

  static readonly MOBILE_BUTTON_FONT_SIZE = 22;
  static readonly DESKTOP_BUTTON_FONT_SIZE = 35;
  static readonly MOBILE_BUTTON_LETTER_SPACING = 1;
  static readonly DESKTOP_BUTTON_LETTER_SPACING = 2;

  // Game positioning
  static readonly GAME_CENTER_Y_DIVISOR = 1.5;

  // Magic Words scene
  static readonly MAGIC_WORDS_MAX_WIDTH = 500;
  static readonly MAGIC_WORDS_PADDING = 40;
  static readonly MAGIC_WORDS_HEIGHT_OFFSET = 200;
  static readonly MAGIC_WORDS_START_Y = 50;

  // Phoenix Flames scene
  static readonly PHOENIX_HEIGHT_OFFSET = 200;
  static readonly PHOENIX_START_X = 0;
  static readonly PHOENIX_START_Y = 100;
}
