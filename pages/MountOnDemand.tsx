import {MountOnDemand} from '../src'
import './MountOnDemand.scss'
import { Fragment } from 'react'

const id = "MountOnDemand"

export default App

function App() {
  return <main {...{id}}>
    <section title="Note! Don't forget to apply CSS rule to MountOnDemand" data-index="0">
      <input className="display-none" type="checkbox"/>
      <article title="No className">
        <MountOnDemand>
          <div title="no className" className="main target"/>
        </MountOnDemand>
      </article>
      <article title="Wrong className">     
        <MountOnDemand className="another-target">
          <div title="wrong className" className="main target"/>
        </MountOnDemand>      
      </article>
    </section>
    <section title="Different children structures" data-index="1">
      <input className="display-none" type="checkbox"/>
      <article title="Single child">
        <MountOnDemand className="ghost target">
          <div title="single" className="main target"/>
        </MountOnDemand>
      </article>
      <article title="Several children">
        <MountOnDemand className="ghost target">
          <div key="first" title="first" className="main target"/>
          <div key="second" title="second" className="main target"/>
          <div key="third" title="third" className="main target"/>
        </MountOnDemand>
      </article>
      <article title="Fragment shot syntax">
        <MountOnDemand className="ghost target">
          <>
            <div key="first" title="first" className="main target"/>
            <div key="second" title="second" className="main target"/>
            <div key="third" title="third" className="main target"/>
          </>
        </MountOnDemand>
      </article>
      <article title="Fragment">
        <MountOnDemand className="ghost target">
          <Fragment>
            <div key="first" title="first" className="main target"/>
            <div key="second" title="second" className="main target"/>
            <div key="third" title="third" className="main target"/>
          </Fragment>
        </MountOnDemand>
      </article>
      <article title="Array">
        <MountOnDemand className="ghost target">
          {[
            <div key="first" title="first" className="main target"/>,
            <div key="second" title="second" className="main target"/>,
            <div key="third" title="third" className="main target"/>
          ]}
        </MountOnDemand>
      </article>
    </section>
  </main>
}
