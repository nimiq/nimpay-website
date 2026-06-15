// Clamp og:description to a social-preview-friendly length. Social cards often
// show ~125 chars and truncate on mobile, so cut at a word boundary with an
// ellipsis. Full-length text stays in the SEO `description` meta.
export function clampDescription(text: string, max = 120): string {
  if (!text || text.length <= max) return text
  const slice = text.slice(0, max)
  const lastSpace = slice.lastIndexOf(' ')
  return `${(lastSpace > 60 ? slice.slice(0, lastSpace) : slice).trimEnd()}…`
}
