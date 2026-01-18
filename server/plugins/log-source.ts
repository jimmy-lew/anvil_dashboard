/* eslint-disable no-console */
import type { RawLogItem } from '~/types/log'
import { Buffer } from 'node:buffer'
import http from 'node:http'
import https from 'node:https'

class LogSourceClient {
  private url: string
  private retryDelay: number
  private buffer: Buffer
  private separator: Buffer

  constructor(url: string) {
    this.url = url
    this.retryDelay = 3000
    this.buffer = Buffer.alloc(0)
    // SSE messages are typically separated by double newline
    this.separator = Buffer.from('\n\n')
  }

  start() {
    this.connect()
  }

  private connect() {
    console.log('Connecting to log source...', this.url)
    const protocol = this.url.startsWith('https') ? https : http

    const req = protocol.get(this.url, (res) => {
      if (res.statusCode !== 200) {
        console.error(`Failed to connect: ${res.statusCode} ${res.statusMessage}`)
        res.resume()
        this.reconnect()
        return
      }

      // Disable timeout on the socket to allow long-lived connections
      res.socket?.setTimeout(0)

      res.on('data', chunk => this.handleChunk(chunk))
      res.on('end', () => { this.reconnect() })
    })

    req.on('error', (err) => { this.reconnect(err) })
    req.setTimeout(0)
  }

  private handleChunk(chunk: Buffer) {
    this.buffer = Buffer.concat([this.buffer, chunk])

    let offset = 0
    let splitIndex = -1

    while (true) {
      splitIndex = this.buffer.indexOf(this.separator, offset)
      if (splitIndex === -1)
        break
      const messageBytes = this.buffer.subarray(offset, splitIndex)
      this.processMessage(messageBytes)
      offset = splitIndex + this.separator.length
    }

    if (offset > 0) {
      this.buffer = this.buffer.subarray(offset)
    }
  }

  private processMessage(bytes: Buffer) {
    const line = bytes.toString('utf-8')
    if (!line.startsWith('data: '))
      return
    try {
      const jsonStr = line.slice(6)
      const data = this.flattenJSON(JSON.parse(jsonStr)) as RawLogItem
      cache_log(data)
      broadcast(data)
    }
    catch (e) {
      console.error('Error parsing log data:', e)
    }
  }

  private flattenJSON(obj: any, prefix = '', result: any = {}) {
    const handleKVPair = (e: [string, unknown]) => {
      const [k, v] = e
      const newKey = prefix && prefix !== 'meta' ? `${prefix}.${k}` : k
      if (!v || typeof v !== 'object') {
        result[newKey] = v
        return result
      }
      return this.flattenJSON(v, newKey, result)
    }
    Object.entries(obj).map(handleKVPair)
    return result
  }

  private reconnect(err?: Error) {
    if (err) {
      console.error('Log source connection error:', err)
    }
    else {
      console.log('Log source connection closed. Reconnecting...')
    }
    setTimeout(() => this.connect(), this.retryDelay)
  }
}

export default defineNitroPlugin((_) => {
  const config = useRuntimeConfig()
  const client = new LogSourceClient(config.logSourceUrl)
  client.start()
})
