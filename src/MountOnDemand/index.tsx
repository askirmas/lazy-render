import { PureComponent, PropsWithChildren, createElement, Attributes, Children } from "react"
import { AllAttributes } from "../../defs"
import { defaultProps, MOUNTED, sStatuses, Props } from "./defs"
import { getKey, onIntersectionEntries, observeStatused, nextStatuses } from "./helpers"

type RequiredProps = PropsWithChildren<Props> & AllAttributes

export type iProps = PropsWithChildren<Partial<Props>> & AllAttributes

type iState = {
  statuses: sStatuses
}

// TODO self in DOM?
// TODO props for ghosts
// TODO if ghost visible from the start, observer will not fire

export default class MountOnDemand extends PureComponent<PropsWithChildren<iProps>, iState, unknown> {
  static defaultProps: Props = defaultProps

  observer: IntersectionObserver|undefined = undefined
  state: iState = {statuses: {}}

  constructor(props: PropsWithChildren<iProps>, ctx: unknown) {
    super(props, ctx)
    
    this.state.statuses = nextStatuses({}, this.props.children) ?? {}
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
