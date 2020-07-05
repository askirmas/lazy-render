/// <reference types="cypress" />

declare namespace Cypress {
  interface Cypress {
    testIn: {
      itIn: typeof itContained
      describeIn: typeof describeContained 
    }
  }
}


Cypress.testIn = {
  itIn: itContained,
  describeIn: describeContained
}

function describeContained(this: any, status: string, title: string, container: string = "", fn: Parameters<typeof statused>[3] = () => {}) {
  statused(
    describe,
    status,
    title,
    () => {
      beforeEach(() => cy.get(container).as("container"))
      fn.call(this)
    }
  )
}


function itContained(title: string, fn: Parameters<typeof statused>[3] = () => {}) {
  statused(
    it,
    title[0],
    title,
    () => cy.get("@container").within(fn)
  )
}

function statused(source: Mocha.TestFunction|Mocha.SuiteFunction, control: string, title: string,  fn: (this: Mocha.Suite) => void) {
  const s = control === '!'
  ? source.only
  : control === '*'
  ? source.skip
  : source

  //@ts-ignore
  s(title, fn)
}