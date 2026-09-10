declare namespace Cypress {
  interface Chainable {
    openAuthModal(): Chainable<void>
    loginUI(email: string, password: string): Chainable<void>
    loginAPI(user: User): Chainable<void>
    ensureUserExists(user: User): Chainable<void>
    signUpUI(user: User): Chainable<void>
    getByTestId(id: string): Chainable<JQuery<HTMLElement>>
    removeCacheFromAPIResponses(): Chainable<void>
  }
}

interface User {
  firstName?: string
  lastName?: string
  email?: string
  password?: string
}
