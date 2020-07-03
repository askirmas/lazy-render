import { PureComponent, Children, PropsWithChildren, ChangeEventHandler } from "react";
import { MountOnDemand } from "../src";
import { AllAttributes } from "../defs";

type iState = {checked: boolean}
export type iProps = PropsWithChildren<AllAttributes>
export default class DynamicChildren extends PureComponent<iProps, iState> {
  state = {
    checked: false
  }

  constructor(props: iProps) {
    super(props)
    const {checked} = props
    if (checked)
      this.state.checked = checked
  }
  changeChecked: ChangeEventHandler<HTMLInputElement> = ({target: {checked}}) => this.setState(({checked}))
  render() {
    const {
      props: {children, ...props},
      state: {checked},
      changeChecked
    } = this

    return <>
      <input type="checkbox" onChange={changeChecked}/>
      <MountOnDemand {...props}>
        { Children.map(children, (child, i) => (i === 0 || checked) && child) }
      </MountOnDemand>
    </>
  }
}