export class PhoenixFlamesConfig {
  // Particle system
  static readonly MAX_PARTICLES = 10;
  static readonly EMISSION_INTERVAL_MS = 200;

  // Particle starting position
  static readonly START_POSITION_VARIANCE = 5;

  // Particle scale
  static readonly MIN_SCALE = 0.07;
  static readonly SCALE_VARIANCE = 0.03;
  static readonly SCALE_MULTIPLIER = 10;

  // Particle movement
  static readonly HORIZONTAL_DRIFT = 0.5;
  static readonly VERTICAL_DISTANCE_RATIO = 0.2;
  static readonly VERTICAL_VARIANCE = 5;

  // Animation timing
  static readonly MIN_DURATION = 1;
  static readonly DURATION_VARIANCE = 0.5;
  static readonly SCALE_DURATION_RATIO = 0.5;

  // Particle rotation
  static readonly INITIAL_ROTATION_MAX = Math.PI * 2;
  static readonly ROTATION_VARIANCE = Math.PI / 2;

  // Animation properties
  static readonly INITIAL_ALPHA = 1;
  static readonly TARGET_ALPHA = 0;
  static readonly SCALE_YOYO = true;
  static readonly SCALE_REPEAT = 1;
}
