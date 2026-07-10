import assert from 'node:assert/strict'

import { putFile } from '../server/utils/github-app.ts'

let request: { body?: unknown } | undefined
const originalFetch = Object.getOwnPropertyDescriptor(globalThis, '$fetch')

Object.defineProperty(globalThis, '$fetch', {
  configurable: true,
  value: async (_url: string, options: { body?: unknown }) => {
    request = options
  },
})

try {
  const identity = {
    name: 'Mini App Developer',
    email: '123456+developer@users.noreply.github.com',
  }

  await putFile('installation-token', { owner: 'nimiq', repo: 'awesome' }, {
    path: 'src/data/nimiq-mini-apps.json',
    content: '[]\n',
    message: 'feat: add Example mini app',
    branch: 'submit-app/example',
    author: identity,
  })

  assert.deepEqual(request?.body, {
    message: 'feat: add Example mini app',
    content: 'W10K',
    branch: 'submit-app/example',
    author: identity,
    committer: identity,
  })
}
finally {
  if (originalFetch) Object.defineProperty(globalThis, '$fetch', originalFetch)
  else delete (globalThis as Record<string, unknown>).$fetch
}
