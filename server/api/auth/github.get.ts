// Store identity only. Repository writes use the GitHub App installation token.
export default defineOAuthGitHubEventHandler({
  config: {
    scope: [],
    emailRequired: false,
  },
  async onSuccess(event, { user }) {
    await setUserSession(event, {
      user: {
        id: user.id,
        login: user.login,
        name: user.name ?? user.login,
        avatarUrl: user.avatar_url,
      },
    })
    return sendRedirect(event, '/miniapps/submit')
  },
  onError(event, error) {
    console.error('[auth/github] OAuth error', error)
    return sendRedirect(event, '/miniapps/submit?error=oauth')
  },
})
