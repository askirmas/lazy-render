import {MountOnDemand} from '../src'
import './MountOnDemand.scss'
import { Fragment } from 'react'

const id = "MountOnDemand"

export default App

function App() {
  return <main {...{id}}>
    <input type="checkbox"/>
    <MountOnDemand key="singleChild">
      <div className="child">dn</div>
    </MountOnDemand>
    <MountOnDemand key="SeveralChildren">
      <div key="first" className="child">dn</div>
      <div key="second" className="child">dn</div>
    </MountOnDemand>
    <MountOnDemand key="frag">
      <>
        <div key="first" className="child">dn</div>
        <div key="second" className="child">dn</div>
      </>
    </MountOnDemand>
    <MountOnDemand key="Fragment">
      <Fragment key="fragment">
        <div key="first" className="child">dn</div>
        <div key="second" className="child">dn</div>
      </Fragment>
    </MountOnDemand>
    <MountOnDemand key="Array">
      {[
        <div key="first" className="child">dn</div>,
        <div key="second" className="child">dn</div>
      ]}
    </MountOnDemand>
  </main>
}
