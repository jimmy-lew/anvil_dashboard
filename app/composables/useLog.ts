export const useLogStream = createSharedComposable((url?: string, cap: number = 1000) => {
  const buffer = useState('logs-buffer', () => shallowRef<RawLogItem[]>([]))
  const bg_count = computed(() => buffer.value.length)

  const { data: cache } = useAsyncData<RawLogItem[]>('log-cache', () => ($fetch as any)('/api/logs'), {
    getCachedData: (k, a) => a.payload.data[k] || a.static.data[k],
  })

  watch(cache, (data) => {
    if (buffer.value.length !== 0 || !data || !Array.isArray(data))
      return
    buffer.value = data
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
    }
    catch { }
  })

  return { buffer, bg_count }
})

export function useLogs(url?: string, cap: number = 1000) {
  const { buffer, bg_count } = useLogStream(url, cap)

  const pause_count = ref(0)
  const is_paused = useState('logs-paused', () => false)

  const log_display = computed(() => is_paused.value ? buffer.value.slice(bg_count.value - pause_count.value) : buffer.value)

  const toggle_pause = () => {
    is_paused.value = !is_paused.value
    if (is_paused.value) {
      pause_count.value = buffer.value.length
    }
  }

  return {
    is_paused,
    toggle_pause,
    log_display,
  }
}
