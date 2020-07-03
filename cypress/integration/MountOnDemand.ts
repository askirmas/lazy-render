describe('MountOnDemand', () => {
  before(() => cy.visit('MountOnDemand'))
  it('start - no children', () => cy
    .get('main .child')
    .should('have.length', 0
    )
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
    .get('main div:not(.child)')
    .should('have.length', 0)
  )
})