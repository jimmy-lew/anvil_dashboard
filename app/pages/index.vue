<script setup lang="ts">
import { ChevronDownIcon } from 'lucide-vue-next'

const isOpen = ref(false)
const panelOpen = ref(true)

const log_header = useTemplateRef('log_header')
const log_list = useTemplateRef('log_list')

const { log_display: logs } = useLogs()

function handle_scroll() {
  if (!log_header.value || !log_list.value)
    return
  log_header.value.scrollLeft = log_list.value.scrollLeft
}

defineShortcuts({
  escape: () => isOpen.value = false,
})
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
            <LogFiltersEnvironment />
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col relative h-full">
      <div class="flex flex-col items-stretch justify-start flex-initial sticky border-b overflow-x-auto">
        <div class="px-3 pt-3">
          <LogSearch />
          <LogChart range="10m" />
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
          <LogItem v-for="(log_item, index) in logs" :key="log_item.log_id" :item="log_item" :index @select="isOpen = true" />
        </ol>
        <SidebarProvider v-model:open="isOpen" class="min-h-0" style="--sidebar-width: max(min(400px,50vw), 350px);">
          <LogItemSidebar @close="isOpen = false" />
        </SidebarProvider>
      </div>

      <!-- Technically left should be 270px -->
      <div v-if="isOpen" :style="{ height: panelOpen ? '360px' : '50px' }" class="fixed block bottom-0 right-[max(min(400px,50vw),350px)] left-76 border-t">
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
