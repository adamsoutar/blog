::: title
Using socket.io with create-react-app
:::

::: description
Using webpack proxy is harder with socket.io than with a simple REST API, but it's woth
setting up.
:::

With webpack proxy, we can set up our express API server to use socket.io, and use it
seamlessly with webpack-dev-server as though the two lived on the same domain.

### The scaffold

First, we'll need the structure, enter an empty directory and use

```bash
npx create-react-app myFrontend
```

For the React, then something along these lines for the server

```bash
mkdir myBackend
cd myBackend
npm init
npm i express socket.io
```

Let's create a standard express + socket.io server. This should do:

```js
const express = require('express')
const httpServer = require('http').createServer(app)
const io = require('socket.io')(httpServer)

io.on('connection', socket => {
  console.log('Someone connected!')
})

httpServer.listen(1337, () => console.log('Listening!'))
```

Back in the directory made by create-react-app earlier, run

```bash
npm i socket.io-client
```

And stick some connection code in `App.js`:

```js
import React from 'react'
import io from 'socket.io-client'
// This does the actual connecting
const socket = io()

function App () {
  return (
    <div>Hello</div>
  )
}

export default App
```

### The proxy

Now that we have the basics up, here comes the magic. In the `src` directory of your React app, create a file
named `setupProxy.js`. In it, we'll want something like this:

```js
const proxy = require('http-proxy-middleware')

module.exports = function (app) {
  app.use(proxy('/socket.io', {
    target: 'http://localhost:1337',
    ws: true
  }))

  // You only need this part if your server also has actual express endpoints
  app.use(proxy('/api', {
    target: 'http://localhost:1337',
    pathRewrite: { '^/api': '' }
  }))
}
```

You don't need to install `http-proxy-middleware`, **you don't need to import this file anywhere**, it's all
abstracted by create-react-app magic.

And that's it! The `io()` call from the React frontend is now proxied to your express server from
webpack-dev-server so you can enjoy hot-loading *and* sockets! Why pick just one?
