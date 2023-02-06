import http from 'node:http'
import { json } from './middlewares/json.mjs'
import { routes } from './routes.mjs'
import { extractQueryParams } from './utils/extract-query-params.mjs'

const server = http.createServer(async (req, res) => {
  const { method, url } = req

  const route = routes.find(route => route.method === method && route.url.test(url))

  await json(req, res)

  if (route) {
    const routeParams = url.match(route.url)

    const { query, ...params } = routeParams.groups

    req.params = params
    req.query = query ? extractQueryParams(query) : {}

    return route.handler(req, res)
  }

  return res.writeHead(404).end()
})

server.listen(3333)
