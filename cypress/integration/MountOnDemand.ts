const mainTarget = '.main.target'
, ghostTarget = '.ghost.target'

describe('MountOnDemand', () => {
  before(() => cy.visit('MountOnDemand'))

  it('suites count', () => cy
    .get(`section[data-index]`)
    .should('have.length', 2)
  )

  describe("0. no class", () => {
    beforeEach(() => cy.get("section[data-index=0]").as("container"))

    it('everything rendered', () => cy
      .get('@container')
      .within(() => cy
        .get(ghostTarget)
        .should('have.length', 0)
        .get(`${mainTarget}:visible`)
        .should('have.length', 0)
        .get(mainTarget)
        .should('not.have.length', 0)
      )
    )
  })

  describe("1. children structures", () => {
    beforeEach(() => cy.get("section[data-index=1]").as("container"))

    it('No children', () => cy
      .get('@container')
      .within(() => cy
        .get(mainTarget)
        .should('have.length', 0)
        .get(ghostTarget)
        .should('not.have.length', 0)
      )
    )

    it('All mounted after check', () => cy
      .get('@container')
      .within(() => cy
        .get('input')
        .click()
        .get(ghostTarget)
        .should('have.length', 0)
        .get(`${mainTarget}:not(:visible)`)
        .should('have.length', 0)
        .get(mainTarget)
        .its('length')
        .as('childrenCount')
      )
    )

    it('Nothing changed after uncheck', () => cy
      .get('@container')
      .within(() => cy
        .get('input')
        .click()
        .get(ghostTarget)
        .should('have.length', 0)
        .get(`${mainTarget}:visible`)
        .should('have.length', 0)
        .get(mainTarget)
        .then(function($el) {
          expect($el.length).to.eq(this.childrenCount)
        })      
      )
    )
  })
})