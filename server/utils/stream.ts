import type { H3Event } from 'h3'

const clients = new Set<H3Event>()

export function addClient(event: H3Event) {
  clients.add(event)
}

export function removeClient(event: H3Event) {
  clients.delete(event)
}

export function broadcast(data: any) {
  const message = `data: ${JSON.stringify(data)}\n\n`
  for (const client of clients) {
    client.node.res.write(message)
  }
}
