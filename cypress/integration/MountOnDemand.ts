const cyAttr = (x?: string|number) => `[data-cypress${x === undefined ? '' : `="${x}"`}]`
, section = (x?: string|number) => `section${cyAttr(x)}`
, target = `.target`
, mainTarget = `${target}${cyAttr('child')}`
, ghostTarget = `${target}${cyAttr('ghost')}`

describe('MountOnDemand', () => {
  before(() => cy.visit('MountOnDemand'))

  it('suites count', () => cy
    .get(section())
    .should('have.length', 3)
  )

  describe("0. no class", () => {
    beforeEach(() => cy.get(section(0)).as("container"))

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
    beforeEach(() => cy.get(section(1)).as("container"))

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

    describe.only('#2 Dynamic children', () => {
      beforeEach(() => cy.get(section(2)).as("container"))

      it('TBD', () => cy
        .get('@container')
        .within(() => cy
          .get(mainTarget)
          .should('have.length', 0)
          .get(`${mainTarget}:visible`)
          .should('have.length', 0)
          .get(ghostTarget)
          .should('have.length', 2)
          .get(`${ghostTarget}:visible`)
          .should('have.length', 0)

          .get('article input')
          .click()

          .get(mainTarget)
          .should('have.length', 0)
          .get(`${mainTarget}:visible`)
          .should('have.length', 0)
          .get(ghostTarget)
          .should('have.length', 2)
          .get(`${ghostTarget}:visible`)
          .should('have.length', 0)

          .get('article input')
          .click()
          .get('h2 + input')
          .click()

          .get(mainTarget)
          .should('have.length', 1)
          .get(`${mainTarget}:visible`)
          .should('have.length', 1)
          .get(ghostTarget)
          .should('have.length', 1)
          .get(`${ghostTarget}:visible`)
          .should('have.length', 1)

          .get('article input')
          .click()

          .get(mainTarget)
          .should('have.length', 1)
          .get(`${mainTarget}:visible`)
          .should('have.length', 1)
          .get(ghostTarget)
          .should('have.length', 1)
          .get(`${ghostTarget}:visible`)
          .should('have.length', 1)
        )
      )
    })
  })
})