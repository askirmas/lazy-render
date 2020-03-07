import RenderOnDemand from '../components/RenderOnDemand'
import './index.css'

export default App;

const classNaming = (...args: string[]) => ({className: `renderOnDemand ${args.join(' ')}`})

function App() {
  return <>
    <input type="checkbox"/>
    <RenderOnDemand {...classNaming('works','dn')}>
      <div className="child">a</div>
    </RenderOnDemand>
    <RenderOnDemand {...classNaming('wh0')}>
      <div className="child">b</div>
    </RenderOnDemand>
  </>
}
