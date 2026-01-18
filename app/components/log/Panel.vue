<script setup lang="ts">
const isOpen = defineModel('open', { type: Boolean, default: false })
const isPanelOpen = ref(true)

const { isFiltersActive } = useLogFilters()

const panelState = computed(() => {
  const panelCollapsed = isPanelOpen.value ? '360px' : '50px'
  const panelPosition = isFiltersActive.value ? '270px' : '8px'
  const panelOpen = isOpen.value ? '0' : '-360px'

  return {
    height: panelCollapsed,
    left: panelPosition,
    bottom: panelOpen,
  }
})
</script>

<template>
  <div :style="panelState" class="fixed block bottom-0 right-(--sb-width) border-t transition-all ease-in-out duration-200">
    <div class="flex h-full flex-1 flex-col transition-all sm:flex-initial">
      <div class="flex items-center justify-between border-b p-2 bg-background">
        <span class="px-3 py-1.5">Logs</span>
        <Button variant="ghost" size="icon" @click="isPanelOpen = !isPanelOpen">
          <ChevronDownIcon :size="16" class="" />
        </Button>
      </div>
      <div
        v-if="isPanelOpen"
        class="flex h-full items-center justify-center bg-black p-8 text-sm text-muted-foreground"
      >
        No items found
      </div>
    </div>
  </div>
</template>
