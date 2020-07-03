import { PureComponent, createRef, RefObject, PropsWithChildren, createElement, Attributes, Children, ReactNode, AllHTMLAttributes } from "react"

type iMainProps = {
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
  tag: Parameters<typeof createElement>[0]
  /**
   * DOM attribute of dataset to use for ghosts
   * @default "key"
   */
  dataSetKey: string
}
type AllAttributes = AllHTMLAttributes<HTMLElement>
type RequiredProps = PropsWithChildren<iMainProps> & AllAttributes

export type iProps = PropsWithChildren<Partial<iMainProps>> & AllAttributes

type iState = {
  statuses: Record<string, RefObject<HTMLElement> | null>
}

const {values: $values} = Object

// TODO self in DOM?
// TODO props for ghosts
// TODO if ghost visible from the start, observer will not fire

export default class MountOnDemand extends PureComponent<PropsWithChildren<iProps>, iState, unknown> {
  static defaultProps: iMainProps = {
    root: null,
    tag: "div",
    dataSetKey: "key"
  }

  observer: IntersectionObserver|undefined = undefined
  state: iState = {statuses: {}}

  constructor(props: PropsWithChildren<iProps>, ctx: unknown) {
    super(props, ctx)
    const {children} = props
    , {statuses} = this.state

    Children.forEach(children, (child, i) => {
      const key = getKey(child, i)
      statuses[key] === undefined && (statuses[key] = /*TODO pick from child*/ createRef())
    })
  }

  componentDidMount() {
    const {
      root: _r
    } = this.props
    , root = typeof _r === 'string'
    ? document.querySelector(_r)
    : _r

    //TODO: External observer may be in props
    const observer = (
      new IntersectionObserver(
        entries => {
          const {observer} = this
          if (!observer)
            return
          const {dataSetKey} = this.props as iMainProps
          this.setState(({statuses}) => {
            const nextStatuses = onIntersectionEntries(observer, dataSetKey, entries, statuses)
            return nextStatuses && {statuses: nextStatuses}
          })
        }, {
          root
        }
      )
    )

    this.observer = observer
    this.componentDidUpdate()
  }
  
  componentWillUnmount() {
    const {observer} = this
    observer && observer.disconnect()
  }

  componentDidUpdate(prevProps?: iProps) {
    if (prevProps === this.props)
      return
    const {observer} = this
    observer && observeStatused(observer, this.state.statuses)
    this.setState(({statuses}) => {
      const next = nextStatuses(statuses, this.props.children)
      return next && {statuses: next}
    })
  }

  render() {
    const {
      children,
      tag,
      root,
      dataSetKey,
      ...etc
    } = this.props as RequiredProps
    , {
      statuses
    } = this.state
    , attribute = `data-${dataSetKey}`

    return Children.map(children, (child, i) => {
      const key = getKey(child, i)
      
      switch (statuses[key]) {
        case null:
          return child
        // case undefined:
        //   return null
        default:
          return createElement(
            tag,
            {
              ...etc,
              ...{
                key,
                "ref": statuses[key],
                [attribute]: key
              } as Attributes
            }
          )
      }
    })
  }
}

function getKey(child: ReactNode, index: number): string {
  //@ts-ignore
  return child?.key ?? `${index}`
}

function observeStatused(observer: IntersectionObserver, statuses: iState["statuses"]) {
  $values(statuses)
  .forEach(ref => {
    const el = ref?.current
    if (el)
      observer.observe(el)
  })
  // Alternative way:
  // for (const key in statuses) {
  //   const el = statuses[key]?.current
  //   if (el)
  //     observer?.observe(el)
  // }
}

function nextStatuses(statuses: iState["statuses"], children?: ReactNode) :iState["statuses"]|null {
  const nextStatuses: typeof statuses = {}
  , deletedChildren = new Set<string>()
  , commonChildren = new Set<string>()

  let hasNew = false

  Children.forEach(children, (child, i) => {
    const key = getKey(child, i)
    if (statuses[key] !== undefined) {
      commonChildren.add(key)
    } else {
      hasNew || (hasNew = true)
      nextStatuses[key] = createRef()
    }
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

function onIntersectionEntries(observer: IntersectionObserver, dataSetKey: string, entries: IntersectionObserverEntry[], statuses: iState["statuses"]) {
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

    const el = statuses[key]?.current

    if (!el)
      continue
    if (el !== target)
      continue

    observer.unobserve(el)
    appeared[key] = null
    changed || (changed = true)
  }

  return !changed 
  ? null
  : appeared
}