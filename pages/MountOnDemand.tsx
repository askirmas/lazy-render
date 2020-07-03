import {MountOnDemand} from '../src'
import './MountOnDemand.css'

export default App

function App() {
  return <>
    <input type="checkbox"/>
    <MountOnDemand className="mountOnDemand display-none">
      <div className="child">dn</div>
    </MountOnDemand>
  </>
}
