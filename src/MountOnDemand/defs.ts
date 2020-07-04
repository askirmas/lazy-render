import { RefObject } from "react"

const MOUNTED
= true
// = true as const
, defaultProps: Props = {
  root: null,
  tag: "div",
  dataSetKey: "key"
}

export type Props = {
  /**
   * [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API), optionally as CSS selector to
   * @default null means viewport 
   */
  //TODO: add other IntersectionObserverInit
  root: Element | string | null
  /**
   * @default "div"
   */
  //TODO: Deal with tracing createElement argument types
  tag: string //TODO consider Parameters<typeof createElement>[0]
  /**
   * DOM attribute of dataset to use for ghosts
   * @default "key"
   */
  dataSetKey: string
}

export type sStatuses = Record<string, /*undefined | */ RefObject<HTMLElement> | typeof MOUNTED>


export {
  MOUNTED, defaultProps
} 

