import {MountOnDemand} from '../src'
import './MountOnDemand.scss'
import { Fragment } from 'react'

const id = "MountOnDemand"

export default App

function App() {
  return <main {...{id}}>
    <section title="Different children structures">
      <input className="display-none" type="checkbox"/>
      <article title="Single child">
        <MountOnDemand>
          <div title="single" className="child"/>
        </MountOnDemand>
      </article>
      <article title="Several children">
        <MountOnDemand>
          <div key="first" title="first" className="child"/>
          <div key="second" title="second" className="child"/>
          <div key="third" title="third" className="child"/>
        </MountOnDemand>
      </article>
      <article title="Fragment shot syntax">
        <MountOnDemand>
          <>
            <div key="first" title="first" className="child"/>
            <div key="second" title="second" className="child"/>
            <div key="third" title="third" className="child"/>
          </>
        </MountOnDemand>
      </article>
      <article title="Fragment">
        <MountOnDemand>
          <Fragment>
            <div key="first" title="first" className="child"/>
            <div key="second" title="second" className="child"/>
            <div key="third" title="third" className="child"/>
          </Fragment>
        </MountOnDemand>
      </article>
      <article title="Array">
        <MountOnDemand>
          {[
            <div key="first" title="first" className="child"/>,
            <div key="second" title="second" className="child"/>,
            <div key="third" title="third" className="child"/>
          ]}
        </MountOnDemand>
      </article>
    </section>
  </main>
}
