import {MountOnDemand} from '../src'
import './MountOnDemand.css'

export default App;

const classNaming = (...args: string[]) => ({className: `renderOnDemand ${args.join(' ')}`})

function App() {
  return <>
    <input type="checkbox"/>
    <MountOnDemand {...classNaming('works','dn')}>
      <div className="child">dn</div>
    </MountOnDemand>
  </>
}
