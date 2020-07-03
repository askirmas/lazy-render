import './hidden.scss'

const id = "hidden"

export default Page

const range = new Array(400).fill(0)

function Page() {
  return <main {...{id}}>{
    range.map((_, i) =>
      <section key={i}>{
        range.map((_, i) => <input key={i} type="radio"/>)
      }</section>
    )
  }</main>
}
