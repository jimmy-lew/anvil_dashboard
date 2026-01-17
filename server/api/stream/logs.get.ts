export default defineEventHandler(async (event) => {
  setHeaders(event, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  })

  addClient(event)

  event.node.req.on('close', () => {
    removeClient(event)
  })

  // Keep the connection open
  return new Promise(() => {})
})
