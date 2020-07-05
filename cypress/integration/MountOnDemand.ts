type Values<T> = T[keyof T] 
type Counts = Record<"child-visible"|"child-invisible"|"ghost-visible"|"ghost-invisible", number|true>

type func = (...args: unknown[]) => unknown

const nop = () => {}

describe("MountOnDemand", () => {
  const {testIn: {itIn, describeIn}} = Cypress
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
  , one_hidden_child: Partial<Counts> = {
    "child-invisible": 1
  }
  , one_hidden_ghost: Partial<Counts> = {
    "ghost-invisible": 1
  }
  , two_hidden_ghosts: Partial<Counts> = {
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
  
  before(() => cy.visit("MountOnDemand"))

  it("suites count", () => cy
    .get(section())
    .should("have.length", 6)
  )

  describeIn("+", "0 Note", section(0), () => {
    itIn("UNST Ghosts are not hidden - Everything rendered. DONE key mandatory", () => cy
      .then(checkingCounts({only_hidden_children}))
      .get(externalInput)
      .check()
      .then(checkingCounts({only_visible_children}))
    )

    it("TBD Props expected to be immutable")
  })

  describeIn("+", "1 Static children structures", section(1), () => {
    itIn("No children in DOM", () => cy
      .then(checkingCounts({only_invisible_ghosts}))
    )

    itIn("All children are mounted after check", () => cy
      .get(externalInput)
      .check()
      .then(checkingCounts({only_visible_children}))
      .get(childTarget)
      .its("length")
      .as("childrenCount")
    )

    itIn("Nothing changed after uncheck", () => cy
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

  describeIn("+", "2 #2 Dynamic children  - -", section(2), () => {
    itIn("RES", () => cy
      .then(keyStatuses({
        "first": ["ghost", false]
      }))
      .get(internalInput)
      .check()

      .then(keyStatuses({
        "first": ["ghost", false],
        "second": ["ghost", false],
      }))

      .get(internalInput)
      .uncheck()
      .get(externalInput)
      .check()

      .then(keyStatuses({
        "first": ["child", true]
      }))

      .get(internalInput)
      .check()

      .then(checkingCounts({weird_visibility}))
      .then(keyStatuses({
        "first": ["child", true],
        "second": ["ghost", true]
      }))
    )
  })

  describeIn("+", "3 ! #2 Dynamic children - +", section(3), () => {
    itIn("RES", () => cy
      .then(checkingCounts({
        only_invisible_ghosts,
        two_hidden_ghosts
      }))
      .then(keyStatuses({
        "first": ["ghost", false],
        "second": ["ghost", false],
      }))

      .get(internalInput)
      .uncheck()

      .then(checkingCounts({
        only_invisible_ghosts,
        one_hidden_ghost
      }))
      .then(keyStatuses({
        "first": ["ghost", false],
      }))

      .get(internalInput)
      .check()
      .get(externalInput)
      .check()

      .then(checkingCounts({weird_visibility}))

      .get(internalInput)
      .uncheck()

      .then(checkingCounts({
        only_visible_children,
        one_visible_child
      }))
    )
  })

  describeIn("+", "4 #2 Dynamic children + -", section(4), () => {
    itIn("RES", () => cy
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

      .then(checkingCounts({
        only_hidden_children,
        one_hidden_child
      }))
      
      .get(internalInput)
      .check()

      .then(checkingCounts({each_hidden}))
    )
  })

  describeIn("+", "5 #2 Dynamic children + +", section(5), () => {
    itIn("RES", () => cy
      .then(checkingCounts({
        only_visible_children,
        two_visible_children
      }))

      .get(internalInput)
      .uncheck()

      .then(checkingCounts({
        only_visible_children,
        one_visible_child
      }))

      .get(internalInput)
      .check()
      .get(externalInput)
      .uncheck()

      .then(checkingCounts({each_hidden}))

      .get(internalInput)
      .uncheck()

      .then(checkingCounts({
        only_hidden_children,
        one_hidden_child
      }))
    )
  })


  describeIn("*", "* -1 Other CSS invisibilities", "", () => {
    itIn("* visibility: hidden; z-index: -1")
    itIn("* opacity: 0; z-index: -1")
    itIn("* clip-path: polygon(0 0); z-index: -1")
  })

  describeIn("*", "* -1 Other CSS invisibilities", "", () => {
    itIn("* visibility: hidden; z-index: -1")
    itIn("* opacity: 0; z-index: -1")
    itIn("* clip-path: polygon(0 0); z-index: -1")
  })

  describeIn("*", "-1 Observer options")

  describeIn("*", "-1 Own options")

  function keyStatuses(data:  Partial<Record<"first"|"second", ["child"|"ghost", boolean]>>) {
    return () => cy
    .get(target)
    .then($els => {
      const statuses: Partial<Record<"first"|"second", ["child"|"ghost"|undefined, boolean]>> = {}
      $els.each((_, el) => {
        cy.log(el.tagName)
        //@ts-ignore
        statuses[
          (el.getAttribute('title') ?? el.dataset.key ?? 'undefined')
          .replace(/^\.\$/, '')
        ] = [
          //@ts-ignore
          el.dataset.cypress,
          Cypress.$(el).is(":visible")
        ]
      })

      expect(statuses).to.deep.eq(data)
    })
  }

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
})
