/**
 * "Send a PING": a character under a flat system-notification banner.
 *
 * The builder is how holders send a PING (see PRODUCT.md, Narrative), so the
 * banner reads like a real OS notification from an app called PING, stated
 * flatly. The same drawing produces two files: a square image on the page's
 * cream ground for X, and a 512px transparent PNG that meets Telegram's
 * static sticker spec (one side exactly 512, PNG, well under 512KB).
 */

/** Suggestions, deadpan, no price claims. The first is what a card without a message says. */
export const PING_MESSAGES = [
  'You have 1 new PING.',
  'Order filled.',
  'Price alert.',
  'Seen.',
  'gm.',
  'Still holding.',
  'Bought the dip.',
  'Liquidated.',
] as const;

export const MAX_MESSAGE_LENGTH = 40;
const MIN_MESSAGE_SCALE = 0.72;

export const CARD_SIZE = 1024;
export const STICKER_SIZE = 512;

const GROUND = '#F3F1EA';
const SURFACE = '#FFFFFF';
const HAIRLINE = '#DDD9CC';
const INK = '#111C16';
const INK_FAINT = '#5E6B63';
const FONT = 'Archivo, Arial, sans-serif';

/**
 * Printable ASCII plus accented Latin letters: what Archivo, the card font,
 * can draw. Mirrors functions/_lib.ts; pingCard.test.ts asserts they agree.
 */
export const MESSAGE_CHARS = /^[\x20-\x7EÀ-ɏ]+$/;

/** Links and handles never go on a card. Mirrors functions/_lib.ts. */
export const LINK_LIKE = /https?:|www\.|t\.me|@\w|\b[a-z0-9-]+\s*(\.|\[\.\]|\(\.\))\s*(com|io|xyz|net|org|app|gg|co|me|finance|link|site|fun|lol|to|ly|so|ai)\b/i;

/** Why a typed message cannot be sent, or null when it can. Same rules as cleanPingMessage on the server. */
export const messageProblem = (raw: string): string | null => {
  const text = raw.replace(/\s+/g, ' ').trim();
  if (!text) return 'Write a message first.';
  if (text.length > MAX_MESSAGE_LENGTH) return `Keep it under ${MAX_MESSAGE_LENGTH + 1} characters.`;
  if (!MESSAGE_CHARS.test(text)) return 'Letters, numbers and punctuation only. No emoji.';
  if (LINK_LIKE.test(text)) return 'No links or @handles.';
  return null;
};

/** Collapses whitespace and caps length, so the banner can never overflow its row count. */
export const normalizeMessage = (text: string): string =>
  text.replace(/\s+/g, ' ').trim().slice(0, MAX_MESSAGE_LENGTH);

/**
 * The longest prefix of `text` that fits `maxWidth`, ellipsized if cut.
 * `measure` is injected so this stays testable without a canvas.
 */
export const fitLine = (text: string, maxWidth: number, measure: (s: string) => number): string => {
  if (measure(text) <= maxWidth) return text;
  let end = text.length;
  while (end > 0 && measure(`${text.slice(0, end).trimEnd()}…`) > maxWidth) end--;
  return end > 0 ? `${text.slice(0, end).trimEnd()}…` : '';
};

/** Every position as a fraction of the square's side, so 512 and 1024 are the same picture. */
export const cardLayout = (size: number) => {
  const u = (f: number) => f * size;
  const banner = { x: u(0.04), y: u(0.035), w: u(0.92), h: u(0.165), r: u(0.04) };
  const icon = { size: u(0.105), r: u(0.024) };
  const iconX = banner.x + u(0.03);
  const iconY = banner.y + (banner.h - icon.size) / 2;
  const textX = iconX + icon.size + u(0.03);
  const textRight = banner.x + banner.w - u(0.035);
  return {
    banner,
    icon: { ...icon, x: iconX, y: iconY },
    textX,
    textRight,
    titleBaseline: banner.y + u(0.068),
    messageBaseline: banner.y + u(0.126),
    titleSize: u(0.036),
    metaSize: u(0.03),
    messageSize: u(0.046),
    // The character's square sits below the banner and fills the rest.
    character: { x: u(0.1), y: u(0.2), size: u(0.8) },
  };
};

const roundRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
};

export interface PingCardOptions {
  size: number;
  /** A square composite of the character, any resolution. */
  character: CanvasImageSource;
  /** The app tile: the lime favicon. */
  icon: CanvasImageSource | null;
  message: string;
  /** false leaves the ground transparent, for stickers. */
  opaque: boolean;
}

export const drawPingCard = (ctx: CanvasRenderingContext2D, options: PingCardOptions) => {
  const { size, character, icon, opaque } = options;
  const layout = cardLayout(size);
  const { banner } = layout;

  ctx.clearRect(0, 0, size, size);
  if (opaque) {
    ctx.fillStyle = GROUND;
    ctx.fillRect(0, 0, size, size);
  }

  // No message: just the character, full frame - a plain sticker.
  if (!normalizeMessage(options.message)) {
    ctx.drawImage(character, 0, 0, size, size);
    return;
  }

  const c = layout.character;
  ctx.drawImage(character, c.x, c.y, c.size, c.size);

  // Banner, drawn after the character so a tall hat tucks under it rather
  // than over it, the way a notification sits over whatever is on screen.
  ctx.save();
  ctx.shadowColor = 'rgba(17, 28, 22, 0.14)';
  ctx.shadowBlur = size * 0.03;
  ctx.shadowOffsetY = size * 0.008;
  roundRect(ctx, banner.x, banner.y, banner.w, banner.h, banner.r);
  ctx.fillStyle = SURFACE;
  ctx.fill();
  ctx.restore();
  roundRect(ctx, banner.x, banner.y, banner.w, banner.h, banner.r);
  ctx.lineWidth = Math.max(1, size * 0.002);
  ctx.strokeStyle = HAIRLINE;
  ctx.stroke();

  if (icon) {
    ctx.save();
    roundRect(ctx, layout.icon.x, layout.icon.y, layout.icon.size, layout.icon.size, layout.icon.r);
    ctx.clip();
    ctx.drawImage(icon, layout.icon.x, layout.icon.y, layout.icon.size, layout.icon.size);
    ctx.restore();
  }

  ctx.textBaseline = 'alphabetic';

  ctx.font = `400 ${layout.metaSize}px ${FONT}`;
  ctx.fillStyle = INK_FAINT;
  ctx.textAlign = 'right';
  ctx.fillText('now', layout.textRight, layout.titleBaseline);

  ctx.font = `700 ${layout.titleSize}px ${FONT}`;
  ctx.fillStyle = INK;
  ctx.textAlign = 'left';
  ctx.fillText('PING', layout.textX, layout.titleBaseline);

  const text = normalizeMessage(options.message);
  const maxWidth = layout.textRight - layout.textX;
  ctx.font = `500 ${layout.messageSize}px ${FONT}`;
  // Shrink before cutting: a message someone typed should arrive whole.
  // MIN_MESSAGE_SCALE fits MAX_MESSAGE_LENGTH characters of typical text.
  // Glyph widths don't scale exactly linearly with font size, hence the 2% slack.
  const fullWidth = ctx.measureText(text).width;
  const scale = fullWidth <= maxWidth ? 1 : Math.max(MIN_MESSAGE_SCALE, (maxWidth / fullWidth) * 0.98);
  ctx.font = `500 ${layout.messageSize * scale}px ${FONT}`;
  const message = fitLine(text, maxWidth, (s) => ctx.measureText(s).width);
  ctx.fillText(message, layout.textX, layout.messageBaseline);
};

/** Canvas text silently falls back to Arial if the web font isn't loaded yet. */
export const loadCardFonts = async () => {
  if (typeof document === 'undefined' || !document.fonts) return;
  await Promise.all(
    ['400', '500', '700'].map((weight) => document.fonts.load(`${weight} 40px Archivo`).catch(() => undefined))
  );
};
