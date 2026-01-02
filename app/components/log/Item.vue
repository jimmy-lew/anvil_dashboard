<script setup lang="ts">
interface LogItem {
  level: number
  level_label: [string, string]
  date: Date
  msg: string
  metadata: any
}

const props = defineProps<{
  item: RawLogItem
  index: number
}>()
const emit = defineEmits(['select'])

const labels: Record<number, [string, string]> = {
  10: ['trace', 'text-stone-600'],
  20: ['debug', 'text-emerald-500'],
  30: ['info', 'text-sky-500'],
  40: ['warn', 'text-amber-600'],
  50: ['error', 'text-red-600'],
  60: ['fatal', 'text-violet-600'],
}

const { selectItem } = useLogSelection()

function parse_log_item(item: RawLogItem): LogItem {
  const parsed: LogItem = {
    level: item.level,
    level_label: labels[item.level] ?? ['UNKNOWN', ''],
    date: new Date(item.time),
    msg: item.msg,
    metadata: {},
  }
  for (const [key, prop] of Object.entries(item)) {
    if (['level', 'time', 'msg'].includes(key))
      continue
    parsed.metadata[key] = prop
  }
  return parsed
}

const item = parse_log_item(props.item)

function handle_item_select() {
  emit('select', props.index)
  selectItem(props.index)
}
</script>

<template>
  <Button variant="ghost" class="flex h-fit bg-[#111] odd:bg-transparent rounded-[8px] px-0 justify-start" @click="handle_item_select">
    <div class="flex flex-row flex-initial text-muted-foreground text-sm md:text-base text-left md:py-1 pl-7 ">
      <div class="flex items-center space-x-3 w-48">
        <span>
          {{ item.date.toLocaleDateString("en-SG", { month: 'short' }).toLocaleUpperCase() }}
        </span>
        <span>
          {{ item.date.toLocaleDateString("en-SG", { day: '2-digit' }) }}
        </span>
        <span class="flex text-white">
          {{ item.date.toLocaleTimeString('en-SG', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }) }}.
          <span class="text-muted-foreground">
            {{ item.date.toLocaleTimeString("en-SG", { fractionalSecondDigits: 2 }) }}
          </span>
        </span>
      </div>
      <div class="w-18 uppercase font-bold" :class="item.level_label[1]">
        {{ item.level_label[0] }}
      </div>
      <div class="">
        {{ item.msg }}
      </div>
    <!-- <div class="">
      {{ item.metadata }}
    </div> -->
    </div>
  </Button>
</template>

<style scoped>

</style>
