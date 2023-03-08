import AbortController from 'abort-controller';
import { fetch, Headers, Request, Response } from 'cross-fetch';
import { server } from './test/server'

global.fetch = fetch;
global.Headers = Headers;
global.Request = Request;
global.Response = Response;
global.AbortController = AbortController;

beforeAll(done => {
    server.listen()
    done()
})
afterEach(() => server.resetHandlers())
afterAll(done => {
    server.close()
    done()
})

process.env.NEXT_PUBLIC_BFF_ENDPOINT = 'https://cs-bo-panel-bff-dev.loblaw.digital'
process.env.NEXT_PUBLIC_SESSION_COUNT_DOWN_TIME = 0.5
process.env.NEXT_PUBLIC_SESSION_IDLE_TIME_LIMIT=  0

