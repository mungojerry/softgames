export class Colors {
  // Background colors
  static readonly BG_DARK = 0x1a1a2e;
  static readonly BG_SHADOWS = 0x0a0a0a;
  static readonly BG_MAGIC = 0x1a0033;
  static readonly BG_FLAMES = 0x1a0000;

  // Button colors - Dark base
  static readonly BTN_SHADOWS = 0x8b0000;
  static readonly BTN_SHADOWS_LIGHT = 0xb30000;
  static readonly BTN_MAGIC = 0x4b0082;
  static readonly BTN_MAGIC_LIGHT = 0x6a0dad;
  static readonly BTN_FLAMES = 0xff4500;
  static readonly BTN_FLAMES_LIGHT = 0xff6347;

  // UI colors
  static readonly WHITE = 0xffffff;
  static readonly GOLD = 0xffd700;
  static readonly SILVER = 0xc0c0c0;
  static readonly CYAN = 0x00ffff;

  // Effect colors
  static readonly SHADOW_PARTICLE = 0x333333;
  static readonly MAGIC_PURPLE = 0x9370db;
  static readonly MAGIC_PINK = 0xff69b4;
  static readonly FLAME_ORANGE = 0xff4500;
  static readonly FLAME_YELLOW = 0xffa500;
  static readonly FLAME_RED = 0xff0000;

  static lighten(color: number, amount: number = 50): number {
    const r = Math.min(255, ((color >> 16) & 0xff) + amount);
    const g = Math.min(255, ((color >> 8) & 0xff) + amount);
    const b = Math.min(255, (color & 0xff) + amount);
    return (r << 16) | (g << 8) | b;
  }
}
