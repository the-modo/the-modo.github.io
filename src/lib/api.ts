/** Backend base — the landing site is static (GitHub Pages),
 *  the contact + download backend is a separate service.
 *
 *  Override at build time with NEXT_PUBLIC_API_BASE. */
export const API_BASE =
  (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_BASE) ||
  'http://dilans.duckdns.org:4894'
