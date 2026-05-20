import { fetchMiniApps } from '../utils/miniapps'

export default defineEventHandler(async () => {
  return await fetchMiniApps()
})
