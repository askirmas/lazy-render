import { Fragment } from "react";
import destructChildren from "../utils/destructChildren";

export default Pack

function Pack() {
  const f1 = <Fragment key="f1">{[
    <div key="el1"/>,
    <div key="el2"/>
  ]}</Fragment>
  , f2 = <Fragment key="f2">
    <div key="el3"/>
    <div key="el4"/>
  </Fragment>
  , f3 = [
    <div key="el5"/>,
    <div key="el6"/>
  ]
  , $return = <>{f1}{f2}{f3}</>
  , destructed = destructChildren($return)
  console.log(destructed)
  try {
    //@ts-ignore
    window.somekey = $return.props.children[0].key
  }  catch (e) {}
  return destructed
} 