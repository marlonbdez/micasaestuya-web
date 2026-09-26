describe('i18n', () => {
  beforeEach(() => {
    cy.removeCacheFromAPIResponses()
    cy.visit('/')

    // Wait for the page to finish loading
    cy.getByTestId('color-mode-spinner').should('not.exist')

    // Open the locale modal
    cy.getByTestId('header-menu-button').click()
    cy.getByTestId('header-i18n-button').click()
    cy.getByTestId('locale-modal').should('exist')
  })

  it('changes locale settings', () => {
    cy.get('.modal__list-item-content')
      .eq(1) // Select the second option in the list
      .then(($btn) => {
        const href = $btn.prop('href')
        cy.wrap($btn).click()
        cy.url().should('eq', href)
        cy.getByTestId('locale-modal').should('not.exist')

        // Reload the page
        cy.reload()

        // Verify that the URL and language settings persist
        cy.url().should('eq', href)
      })
  })

  it('modal can be closed by clicking the close button', () => {
    cy.get('.modal__close').click()
    cy.getByTestId('locale-modal').should('not.exist')
  })

  it('modal closes when clicking outside the dialog', () => {
    cy.get('.modal__dialog').click('center', { force: true }) // click inside the dialog
    cy.getByTestId('locale-modal').should('exist')
    cy.get('.modal').click('topLeft') // click outside the dialog
    cy.getByTestId('locale-modal').should('not.exist')
  })
})
