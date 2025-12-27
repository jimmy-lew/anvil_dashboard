import { EventSource } from 'eventsource'

export class LogClient {
  stream: EventSource | null = null

  constructor(
    private sink: Ref<RawLogItem[]>,
  ) {}

  connect() {
    this.stream = new EventSource('http://localhost:3333/')
    this.stream.onopen = () => {
    }

    this.stream.onmessage = ({ data }) => {
      const parsed_data = JSON.parse(data)
      this.sink.value.unshift(parsed_data)
    }
  }

  disconnect() {
    if (!this.stream)
      return
    this.stream.close()
  }
}
