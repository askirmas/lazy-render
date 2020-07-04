type Values<T> = T[keyof T] 
type Counts = Record<"child-visible"|"child-invisible"|"ghost-visible"|"ghost-invisible", number|true>

type func = (...args: unknown[]) => unknown

const nop = () => {}
, cyAttr = (x?: string|number) => `[data-cypress${x === undefined ? "" : `="${x}"`}]`
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
, each_hidden: Counts = {
  "child-visible": 0,
  "child-invisible": 1,
  "ghost-visible": 0,
  "ghost-invisible": 1,
} 
, two_invisible_ghosts: Partial<Counts> = {
  "ghost-invisible": 2
}
, one_visible_child: Partial<Counts> = {
  "child-visible": 1
}
, two_visible_children: Partial<Counts> = {
  "child-visible": 2
}
, weird_visibility: Counts = {
  "child-visible": 1,
  "child-invisible": 0,
  "ghost-visible": 1,
  "ghost-invisible": 0,
} 

describe("MountOnDemand", () => {
  
  before(() => cy.visit("MountOnDemand"))

  it("suites count", () => cy
    .get(section())
    .should("have.length", 6)
  )

  describeContained(0, "Note", () => {
    itContained("UNST Ghosts are not hidden - Everything rendered", () => cy
      .then(checkingCounts({only_hidden_children}))
      .get(externalInput)
      .check()
      .then(checkingCounts({only_visible_children}))
    )

    it("TBD Children without key are not affected")

    it("TBD Props expected to be immutable")
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

  describeContained(2, "#2 Dynamic children  - -", () => {
    itContained("RES", () => cy
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

      .then(checkingCounts({weird_visibility}))

      .get(internalInput)
      .check()

      .then(checkingCounts({weird_visibility}))
    )
  })

  describeContained(3, "#2 Dynamic children - +", () => {
    itContained("RES", () => cy
      .then(checkingCounts({
        only_invisible_ghosts,
        two_invisible_ghosts
      }))

      .get(internalInput)
      .uncheck()

      .then(checkingCounts({
        only_invisible_ghosts,
        two_invisible_ghosts
      }))

      .get(internalInput)
      .check()
      .get(externalInput)
      .check()

      .then(checkingCounts({weird_visibility}))

      .get(internalInput)
      .uncheck()

      .then(checkingCounts({weird_visibility}))
    )
  })

  describeContained(4, "#2 Dynamic children + -", () => {
    itContained("RES", () => cy
      .then(checkingCounts({
        only_visible_children,
        one_visible_child
      }))

      .get(internalInput)
      .check()

      .then(checkingCounts({weird_visibility}))

      .get(internalInput)
      .uncheck()
      .get(externalInput)
      .uncheck()

      .then(checkingCounts({each_hidden}))

      .get(internalInput)
      .check()

      .then(checkingCounts({each_hidden}))
    )
  })

  describeContained(5, "#2 Dynamic children + +", () => {
    itContained("RES", () => cy
      .then(checkingCounts({
        only_visible_children,
        two_visible_children
      }))

      .get(internalInput)
      .uncheck()

      .then(checkingCounts({weird_visibility}))

      .get(internalInput)
      .check()
      .get(externalInput)
      .uncheck()

      .then(checkingCounts({each_hidden}))

      .get(internalInput)
      .uncheck()

      .then(checkingCounts({each_hidden}))
    )
  })


  describeContained(-1, "* Other CSS invisibilities", () => {
    itContained("* visibility: hidden; z-index: -1")
    itContained("* opacity: 0; z-index: -1")
    itContained("* clip-path: polygon(0 0); z-index: -1")
  })

  describeContained(-1, "* Other CSS invisibilities", () => {
    itContained("* visibility: hidden; z-index: -1")
    itContained("* opacity: 0; z-index: -1")
    itContained("* clip-path: polygon(0 0); z-index: -1")
  })

  describeContained(-1, "* Observer options")

  describeContained(-1, "* Own options")
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

function describeContained(index: number, title: string, fn: Parameters<typeof statused>[3] = nop) {
  statused(
    describe,
    title[0],
    `${index}. ${title}`,
    () => {
      beforeEach(() => cy.get(section(index)).as("container"))
      fn.call(this)
    }
  )
}

function itContained(title: string, fn: Parameters<typeof statused>[3] = nop) {
  statused(
    it,
    title[0],
    title,
    () => cy.get("@container").within(fn.bind(this))
  )
}



function statused(source: func & Record<"only"|"skip", func>, control: string, title: string,  fn: (this: Mocha.Suite) => void) {
  const s = control === '!'
  ? source.only
  : control === '*'
  ? source.skip
  : source

  s(title, fn)
}