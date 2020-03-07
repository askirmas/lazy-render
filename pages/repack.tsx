import { PropsWithChildren, Fragment, memo, ReactFragment, ReactNodeArray } from "react"
import { powered } from "../utils/arr_repack"

export default Page
const arrGen = (length: number) => new Array(length).fill(0)

function Page() {
  return <>
    <Repack>{
      arrGen(10).map((_, i) => <input {...{
        key: i,
        defaultValue: i,
        type: "number"
      }}/>)
    }</Repack>
    <Repack>
      <>{
        arrGen(10).map((_, i) => <input {...{
          key: i,
          defaultValue: i,
          type: "number"
          }}/>)
      }</>
    </Repack>
    <Repack>
      <Fragment>{
        arrGen(10).map((_, i) => <input {...{
          key: i,
          defaultValue: i,
          type: "number"
          }}/>)
      }</Fragment>
    </Repack>
  </>
}

/*---*/
function repacker(children: any) {
  return powered(3, destructFragment(children))
}
const Repack = memo(MyRepacker)
function MyRepacker({children, ...props}: PropsWithChildren<any>) {
  return <Repacker {...{
    ...props,
    repacker, repackContainer
  }}>{children}</Repacker>
}
/*---*/
function Repacker({children, key, repacker, repackContainer}: PropsWithChildren<any>) {
  return repackContainer(key,
    packArray(
      repacker(children),
      repackContainer
    )
  )
}

function repackContainer(i: number, children: any) {
  return <RepackContainer key={index2key(i)}>{children}</RepackContainer>
}

function index2key(i: number) {
  return `p${i}`
}
const RepackContainer = memo(RepackContainerRender)
function RepackContainerRender({children, ...props}: PropsWithChildren<any>) {
  return <span {...{
    style: {
      display: "contents"
    },
    ...props
  }}>{children}</span>
}

function destructFragment<T extends ReactFragment>(children: T): ReactNodeArray
function destructFragment<T>(children: T[]): T
function destructFragment<T>(children: T): T
function destructFragment(children: any) {
  if (!(children && typeof children === 'object'))
    return children
  if (Array.isArray(children))
    return children
  if ('type' in children && children.type === Fragment)
    return children.props.children
  return children
}

function packArray(children: any, creator: (i: number, children: any) => any) {
  if (!Array.isArray(children))
    return children
  
  const {length} = children
  , $result = Array(length)
  for (let i = length; i--;) {
    const child = children[i]
    $result[i] = !Array.isArray(child)
    ? child
    : creator(i, packArray(child, creator))
  }
  return $result
}