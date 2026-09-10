Cypress.Commands.add('getByTestId', (id: string) => {
  return cy.get(`[data-cy="${id}"]`)
})

Cypress.Commands.add('removeCacheFromAPIResponses', () => {
  cy.intercept({ url: '**/api/**' }, (req) => {
    req.on('before:response', (res) => {
      res.headers['cache-control'] = 'no-store'
    })
  })
})
