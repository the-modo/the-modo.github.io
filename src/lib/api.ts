/** Backend base — the marketing site is static (GitHub Pages),
 *  the contact + download backend runs on the home server. */
export const API_BASE =
  (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_BASE) ||
  'http://dilans.duckdns.org:4894'
