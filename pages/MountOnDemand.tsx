import {MountOnDemand} from '../src'
import './MountOnDemand.scss'
import { Fragment } from 'react'
import H from '../elements/H'
import DynamicChildren from '../components/DynamicChildren'

const id = "MountOnDemand"

export default App

function App() {
  return <main {...{id}}>
   <H i="1">Mount on Demand</H>
    <section data-cypress="0">
      <H i="2">No ghosting</H>
      <input className="display-none" type="checkbox" data-cypress="external"/>
      <article>
        <H i="3">No rule to hide ghost - no className</H>
        <MountOnDemand>
          <div title="no className" className="target" data-cypress="child"/>
        </MountOnDemand>
      </article>
      <article>
        <H i="3">No rule to hide ghost - wrong className</H>     
        <MountOnDemand className="another-target">
          <div title="wrong className" className="target" data-cypress="child"/>
        </MountOnDemand>      
      </article>
    </section>

    <section data-cypress="1">
      <H i="2">Different children structures</H>
      <input className="display-none" type="checkbox" data-cypress="external"/>
      <article>
        <H i="3">Single child</H>
        <MountOnDemand className="target" data-cypress="ghost">
          <div title="single" className="target" data-cypress="child"/>
        </MountOnDemand>
      </article>
      <article>
        <H i="3">Several children</H>
        <MountOnDemand className="target" data-cypress="ghost">
          <div key="first" title="first" className="target" data-cypress="child"/>
          <div key="second" title="second" className="target" data-cypress="child"/>
          <div key="third" title="third" className="target" data-cypress="child"/>
        </MountOnDemand>
      </article>
      <article>
        <H i="3">Fragment shot syntax</H>
        <MountOnDemand className="target" data-cypress="ghost">
          <>
            <div key="first" title="first" className="target" data-cypress="child"/>
            <div key="second" title="second" className="target" data-cypress="child"/>
            <div key="third" title="third" className="target" data-cypress="child"/>
          </>
        </MountOnDemand>
      </article>
      <article>
        <H i="3">Fragment</H>
        <MountOnDemand className="target" data-cypress="ghost">
          <Fragment>
            <div key="first" title="first" className="target" data-cypress="child"/>
            <div key="second" title="second" className="target" data-cypress="child"/>
            <div key="third" title="third" className="target" data-cypress="child"/>
          </Fragment>
        </MountOnDemand>
      </article>
      <article>
        <H i="3">Array</H>
        <MountOnDemand className="target" data-cypress="ghost">
          {[
            <div key="first" title="first" className="target" data-cypress="child"/>,
            <div key="second" title="second" className="target" data-cypress="child"/>,
            <div key="third" title="third" className="target" data-cypress="child"/>
          ]}
        </MountOnDemand>
      </article>
    </section>
    <section data-cypress="2">
      <H i="2">Dynamic hidden children - -</H>
      <input type="checkbox" className="display-none" data-cypress="external"/>
      <article>
        <DynamicChildren className="target" data-cypress="ghost">
          <div key="first" title="first" className="target" data-cypress="child"/>
          <div key="second" title="second" className="target" data-cypress="child"/>
        </DynamicChildren>
      </article>
    </section>
    <section data-cypress="3">
      <H i="2">Dynamic visible children - +</H>
      <input type="checkbox" className="display-none" data-cypress="external"/>
      <article>
        <DynamicChildren className="target" defaultChecked={true} data-cypress="ghost">
          <div key="first" title="first" className="target" data-cypress="child"/>
          <div key="second" title="second" className="target" data-cypress="child"/>
        </DynamicChildren>
      </article>
    </section>
    <section data-cypress="4">
      <H i="2">Dynamic hidden children + -</H>
      <input type="checkbox" className="display-none" defaultChecked={true} data-cypress="external"/>
      <article>
        <DynamicChildren className="target" data-cypress="ghost">
          <div key="first" title="first" className="target" data-cypress="child"/>
          <div key="second" title="second" className="target" data-cypress="child"/>
        </DynamicChildren>
      </article>
    </section>
    <section data-cypress="5">
      <H i="2">Dynamic visible children + +</H>
      <input type="checkbox" className="display-none" defaultChecked={true} data-cypress="external"/>
      <article>
        <DynamicChildren className="target" defaultChecked={true} data-cypress="ghost">
          <div key="first" title="first" className="target" data-cypress="child"/>
          <div key="second" title="second" className="target" data-cypress="child"/>
        </DynamicChildren>
      </article>
    </section>
  </main>
}
