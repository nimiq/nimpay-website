import { fetchSiteMetadata, toPublicHttpsUrl } from '../utils/site-metadata'

export default defineCachedEventHandler(async (event) => {
  const url = toPublicHttpsUrl(String(getQuery(event).url ?? ''))
  if (!url) throw createError({ statusCode: 400, statusMessage: 'Invalid URL' })
  url.search = ''
  url.hash = ''
  return await fetchSiteMetadata(url.href).catch(() => null)
}, {
  maxAge: 60 * 60 * 6,
  swr: true,
})
