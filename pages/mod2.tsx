import {MountOnDemand} from '../src'
import './MountOnDemand.css'
import { createRef, RefObject, ReactNode } from 'react';

export default App;

const refs: RefObject<any>[] = new Array(4).fill(0).map(() => createRef())
, inputProps = {type: "checkbox", className: "Include"}
, divProping = (i: number) => ({className: "child", ref: refs[i]})

function App() {
  return <>
    <input {...inputProps}/>
    {
      //@ts-ignore
      <ConsoleChildren >
        <MountOnDemand {...{forwardedRef: refs[0]}}>
          <input {...{...inputProps, ref: refs[1]}}/>
          <div {...divProping(1)}>dn</div>
          <input {...{...inputProps, ref: refs[2]}}/>
          <div {...divProping(2)}>dn</div>
          <input {...{...inputProps, ref: refs[3]}}/>
          <div {...divProping(3)}>dn</div>
        </MountOnDemand>
      </ConsoleChildren>
    }
  </>
}

function ConsoleChildren({children}: {children?: ReactNode}): ReactNode {
  console.log(children)
  return children ?? null
}