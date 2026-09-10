Cypress.Commands.add('openAuthModal', () => {
  cy.getByTestId('header-login-button').click()
})

Cypress.Commands.add('loginUI', (email, password) => {
  cy.getByTestId('signin-email-input').type(email)
  cy.getByTestId('signin-password-input').type(password)
  cy.getByTestId('signin-submit-button').click()
})

Cypress.Commands.add('ensureUserExists', (user) => {
  cy.request({
    method: 'POST',
    url: `${Cypress.env('API_BASE')}/users/create`,
    body: user,
    failOnStatusCode: false
  })
})

Cypress.Commands.add('loginAPI', (user) => {
  cy.request('POST', `${Cypress.env('API_BASE')}/users/login`, user).then(
    (res) => {
      const { token } = res.body
      cy.setCookie('access-token', token)
      return res
    }
  )
})

Cypress.Commands.add('signUpUI', (user) => {
  cy.getByTestId('signup-first-name-input').type(user.firstName)
  cy.getByTestId('signup-last-name-input').type(user.lastName)
  cy.getByTestId('signup-email-input').type(user.email)
  cy.getByTestId('signup-password-input').type(user.password)
  cy.getByTestId('signup-password-confirmation-input').type(user.password)
  cy.getByTestId('signup-accepted-terms-checkbox').click()
  cy.getByTestId('signup-submit-button').click()
})
