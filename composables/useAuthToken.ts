export const useAuthToken = (session = false) => {
  const expires = session
    ? undefined
    : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)

  return useCookie<string | null>('access-token', {
    secure: true,
    path: '/',
    expires
  })
}
