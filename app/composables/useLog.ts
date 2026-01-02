export function useLogs(url?: string, cap: number = 1000) {
  const log_display = useState('logs-display', () => shallowRef<RawLogItem[]>([]))
  const buffer = useState('logs-buffer', () => shallowRef<RawLogItem[]>([]))

  const is_paused = useState('logs-paused', () => false)
  const bg_count = computed(() => buffer.value.length)

  const { data: cache } = useAsyncData<RawLogItem[]>('log-cache', () => ($fetch as any)('/api/logs'), {
    getCachedData: (k, a) => a.payload.data[k] || a.static.data[k],
  })

  watch(cache, (data) => {
    if (buffer.value.length !== 0 || !data || !Array.isArray(data))
      return
    [log_display.value, buffer.value] = [data, data]
  }, { immediate: true })

  const { data } = url ? useEventSource(url) : { data: ref(null) }

  watch(data, (new_data) => {
    if (!new_data)
      return
    try {
      const parsed = JSON.parse(new_data)
      buffer.value = [parsed, ...buffer.value].slice(0, cap)

      // Fire and forget to cache logs
      $fetch('/api/logs', { method: 'POST', body: parsed }).catch(() => {})

      if (is_paused.value)
        return
      log_display.value = buffer.value
    }
    catch { }
  })

  const toggle_pause = () => {
    is_paused.value = !is_paused.value
    if (!is_paused.value) {
      log_display.value = buffer.value
    }
  }

  return {
    is_paused,
    toggle_pause,
    log_display,
    bg_count,
  }
}
