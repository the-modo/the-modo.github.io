/** Prepend the GitHub-Pages basePath to a public asset URL.
 *  Internal <Link>/<Image> get this for free; raw <video>/<img> don't. */
export const asset = (path: string): string =>
  `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}${path}`
