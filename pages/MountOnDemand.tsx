import {MountOnDemand} from '../src'
import './MountOnDemand.scss'
import { Fragment } from 'react'

const id = "MountOnDemand"

export default App

function App() {
  return <main {...{id}}>
    <h1>Mount on Demand</h1>
    <section data-cypress="0">
      <h2>Note! Don't forget to apply CSS rule to MountOnDemand</h2>
      <input className="display-none" type="checkbox"/>
      <article>
        <h3>No className</h3>
        <MountOnDemand>
          <div title="no className" className="target" data-cypress="child"/>
        </MountOnDemand>
      </article>
      <article>
        <h3>Wrong className</h3>     
        <MountOnDemand className="another-target">
          <div title="wrong className" className="target" data-cypress="child"/>
        </MountOnDemand>      
      </article>
    </section>
    <section data-cypress="1">
      <h2>Different children structures</h2>
      <input className="display-none" type="checkbox"/>
      <article>
        <h3>Single child</h3>
        <MountOnDemand className="target" data-cypress="ghost">
          <div title="single" className="target" data-cypress="child"/>
        </MountOnDemand>
      </article>
      <article>
        <h3>Several children</h3>
        <MountOnDemand className="target" data-cypress="ghost">
          <div key="first" title="first" className="target" data-cypress="child"/>
          <div key="second" title="second" className="target" data-cypress="child"/>
          <div key="third" title="third" className="target" data-cypress="child"/>
        </MountOnDemand>
      </article>
      <article>
        <h3>Fragment shot syntax</h3>
        <MountOnDemand className="target" data-cypress="ghost">
          <>
            <div key="first" title="first" className="target" data-cypress="child"/>
            <div key="second" title="second" className="target" data-cypress="child"/>
            <div key="third" title="third" className="target" data-cypress="child"/>
          </>
        </MountOnDemand>
      </article>
      <article>
        <h3>Fragment</h3>
        <MountOnDemand className="target" data-cypress="ghost">
          <Fragment>
            <div key="first" title="first" className="target" data-cypress="child"/>
            <div key="second" title="second" className="target" data-cypress="child"/>
            <div key="third" title="third" className="target" data-cypress="child"/>
          </Fragment>
        </MountOnDemand>
      </article>
      <article>
        <h3>Array</h3>
        <MountOnDemand className="target" data-cypress="ghost">
          {[
            <div key="first" title="first" className="target" data-cypress="child"/>,
            <div key="second" title="second" className="target" data-cypress="child"/>,
            <div key="third" title="third" className="target" data-cypress="child"/>
          ]}
        </MountOnDemand>
      </article>
    </section>
  </main>
}
