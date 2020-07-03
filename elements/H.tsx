import { PropsWithChildren, createElement } from "react"

export default H

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
