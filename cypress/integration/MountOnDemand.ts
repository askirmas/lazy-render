describe('MountOnDemand', () => {
  before(() => cy.visit('MountOnDemand'))
  it('start - no children', () => cy
    .get('.works:empty')
    .should('have.length', 1)
  )

  it('check', () => cy
    .get('input')
    .should('have.length', 1)
    .get('input')
    .click()
    .get('input:checked')
    .should('have.length', 1)
  )

  it('all mounted', () => cy
    .get('.works *')
    .should('have.length', 1)
  )
})