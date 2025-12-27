<script setup lang="ts">
import { ChevronDownIcon, ChevronRight, EllipsisVerticalIcon, FilterIcon, PlayCircleIcon, RefreshCwIcon } from 'lucide-vue-next'

const isOpen = ref(false)
const isOpen2 = ref(false)

const panelOpen = ref(true)

const log_header = useTemplateRef('log_header')
const log_list = useTemplateRef('log_list')

const logs = ref<RawLogItem[]>([])
// TODO: Higher level log persistence and log filtering based on rolling time window
const log_stream_client = new LogClient(logs)

type Data = typeof logs.value[number]
const pointer = ref(0)
const item = computed(() => {
  return logs.value[pointer.value]
}) as ComputedRef<Data>

const is_max = computed(() => {
  return pointer.value === (logs.value.length - 1)
})
const is_min = computed(() => {
  return pointer.value === 0
})

function handle_pointer_increase() {
  if (is_max.value) {
    return
  }
  pointer.value++
}

function handle_pointer_decrease() {
  if (is_min.value) {
    return
  }
  pointer.value--
}

function handle_scroll() {
  if (!log_header.value || !log_list.value)
    return
  log_header.value.scrollLeft = log_list.value.scrollLeft
}

function handle_item_select(index: number) {
  pointer.value = index
  isOpen.value = true
}

defineShortcuts({
  escape: () => isOpen.value = false,
})

onMounted(() => { log_stream_client.connect() })
onUnmounted(() => { log_stream_client.disconnect() })
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-[270px_calc(100%-270px)] h-full relative">
    <div class="hidden md:block dark:bg-black border-r relative h-full">
      <div class="sticky">
        <div class="flex flex-col h-full p-3">
          <div class="flex flex-initial items-center justify-between">
            <span class="text-base p-3">
              Filters
            </span>
            <Button variant="outline">
              Reset
            </Button>
          </div>
          <div class="flex flex-col pt-2">
            <LogFiltersTime />
            <LogFiltersLevels />
            <Collapsible
              v-model:open="isOpen2"
              class="flex flex-col gap-2"
            >
              <div class="flex items-center justify-start gap-2">
                <CollapsibleTrigger as-child>
                  <Button variant="ghost" class="w-full flex justify-start">
                    <ChevronRight />
                    <span class="sr-only">Toggle</span>
                    <h4 class="text-sm font-semibold">
                      Environment
                    </h4>
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent class="flex flex-col gap-2">
                <div class="rounded-md border px-4 py-2 font-mono text-sm">
                  @radix-ui/colors
                </div>
                <div class="rounded-md border px-4 py-2 font-mono text-sm">
                  @stitches/react
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col relative h-full">
      <div class="flex flex-col items-stretch justify-start flex-initial sticky border-b overflow-x-auto">
        <div class="px-3 pt-3">
          <div class="flex flex-col md:flex-row items-stretch justify-start flex-initial">
            <div class="flex flex-row items-stretch justify-start md:gap-2 flex-initial grow">
              <Button class="hidden md:inline-flex" variant="outline" size="icon">
                <FilterIcon />
              </Button>
              <LogDownload class="hidden md:inline-flex" />
              <LogSearch :logs />
            </div>
            <div class="flex flex-row items-stretch justify-start gap-2 flex-initial">
              <Button class="md:hidden" variant="outline" size="icon">
                <FilterIcon />
              </Button>
              <LogDownload class="md:hidden" />
              <div class="flex-1 md:hidden" />
              <Button variant="outline">
                <PlayCircleIcon />
                Live
              </Button>
              <Button variant="outline" size="icon">
                <RefreshCwIcon class="animate-spin" />
              </Button>
              <Button variant="outline" size="icon">
                <EllipsisVerticalIcon />
              </Button>
            </div>
          </div>
          <LogChart :logs range="1d" />
          <div ref="log_header" class="max-w-screen overflow-x-hidden no-scrollbar">
            <div class="flex flex-row items-center justify-stretch flex-initial text-base h-10 min-w-4xl">
              <div class="pl-5 w-53">
                Time
              </div>
              <div class="w-18">
                Level
              </div>
              <div class="">
                Message
              </div>
            </div>
          </div>
        </div>
      </div>
      <div ref="log_list" class="relative overflow-x-auto md:overflow-x-hidden flex-[1_1_0%]" @scroll.passive="handle_scroll">
        <ol reversed class="flex flex-col items-stretch justify-start flex-auto px-1 min-w-4xl h-full">
          <LogItem v-for="(log_item, index) in logs" :key="log_item.log_id" :item="log_item" :index @select="handle_item_select" />
        </ol>
        <SidebarProvider v-model:open="isOpen" class="min-h-0" style="--sidebar-width: max(min(400px,50vw), 350px);">
          <LogItemSidebar
            v-if="logs.length > 0"
            :is-max="is_max"
            :is-min="is_min"
            :item
            @update:increase-pointer="handle_pointer_increase"
            @update:decrease-pointer="handle_pointer_decrease"
            @close="isOpen = false"
          />
        </SidebarProvider>
      </div>

      <div v-if="isOpen" :style="{ height: panelOpen ? '360px' : '50px' }" class="fixed block bottom-0 right-[max(min(407px,50vw),357px)] left-69.5 border-t">
        <div class="flex h-full flex-1 flex-col transition-all sm:flex-initial">
          <div class="flex items-center justify-between border-b p-2 bg-background">
            <span class="px-3 py-1.5">Logs</span>
            <Button variant="ghost" size="icon" @click="panelOpen = !panelOpen">
              <ChevronDownIcon :size="16" class="" />
            </Button>
          </div>
          <div v-if="panelOpen" class="flex h-full items-center justify-center bg-black p-8 text-sm text-muted-foreground">
            No items found
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
