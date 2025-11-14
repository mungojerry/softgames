export class PhoenixFlamesConfig {
  // Particle pool
  static readonly MAX_PARTICLES = 10;
  static readonly EMISSION_INTERVAL_MS = 200;

  // Sprite config
  static readonly SPRITE_ANCHOR = 0.5;

  // Initial particle state
  static readonly INITIAL_X = 0;
  static readonly INITIAL_Y = 0;
  static readonly INITIAL_SCALE = 1;
  static readonly INITIAL_ALPHA = 1;

  // Random movement ranges
  static readonly RANDOM_X_CENTER = 0.5;
  static readonly RANDOM_X_RANGE = 100;
  static readonly BASE_RISE_DISTANCE = 100;
  static readonly RANDOM_Y_RANGE = 50;
  static readonly RANDOM_ROTATION_CENTER = 0.5;
  static readonly ROTATION_MAX_RADIANS = Math.PI;

  // Scale range
  static readonly MIN_SCALE = 1.5;
  static readonly MAX_SCALE = 2.5;

  // Animation - Movement
  static readonly MOVE_DURATION = 2;
  static readonly MOVE_EASE = "power2.out";
  static readonly TARGET_ALPHA = 0;

  // Animation - Scale
  static readonly SCALE_DURATION = 1;
  static readonly SCALE_EASE = "power2.out";
  static readonly SCALE_START_TIME = 0;

  // Animation - Rotation
  static readonly ROTATION_DURATION = 2;
  static readonly ROTATION_EASE = "none";
  static readonly ROTATION_START_TIME = 0;
}
