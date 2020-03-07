export {
  powered
}

interface iNested<T> {
  [k: number]: T | Nested<T>
}
type Nested<T> = iNested<T> & T[]

function powered<T>(max: number, children: T[], preserve = false): Nested<T> {
  const m = max - 1
  , {length} = children
  if (!(length && m > 0))
    return children
  const $return = preserve ? new Array(max) : []
  , digits = [0]

  $return[0] = children[0]
  for (let i = 1; i < length; i++) {
    let pointer = $return
    const {length: dl} = digits
    for (let d = dl; d--; ) {
      const dig = digits[d] + 1
      if (!(dig in pointer))
        pointer[dig] = preserve ? new Array(max) : []
      pointer = pointer[dig]
    }
    pointer[0] = children[i]

    let add = true
    for (let d = 0; d < dl; d++) {
      const dig = digits[d]
      const digNext: number = dig + (add as unknown as number)
      add = digNext >= m
      digits[d] = digNext % m
    }
    if (add)
      digits.push(0)
  } 
  return $return
}