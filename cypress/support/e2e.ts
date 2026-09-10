// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'
import './commands/auth.command'

// Warm up backend before running tests (handles Render free tier sleep)
before(() => {
  cy.request({
    method: 'HEAD',
    url: `${Cypress.env('API_BASE')}/health`,
    failOnStatusCode: false
  })
})

// Alternatively you can use CommonJS syntax:
// require('./commands')
