import React, { PureComponent, createRef, RefObject, PropsWithChildren } from "react"

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
   */
  root: Element | string
}>

export default class RenderOnDemand extends PureComponent<PropsWithChildren<iProps>, iState> {
  myRef: RefObject<any> = createRef()
  observer: IntersectionObserver|void = undefined
  state = {
    append: false
  }

  componentDidMount() {
    const append = () => this.setState({append: true})
    , { current } = this.myRef
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
          for (const {isIntersecting, intersectionRatio} of entries)
            if (isIntersecting && intersectionRatio) {
              this.observer  = this.observer && this.observer.disconnect()
              //@ts-ignore Property 'requestIdleCallback' does not exist on type 'Window & typeof globalThis'.
              window.requestIdleCallback(append) // return id
              return;
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
      ...etc
    } = this.props
    , {
      append
    } = this.state
    , {
      myRef: ref,
    } = this
    , props = {ref, ...etc}

    return replaceNotAppend
    ? (
      !append
      ? <div {...props}/>
      : children
    )
    : <div {...props}>{
      !append
      ? null
      : children
    }</div>
  }
}

