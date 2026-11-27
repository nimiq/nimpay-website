import assert from 'node:assert/strict'

import { APP_STORE_URL, IOS_STORE_FALLBACK_MS, openIosCustomSchemeWithStoreFallback } from '../utils/deeplink.ts'

const realDateNow = Date.now

function setupPage() {
  let now = 0
  const intervals = new Map<number, { callback: () => void, ms: number, nextAt: number }>()
  let nextIntervalId = 1
  const page = { focused: true, hidden: false, href: 'https://nimpay.app/miniapps/open/example.com' }
  const win = new EventTarget()
  const doc = new EventTarget()

  Date.now = () => now
  Object.assign(win, {
    location: {
      get href() { return page.href },
      set href(value: string) { page.href = value },
    },
    setInterval(callback: () => void, ms: number) {
      intervals.set(nextIntervalId, { callback, ms, nextAt: now + ms })
      return nextIntervalId++
    },
    clearInterval(id: number) {
      intervals.delete(id)
    },
  })
  Object.defineProperty(doc, 'hidden', { get: () => page.hidden })
  Object.assign(doc, { hasFocus: () => page.focused })
  Object.assign(globalThis, { window: win, document: doc })

  return {
    page,
    tick(ms: number) {
      const end = now + ms
      for (;;) {
        const due = [...intervals.values()].filter(interval => interval.nextAt <= end).sort((a, b) => a.nextAt - b.nextAt)[0]
        if (!due) break
        now = due.nextAt
        due.nextAt += due.ms
        due.callback()
      }
      now = end
    },
    blur() {
      page.focused = false
    },
    focus() {
      page.focused = true
    },
    hide() {
      page.hidden = true
      doc.dispatchEvent(new Event('visibilitychange'))
    },
  }
}

try {
  {
    const p = setupPage()
    openIosCustomSchemeWithStoreFallback('https://example.com/swap?flag')
    assert.match(p.page.href, /^nimiqpay:\/\/miniapp\?url=/)
    p.blur()
    p.tick(8000)
    p.focus()
    p.tick(1000)
    p.hide()
    p.tick(IOS_STORE_FALLBACK_MS)
    assert.notEqual(p.page.href, APP_STORE_URL, 'answering Safari\'s prompt late should not open the App Store')
  }

  {
    const p = setupPage()
    openIosCustomSchemeWithStoreFallback('https://example.com')
    p.tick(IOS_STORE_FALLBACK_MS)
    assert.equal(p.page.href, APP_STORE_URL, 'a page that keeps focus should fall back to the App Store')
  }

  {
    const p = setupPage()
    openIosCustomSchemeWithStoreFallback('https://example.com')
    p.blur()
    p.tick(20_000)
    assert.notEqual(p.page.href, APP_STORE_URL, 'time without focus should not count')
    p.focus()
    p.tick(IOS_STORE_FALLBACK_MS)
    assert.equal(p.page.href, APP_STORE_URL, 'focused time after the alert is dismissed should count')
  }
}
finally {
  Date.now = realDateNow
}
