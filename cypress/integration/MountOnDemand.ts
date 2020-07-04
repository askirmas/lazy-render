type Values<T> = T[keyof T] 
type Counts = Record<"child-visible"|"child-invisible"|"ghost-visible"|"ghost-invisible", number|true>

const cyAttr = (x?: string|number) => `[data-cypress${x === undefined ? "" : `="${x}"`}]`
, section = (x?: string|number) => `section${cyAttr(x)}`
, target = `.target`
, childTarget = `${target}${cyAttr("child")}`
, ghostTarget = `${target}${cyAttr("ghost")}`
, externalInput = `input${cyAttr('external')}`
, internalInput = `input${cyAttr('internal')}`
, only_invisible_ghosts: Counts = {
  "ghost-visible": 0,
  "ghost-invisible": true,
  "child-visible": 0,
  "child-invisible": 0,
}
, only_visible_children: Counts = {
  "ghost-visible": 0,
  "ghost-invisible": 0,
  "child-visible": true,
  "child-invisible": 0,
}
, only_hidden_children: Counts = {
  "ghost-visible": 0,
  "ghost-invisible": 0,
  "child-visible": 0,
  "child-invisible": true,
}
, two_invisible_ghosts: Partial<Counts> = {
  "ghost-invisible": 2
}
, weird_full_visibility: Counts = {
  "child-visible": 1,
  "child-invisible": 0,
  "ghost-visible": 1,
  "ghost-invisible": 0,
} 

describe("MountOnDemand", () => {
  
  before(() => cy.visit("MountOnDemand"))

  it("suites count", () => cy
    .get(section())
    .should("have.length", 3)
  )

  describeContained(0, "Note", () => {
    itContained("Ghosts are not hidden - Everything rendered", () => cy
      .then(checkingCounts({only_hidden_children}))
      .get(externalInput)
      .check()
      .then(checkingCounts({only_visible_children}))
    )

    it("Children without key are not affected")

    it("Props expected to be immutable")
  })

  describeContained(1, "Static children structures", () => {
    itContained("No children in DOM", () => cy
      .then(checkingCounts({only_invisible_ghosts}))
    )

    itContained("All children are mounted after check", () => cy
      .get(externalInput)
      .check()
      .then(checkingCounts({only_visible_children}))
      .get(childTarget)
      .its("length")
      .as("childrenCount")
    )

    itContained("Nothing changed after uncheck", () => cy
      .get(externalInput)
      .uncheck()
      .then(checkingCounts({only_hidden_children}))
      .get(childTarget)
      .its("length")
      .then(function(length) {
        expect(length).to.eq(this.childrenCount)
      })
    )
  })

  describeContained(2, "#2 Dynamic children", () => {
    itContained("TBD", () => cy
      .then(checkingCounts({
        only_invisible_ghosts,
        two_invisible_ghosts
      }))

      .get(internalInput)
      .check()

      .then(checkingCounts({
        only_invisible_ghosts,
        two_invisible_ghosts
      }))

      .get(internalInput)
      .uncheck()
      .get(externalInput)
      .check()

      .then(checkingCounts({weird_full_visibility}))

      .get(internalInput)
      .check()

      .then(checkingCounts({weird_full_visibility}))
    )
  })

  describe("3. Other CSS invisibilities", () => {
    it("visibility: hidden; z-index: -1")
    it("opacity: 0; z-index: -1")
    it("clip-path: polygon(0 0); z-index: -1")
  })

  describe("4. Observer options", () => {
  })

  describe("5. Own options", () => {
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
          kind.startsWith("child")
          ? childTarget
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

function describeContained(index: number, title: string, fn: (this: Mocha.Suite) => void) {
  describe(`${index}. ${title}`, () => {
    beforeEach(() => cy.get(section(index)).as("container"))
    fn.call(this)
  })
}

function itContained(title: string, fn: () => void) {
  it(title, () => cy.get("@container").within(fn))
}