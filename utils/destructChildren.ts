import { ReactFragment, ReactNodeArray, Fragment } from "react"
export default destructChildren

function destructChildren<T extends ReactFragment>(children: T): ReactNodeArray
function destructChildren<T>(children: T[]): T
function destructChildren<T>(children: T): T
function destructChildren(holder: any) {
  if (!(holder && typeof holder === 'object'))
    return holder
  
  const destructed
  = Array.isArray(holder)
  ? holder.map(destructChildren)
  : 'type' in holder && holder.type === Fragment
  ? destructChildren(holder.props.children)
  : holder
  
  return typeof destructed.flat === 'function'
  ? destructed.flat()
  : destructed
}