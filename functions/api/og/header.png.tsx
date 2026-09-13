import type { APIRoute } from 'astro';
import { renderCard, type CardLayout } from './banner.png';

/**
 * 1500x500 profile header for listing sites (Dexscreener asks for 3:1, at
 * least 600px wide). Same art and copy as the share card; see banner.png.tsx.
 */
const HEADER: CardLayout = {
  width: 1500,
  height: 500,
  frame: 440,
  rightInset: 250,
  textLeft: 120,
  scale: 0.85,
};

export const onRequestGet: APIRoute = ({ request }) => renderCard(request, HEADER);
