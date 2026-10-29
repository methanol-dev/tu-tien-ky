/**
 * Resolves static asset paths taking Vite base URL (e.g. GitHub Pages subpath /tu-tien-ky/) into account.
 */
export function resolveAsset(path?: string): string {
  if (!path) return ''
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) return path
  const base = import.meta.env.BASE_URL || '/'
  const normalizedBase = base.endsWith('/') ? base : `${base}/`
  if (normalizedBase !== '/' && path.startsWith(normalizedBase)) return path
  const clean = path.startsWith('/') ? path.slice(1) : path
  return `${normalizedBase}${clean}`
}

