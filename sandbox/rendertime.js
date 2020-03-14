async function main() {
  const maxCount = 100000 
  , host = document.getElementsByClassName('host')[0]
  , output = document.getElementsByClassName('console')[0]
  , sizes = [1, 10, 100, 300, 320, 1000, 10000, maxCount] // 100000 max
  , statsRepack = {}

  for (const size of sizes) {
    statsRepack[size] = {}
    const stat = statsRepack[size]
    , measureCount = 2
    
    for (let iteration = measureCount; iteration--; ) {
      const result = await new Promise(resolve => measureRender(host, generateStructure(maxCount, size), resolve))
      await Promise.all(promiseRequests())
      await delay(200)

      for (const key in result) 
        stat[key] = (stat[key] || 0) + result[key]
    }

    for (const key in stat)
      stat[key] /= measureCount    
    console.log("statsRepack", `${size}:`, stat)

  }
  output.innerHTML = JSON.stringify(statsRepack, null, 2) 
  return statsRepack
}

function generateStructure(totalCount, scopeSize) {
  const holderTemplate = new Array(Math.ceil(totalCount / scopeSize)).fill(0)
  , holder = document.createElement('main')
  
  holder.append(...holderTemplate.map(_ => {
    const scope = document.createElement('section')
    scope.append(...generateInputs(scopeSize))
    return scope
  }))
  return holder
}

function generateInputs(size) {
  return new Array(size).fill(0).map(_ => document.createElement('input'))
}

function removeAllChildren(host) {
  while (host.lastElementChild)
    host.removeChild(host.lastElementChild)
  return host
}

function measureRender(host, children, cb) {
  const start = performance.now()
  
  if (Array.isArray(children))
    host.append(...children)
  else
    host.appendChild(children)

  const results = [undefined, undefined]
  , cbWrap = i => () => {
    results[i] = performance.now()
    if (!results[1 - i])
      return;
    $return = {
      'animated': results[0] - start,
      'idle': results[1] - start,
      "average": (results[0] + results [1]) / 2 - start
    }
    removeAllChildren(host)
    return cb($return)
  }
  window.requestIdleCallback(cbWrap(1))
  window.requestAnimationFrame(cbWrap(0))
}

function promiseRequests() {
  return [
    "requestIdleCallback",
    "requestAnimationFrame",
  ].map(method => 
    new Promise(resolve => window[method](() => resolve(performance.now())))
  )
}

async function delay(time) {
  return new Promise(resolve => setTimeout(() => resolve(time), time))
}