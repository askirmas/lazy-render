import {MountOnDemand} from '../src'
import './MountOnDemand.scss'
import { Fragment, PropsWithChildren, createElement } from 'react'

const id = "MountOnDemand"

export default App

function App() {
  return <main {...{id}}>
    <H i="1">Mount on Demand</H>
    <section data-cypress="0">
      <H i="2">Note! Don't forget to apply CSS rule to MountOnDemand</H>
      <input className="display-none" type="checkbox"/>
      <article>
        <H i="3">No className</H>
        <MountOnDemand>
          <div title="no className" className="target" data-cypress="child"/>
        </MountOnDemand>
      </article>
      <article>
        <H i="3">Wrong className</H>     
        <MountOnDemand className="another-target">
          <div title="wrong className" className="target" data-cypress="child"/>
        </MountOnDemand>      
      </article>
    </section>
    <section data-cypress="1">
      <H i="2">Different children structures</H>
      <input className="display-none" type="checkbox"/>
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
  </main>
}


function H({children = [], i}: PropsWithChildren<{i: number|string}>) {
  const id = typeof children === "string" && children.replace(/\s/g, '-').toLocaleLowerCase()

  return createElement(
    `h${i}`,
    {id},
    [
      !id
      ? null 
      : <a key="a" href={`#${id}`}>#</a>
    ].concat(
      //@ts-ignore
      children
    )
  )
}