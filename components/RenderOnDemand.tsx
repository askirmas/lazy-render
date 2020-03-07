import { PureComponent, createRef, RefObject, PropsWithChildren, createElement, Attributes, PropsWithRef } from "react"

type iState = {
  append: boolean
}

export type iProps = Partial<{
  /**
   * - `false` - append children to host
   * - `true` - replace host with children 
   */
  replaceNotAppend: boolean
  /**
   * [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API), optionally as CSS selector to
   * @default document.body
   */
  //TODO: add other IntersectionObserverInit
  root: Element | string 
  /**
   * @default "div"
   */
  //TODO: Deal with tracing createElement argument types
  tag: Parameters<typeof createElement>[0]
}> & Record<string, any>

export default class RenderOnDemand extends PureComponent<PropsWithChildren<iProps>, iState> {
  myRef: RefObject<any> = createRef()
  observer: IntersectionObserver|void = undefined
  state = {
    append: false
  }

  componentDidMount() {
    const append = () => this.setState({append: true})
    , { current } = /*this.props.ref*/ this.myRef 
    if (!current)
      return append()

    const {
      root: _r = document.body
    } = this.props
    , root = typeof _r === 'string'
    ? document.querySelector(_r)
    : _r
    if (!root)
      return append()
    const observer = (
      new IntersectionObserver(
        entries => {
          for (const entry of entries) {
            const {
              isIntersecting,
              intersectionRatio,
              //@ts-ignore Property 'isVisible' does not exist on type 'IntersectionObserverEntry'.ts(2339)
              //isVisible = true,
              //intersectionRect: {width, height}, 
            } = entry
            if (
              isIntersecting  && intersectionRatio
              // && isVisible 
              // && (width || height)
            ) {
              this.observer  = this.observer && this.observer.disconnect()
              //@ts-ignore Property 'requestIdleCallback' does not exist on type 'Window & typeof globalThis'.
              window.requestIdleCallback(append) // return id
              return;
            }
          }
        }, {
          root
        }
      )
    )
    observer.observe(current)
    this.observer = observer
  }
  
  componentWillUnmount() {
    this.observer && this.observer.disconnect()
  }

  render() {
    const {
      children = null,
      replaceNotAppend = false,
      tag = 'div',
      root,
      ...etc
    } = this.props
    , {
      append
    } = this.state
    , {
      myRef: ref,
    } = this
    , props: PropsWithRef<any> & Attributes = {...etc, ref}

    return replaceNotAppend
    ? (
      !append
      ? createElement(
        tag,
        props
      )
      : children
    )
    : createElement(
      tag,
      props,
      !append
      ? null
      : children
    )
  }
}

