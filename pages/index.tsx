import RenderOnDemand from '../components/RenderOnDemand'

export default App;

const className = 'renderOnDemand'
, nth = (n: number) => `~.${className}`.repeat(n)

function App() {
  return <>
    <input type="checkbox"/>
    <style>{`
      input:not(:checked)${nth(1)} {
        display: none;
      }
    `}</style>
    <RenderOnDemand {...{className}}>
      <div className="child">a</div>
    </RenderOnDemand>
    <style>{`
      input:not(:checked) ~ .${nth(2)} {
        overflow: hidden;
        width: 0;
        height: 0;
      }
    `}</style>
    <RenderOnDemand {...{className}}>
      <div className="child">b</div>
    </RenderOnDemand>
  </>
}
