import { MOUNTED, sStatuses } from "./defs"
import { createRef, ReactNode, Children } from "react"

const {values: $values} = Object

export {
  getKey, observeStatused, nextStatuses, onIntersectionEntries
}

function getKey(child: ReactNode): string|null {
  if (child === null || typeof child !== "object")
    return null
  //@ts-ignore
  return child.key
}

function observeStatused(observer: IntersectionObserver, statuses: sStatuses) {
  $values(statuses)
  .forEach(ref => {
    if (ref === null || typeof ref !== "object")
      return
    const el = ref.current
    if (el === null)
      return
    observer.observe(el)
  })
  // Alternative way:
  // for (const key in statuses) {
  //   const el = statuses[key]?.current
  //   if (el)
  //     observer?.observe(el)
  // }
}

function nextStatuses(statuses: sStatuses, children?: ReactNode) :sStatuses|null {
  const nextStatuses: typeof statuses = {}
  , deletedChildren = new Set<string>()
  , commonChildren = new Set<string>()

  let hasNew = false

  Children.forEach(children, child => {
    const key = getKey(child)
    if (typeof key !== "string")
      return

    if (statuses[key] !== undefined)
      return commonChildren.add(key)

    hasNew || (hasNew = true)
    nextStatuses[key] = createRef()
    return
  })

  for (const key in statuses) {
    if (statuses[key] === undefined)
      continue
    if (commonChildren.has(key))
      continue
    deletedChildren.add(key)
  }

  if (deletedChildren.size === 0)
    return !hasNew
    ? null
    : {...statuses, ...nextStatuses}
  else {
    for (const key of commonChildren)
      nextStatuses[key] = statuses[key]
    return nextStatuses
  }
}

function onIntersectionEntries(observer: IntersectionObserver, dataSetKey: string, entries: IntersectionObserverEntry[], statuses: sStatuses) {
  const appeared: typeof statuses = {} 
  let changed = false

  for (let i = entries.length; i--;) {
    const {
      isIntersecting,
      intersectionRatio,
      target,
      target: {
        //@ts-ignore
        dataset: {
          [dataSetKey]: key
        }
      }
      //@ts-ignore Property 'isVisible' does not exist on type 'IntersectionObserverEntry'.ts(2339)
      //TODO isVisible = true,
      //TODO intersectionRect: {width, height}, 
    } = entries[i]

    if (!(
      key &&
      isIntersecting  && intersectionRatio
      // && isVisible 
      // && (width || height)
    ))
      continue

    const ref = statuses[key]
    if (ref === null || typeof ref !== "object")
      continue
      
    const el = ref.current

    if (!el)
      continue
    if (el !== target)
      continue

    observer.unobserve(el)
    appeared[key] = MOUNTED
    changed || (changed = true)
  }

  return !changed 
  ? null
  : appeared
}
