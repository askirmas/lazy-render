describe('MountOnDemand', () => {
  before(() => cy.visit('MountOnDemand'))
  it('start - no children', () => cy
    .get('main .child')
    .should('have.length', 0)
  )

  it('All mounted after check', () => cy
    .get('input')
    .click()
    .get('main div:not(.child)')
    .should('have.length', 0)
    .get('main div.child:not(:visible)')
    .should('have.length', 0)
    .get('main div.child')
    .then(({length}) => cy
      .wrap(length)
      .as('childrenCount')
    )
  )

  it('Nothing changed after uncheck', () => cy
    .get('input')
    .click()
    .get('main div:not(.child)')
    .should('have.length', 0)
    .get('main div.child:visible')
    .should('have.length', 0)
    .get('main div.child')
    .then(function($el) {
      expect($el.length).to.eq(this.childrenCount)
    })
  )
})