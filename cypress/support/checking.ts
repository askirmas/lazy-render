Cypress.Commands.overwrite('check', (fn, el, ...args) => {
  expect(el.prop("checked")).to.not.eq(true)
  return fn(el, ...args)
})
  
Cypress.Commands.overwrite('uncheck', (fn, el, ...args) => {
  expect(el.prop("checked")).to.not.eq(false)
  return fn(el, ...args)
})
  