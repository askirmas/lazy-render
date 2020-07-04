type Values<T> = T[keyof T] 
type Counts = Record<"main-visible"|"main-invisible"|"ghost-visible"|"ghost-invisible", number|true>

const cyAttr = (x?: string|number) => `[data-cypress${x === undefined ? "" : `="${x}"`}]`
, section = (x?: string|number) => `section${cyAttr(x)}`
, target = `.target`
, mainTarget = `${target}${cyAttr("child")}`
, ghostTarget = `${target}${cyAttr("ghost")}`
, externalInput = `input${cyAttr('external')}`
, internalInput = `input${cyAttr('internal')}`
, ghostInvisibleOnly: Counts = {
  "ghost-visible": 0,
  "ghost-invisible": true,
  "main-visible": 0,
  "main-invisible": 0,
}
, mainVisibleOnly: Counts = {
  "ghost-visible": 0,
  "ghost-invisible": 0,
  "main-visible": true,
  "main-invisible": 0,
}
, mainInvisibleOnly: Counts = {
  "ghost-visible": 0,
  "ghost-invisible": 0,
  "main-visible": 0,
  "main-invisible": true,
}
, ghostInvisible_x2: Partial<Counts> = {
  "ghost-invisible": 2
}
, weirdFullVisibility: Counts = {
  "main-visible": 1,
  "main-invisible": 0,
  "ghost-visible": 1,
  "ghost-invisible": 0,
} 

describe("MountOnDemand", () => {
  
  before(() => cy.visit("MountOnDemand"))

  it("suites count", () => cy
    .get(section())
    .should("have.length", 3)
  )

  myDescribe(0, "no class", () => {
    myIt("Everything rendered", () => cy
      .then(checkingCounts({mainInvisibleOnly}))
      .get(externalInput)
      .check()
      .then(checkingCounts({mainVisibleOnly}))
    )
  })

  myDescribe(1, "children structures", () => {
    myIt("No children", () => cy
      .then(checkingCounts({ghostInvisibleOnly}))
    )

    myIt("All mounted after check", () => cy
      .get(externalInput)
      .check()
      .then(checkingCounts({mainVisibleOnly}))
      .get(mainTarget)
      .its("length")
      .as("childrenCount")
    )

    myIt("Nothing changed after uncheck", () => cy
      .get(externalInput)
      .uncheck()
      .then(checkingCounts({mainInvisibleOnly}))
      .get(mainTarget)
      .its("length")
      .then(function(length) {
        expect(length).to.eq(this.childrenCount)
      })
    )
  })

  myDescribe(2, "#2 Dynamic children", () => {
    myIt("TBD", () => cy
      .then(checkingCounts({
        ghostInvisibleOnly,
        ghostInvisible_x2
      }))

      .get(internalInput)
      .check()

      .then(checkingCounts({
        ghostInvisibleOnly,
        ghostInvisible_x2
      }))

      .get(internalInput)
      .uncheck()
      .get(externalInput)
      .check()

      .then(checkingCounts({weirdFullVisibility}))

      .get(internalInput)
      .check()

      .then(checkingCounts({weirdFullVisibility}))
    )
  })
})

function checkingCounts(asserts: {[name: string]: Partial<Counts>}) {
  return () => {
    for (const assert in asserts) {
      const counts = asserts[assert]
      cy.log(assert)

      for (const kind in counts) {
        const kindCounts = counts[kind as keyof typeof counts]
        
        cy
        .get(`${
          kind.startsWith("main")
          ? mainTarget
          : ghostTarget 
        }${
          kind.endsWith("-visible")
          ? ":visible"
          : kind.endsWith("-invisible")
          ? ":not(:visible)"
          : ""
        }`)
        .should(
          `${kindCounts === true ? "not." : ""}have.length`,
          kindCounts === true ? 0 : kindCounts
        )
      }
    }
  }
}

function myDescribe(index: number, title: string, fn: (this: Mocha.Suite) => void) {
  describe(`${index}. ${title}`, () => {
    beforeEach(() => cy.get(section(index)).as("container"))
    fn.call(this)
  })
}

function myIt(title: string, fn: () => void) {
  it(title, () => cy.get("@container").within(fn))
}