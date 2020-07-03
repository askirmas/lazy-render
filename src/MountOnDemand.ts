import { PureComponent, createRef, RefObject, PropsWithChildren, createElement, Attributes, Children, ReactNode } from "react"

type iState = {
  statuses: Record<string, RefObject<HTMLInputElement> | null>
}

const {values: $values} = Object


//TODO self in DOM?
// props for ghosts
export type iProps = PropsWithChildren<Partial<{
  /**
   * [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API), optionally as CSS selector to
   * @default null means viewport 
   */
  //TODO: add other IntersectionObserverInit
  root: Element | string 
  /**
   * @default "div"
   */
  //TODO: Deal with tracing createElement argument types
  tag: Parameters<typeof createElement>[0]
}>> & Attributes

export default class MountOnDemand extends PureComponent<PropsWithChildren<iProps>, iState, unknown> {
  observer: IntersectionObserver|undefined = undefined
  state: iState = {
    statuses: {}
  }

  constructor(props: PropsWithChildren<iProps>, ctx: unknown) {
    super(props, ctx)
    const {children} = props
    , {statuses} = this.state

    Children.forEach(children, (child, i) =>
      // TODO pick from child
      statuses[getKey(child, i)] = createRef()
    )
  }

  componentDidMount() {
    const {
      root: _r = null
    } = this.props
    , root = typeof _r === 'string'
    ? document.querySelector(_r)
    : _r

    //TODO: External observer may be in props
    const observer = (
      new IntersectionObserver(
        entries => {
          for (const entry of entries) {
            const {
              isIntersecting,
              intersectionRatio,
              target: {
                //@ts-ignore
                dataset: {key}
              }
              //@ts-ignore Property 'isVisible' does not exist on type 'IntersectionObserverEntry'.ts(2339)
              //TODO isVisible = true,
              //TODO intersectionRect: {width, height}, 
            } = entry

            if (
              key &&
              isIntersecting  && intersectionRatio
              // && isVisible 
              // && (width || height)
            )
              this.setState(({statuses}) => {
                const el = statuses[key]?.current
                if (!el)
                  return null //{statuses}
                this.observer?.unobserve(el)
                return {statuses: {...statuses, [key]: null}}
              })
              // this.observer  = this.observer && this.observer.disconnect()
              //@ts-ignore Property 'requestIdleCallback' does not exist on type 'Window & typeof globalThis'.
          }
        }, {
          root
        }
      )
    )

    this.observer = observer
    this.componentDidUpdate()
  }
  
  componentWillUnmount() {
    this.observer && this.observer.disconnect()
  }

  componentDidUpdate() {
    const {observer} = this
    , {statuses} = this.state

    if (!observer)
      return
    
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

  render() {
    const {
      children,
      tag = 'div',
      root,
      ...etc
    } = this.props
    , {
      statuses
    } = this.state

    return Children.map(children, (child, i) => {
      const key = getKey(child, i)
      
      switch (statuses[key]) {
        case null:
          return child
        case undefined:
          statuses[key] = createRef()
        default:
          return createElement(
            tag,
            {
              ...etc,
              ...{
                key,
                "ref": statuses[key],
                "data-key": key
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