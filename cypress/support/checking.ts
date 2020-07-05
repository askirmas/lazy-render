Cypress.Commands.overwrite('check', (fn, el, ...args) => {
  if (el.prop("checked") === true)
    throw Error('.check() failed - already checked')
  return fn(el, ...args)
})
  
Cypress.Commands.overwrite('uncheck', (fn, el, ...args) => {
  if (el.prop("checked") !== true)
    throw Error('.uncheck() failed - already not checked')
  return fn(el, ...args)
})
  