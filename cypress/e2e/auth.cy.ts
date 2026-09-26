import { buildNewUser } from '../support/factories/user.factory'
import type { UsersFixture } from '../types/fixtures'

describe('Auth', () => {
  before(() => {
    cy.fixture<UsersFixture>('users').then(({ valid }) => {
      cy.ensureUserExists(valid)
    })
  })

  beforeEach(() => {
    cy.removeCacheFromAPIResponses()
    cy.visit('/')

    // Wait for the page to finish loading
    cy.getByTestId('color-mode-spinner').should('not.exist')
  })

  context('Guest', () => {
    it('rejects invalid login', () => {
      cy.fixture<UsersFixture>('users').then(({ invalid }) => {
        cy.openAuthModal()
        cy.loginUI(invalid.email, invalid.password)
        cy.getByTestId('signin-error-message').should('exist')
      })
    })

    it('logs in successfully', () => {
      cy.fixture<UsersFixture>('users').then(({ valid }) => {
        cy.intercept({ method: 'POST', url: '**/users/login' }).as(
          'loginRequest'
        )
        cy.openAuthModal()
        cy.loginUI(valid.email, valid.password)
        cy.wait('@loginRequest').its('response.statusCode').should('eq', 200)
        cy.getCookie('access-token').should('exist')
        cy.getByTestId('auth-modal').should('not.exist')
      })
    })

    it('signs up successfully', () => {
      const newUser = buildNewUser()
      cy.intercept({ method: 'POST', url: '**/users/create' }).as(
        'signUpRequest'
      )
      cy.openAuthModal()
      cy.getByTestId('signin-show-signup-button').click()
      cy.getByTestId('signup-form').should('exist')
      cy.signUpUI(newUser)
      cy.wait('@signUpRequest').its('response.statusCode').should('eq', 201)
      cy.getCookie('access-token').should('exist')
      cy.getByTestId('auth-modal').should('not.exist')
    })

    it('tries to sign up with an existing email', () => {
      cy.fixture<UsersFixture>('users').then(({ valid }) => {
        const existingUser: User = {
          firstName: valid.firstName,
          lastName: valid.lastName,
          email: valid.email,
          password: valid.password
        }
        cy.intercept({ method: 'POST', url: '**/users/create' }).as(
          'signUpRequest'
        )
        cy.openAuthModal()
        cy.getByTestId('signin-show-signup-button').click()
        cy.getByTestId('signup-form').should('exist')
        cy.signUpUI(existingUser)
        cy.wait('@signUpRequest').its('response.statusCode').should('eq', 400)
        cy.getByTestId('signup-error-message').should('exist')
        cy.getCookie('access-token').should('not.exist')
      })
    })
  })

  context('Logged user', () => {
    beforeEach(() => {
      cy.fixture<UsersFixture>('users').then(({ valid }) => {
        cy.openAuthModal()
        cy.loginUI(valid.email, valid.password)
      })
    })

    it('logs out', () => {
      cy.getByTestId('header-menu-button').click()
      cy.getByTestId('logout-dropdown-option').click()
      cy.getCookie('access-token').should('not.exist')
    })
  })
})
