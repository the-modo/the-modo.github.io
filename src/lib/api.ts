/** Backend base — Caddy + Let's Encrypt HTTPS in front of the
 *  Python email backend running on the home server. */
export const API_BASE =
  (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_BASE) ||
  'https://dilans.duckdns.org:4894'
