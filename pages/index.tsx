import RenderOnDemand from '../components/RenderOnDemand'

export default App;

function App() {
  return <>
    <style>{`
      input:not(:checked) ~ * {
        display: none;
      }
    `}</style>
    <input type="checkbox"/>
    <RenderOnDemand>
      <div className="child">a</div>
      <div className="child">b</div>
    </RenderOnDemand>
  </>
}
