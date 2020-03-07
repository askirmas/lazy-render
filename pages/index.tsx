import RenderOnDemand from '../components/RenderOnDemand'

export default App;

function App() {
  return <>
    <style>{`
      input:not(:checked) ~ .renderOnDemand {
        display: none;
      }
    `}</style>
    <input type="checkbox"/>
    <RenderOnDemand 
      tag="div"
      className="renderOnDemand"
    >
      <div className="child">a</div>
      <div className="child">b</div>
    </RenderOnDemand>
  </>
}
