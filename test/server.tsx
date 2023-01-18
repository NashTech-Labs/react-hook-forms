import { setupServer } from 'msw/node'
import allHandlers from './serverHandlers'

const server = setupServer(...allHandlers)

export { server }