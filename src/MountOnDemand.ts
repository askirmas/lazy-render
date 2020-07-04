import { PureComponent, createRef, PropsWithChildren, createElement, Attributes, Children, ReactNode } from "react"
import { AllAttributes } from "../defs"
import { defaultProps, MOUNTED, sStatuses, Props } from "./MountOnDemand.defs"

type RequiredProps = PropsWithChildren<Props> & AllAttributes

export type iProps = PropsWithChildren<Partial<Props>> & AllAttributes

type iState = {
  statuses: sStatuses
}

const {values: $values} = Object

// TODO self in DOM?
// TODO props for ghosts
// TODO if ghost visible from the start, observer will not fire

export default class MountOnDemand extends PureComponent<PropsWithChildren<iProps>, iState, unknown> {
  static defaultProps: Props = defaultProps

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
          const {dataSetKey} = this.props as Props
          this.setState(({statuses}) => {
            const nextStatuses = onIntersectionEntries(observer, dataSetKey, entries, statuses)
            return nextStatuses && {statuses: {...statuses, ...nextStatuses}}
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
        case MOUNTED:
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