Cypress.Commands.overwrite('visit', (fn, page) => {
  fn(
    Cypress.config('baseUrl')
    ? page
    : `./out/${page}.html`
  )
  return cy.wait(500)
})
  