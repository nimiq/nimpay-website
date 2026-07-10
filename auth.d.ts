// Shape of the sealed session set by server/api/auth/github.get.ts. The GitHub
// App login stores identity only — no access token, since the App installation
// token (server/utils/github-app.ts) does all repo writes. `id` builds the
// noreply commit-author email in the submit flow.
declare module '#auth-utils' {
  interface User {
    id: number
    login: string
    name: string
    avatarUrl: string
  }
  interface SecureSessionData {}
}

export {}
