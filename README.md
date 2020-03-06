# render-on-demand

React component that returns children once after DOM render request.

Puppeteer tests @ [specs/index.spec.ts](./specs/index.spec.ts)

## Example

[Source](https://github.com/askirmas/render-on-demand/blob/2247ec8d5b6db270729b3a9e15d534db1c6c8d7b/pages/index.tsx#L7-L17)

```jsx
<style>{`
  input:not(:checked) ~ * {
    display: none;
  }
`}</style>
<input type="checkbox"/>
<RenderOnDemand>
  <div className="child">a</div>
  <div className="child">b</div>
</RenderOnDemand>
```

`.child` will not appear in DOM until input is checked for the first time.

```html
<style>
  input:not(:checked) ~ * {
    display: none;
  }
</style>
<input type="checkbox">
<div></div>
```



 