<script setup lang="ts">
import type { StringValue } from 'ms'

import type { ChartConfig } from '@/components/ui/chart'
import { VisAxis, VisFreeBrush, VisStackedBar, VisXYContainer } from '@unovis/vue'
import { format, parse } from 'ms'
import { ChartTooltipContent, componentToString } from '@/components/ui/chart'

interface ChartProps {
  range?: StringValue
  start?: number
}

interface Data {
  date: Date
  success: number
  error: number
}

const props = withDefaults(defineProps<ChartProps>(), {
  range: '1d',
  start: Date.now(),
})

const emit = defineEmits(['update:rangeChanged'])

const { range } = props
const { log_display: logs } = useLogs()
const start = ref(props.start)
const range_ms = ref(parse(range))
const total_data_points = 150
const bucket_size = computed(() => {
  const size = normalize(range_ms.value / total_data_points, 1000)
  return size > 1000 ? size : 1000
})

// BUG: New values don't show up if the range isn't updated
const offset = computed(() => 10 * bucket_size.value)
const now = computed(() => normalize(start.value + offset.value, bucket_size.value))
const end = computed(() => now.value - range_ms.value - (2 * offset.value))
const { width: window_width } = useWindowSize()
const chart_width = computed(() => {
  const width = window_width.value - (window_width.value > 768 ? 270 : 0) - 28
  return normalize(width, 10)
})
const bar_size = computed(() => Math.floor(chart_width.value / total_data_points) - 2)

const data = computed(() => {
  // console.log(`Computing data [bucket=${bucket_size.value}] [start=${start.value}] [end=${end.value}]`)
  const bucket_normalize = (ts: number) => normalize(ts, bucket_size.value)
  const normalized_logs = logs.value.map(log => ({ ...log, time: bucket_normalize(log.time) }))
  return Array.from({ length: total_data_points + 30 }, (_, i) => {
    const timestamp = bucket_normalize(now.value - (i * bucket_size.value))
    const matching_logs = normalized_logs.filter(log => log.time === timestamp)
    const aggregate = matching_logs.reduce((agg, log) => {
      agg[log.level < 50 ? 'success' : 'error'] += 1
      return agg
    }, { date: new Date(timestamp), success: 0, error: 0 })
    return aggregate
  })
})

const config = {
  success: { label: 'success', color: '#333' },
  error: { label: 'error', color: '#f85149' },
} satisfies ChartConfig

function handleBrush(range: [number, number]) {
  if (!range)
    return
  const [end, new_start] = range
  range_ms.value = new_start - end
  start.value = new_start
  emit('update:rangeChanged', range_ms.value, format(range_ms.value))
}

function normalize(n: number, bucket_size: number): number {
  return Math.floor(n / bucket_size) * bucket_size
}
</script>

<template>
  <ChartContainer :config="config" class="aspect-auto h-13.5 w-full custom-vis" cursor>
    <VisXYContainer
      :data
      :x-domain="[end, now]"
      :y-domain="[0, 10]"
      :scale-by-domain="true"
      :y-axis="{ showLabels: false }"
      color="#666"
    >
      <VisStackedBar
        :x="(d: Data) => Math.round(d.date.getTime() / 10_000) * 10_000"
        :y="[(d: Data) => d.success, (d: Data) => d.error]"
        :color="['#333', '#f85149']"
        :bar-width="bar_size"
        :rounded-corners="false"
      />
      <VisAxis
        type="x"
        :x="(d: Data) => d.date.getTime()"
        :grid-line="false"
        :tick-format="(d: number) => {
          const date = new Date(d)
          return date.toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
        }"
        :num-ticks="4"
      />
      <VisFreeBrush :on-brush-end="handleBrush" />
      <ChartTooltip />
      <ChartCrosshair
        :template="componentToString(config, ChartTooltipContent, {
          labelKey: 'success',
          indicator: 'line',
          labelFormatter(d) {
            const ts = Math.round(new Date(d).getTime() / 10_000) * 10_000
            return new Date(ts).toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
          },
        })"
        color="#0000"
      />
    </VisXYContainer>
  </ChartContainer>
</template>

<style>
</style>
