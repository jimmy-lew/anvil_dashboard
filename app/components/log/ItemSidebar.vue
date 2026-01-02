<script setup lang="ts">
import { ChevronDown, ChevronUp, Circle, X } from 'lucide-vue-next'

const emit = defineEmits(['close'])

const { selectedItem: item, is_max, is_min, increasePointer, decreasePointer } = useLogSelection()
const { get_label } = useLogLabel()

const date = computed(() => { return item.value ? new Date(item.value.time) : new Date() })
const level = computed(() => get_label(item.value?.level))

defineShortcuts({
  ArrowDown: increasePointer,
  ArrowUp: decreasePointer,
})
</script>

<template>
  <Sidebar side="right" class="absolute bg-black border-l h-full">
    <SidebarHeader class="flex flex-row justify-between bg-black p-4">
      <div class="flex items-center justify-center gap-1 p-1">
        Log
      </div>
      <div class="flex flex-row items-center justify-start gap-2 flex-initial">
        <Badge :class="level.color" class="font-bold rounded uppercase" variant="outline">
          {{ level.label }}
        </Badge>
        <div class="flex flex-row gap-1">
          <Button :disabled="is_max" :class="is_max ? 'text-muted' : ''" size="icon" variant="ghost" @click="increasePointer">
            <ChevronDown />
          </Button>
          <Button :disabled="is_min" :class="is_min ? 'text-muted' : ''" size="icon" variant="ghost" @click="decreasePointer">
            <ChevronUp />
          </Button>
        </div>
        <Separator orientation="vertical" />
        <Button size="icon" variant="ghost" @click="() => emit('close')">
          <X />
        </Button>
      </div>
    </SidebarHeader>
    <SidebarContent class="bg-black">
      <div class="flex-1 overflow-y-auto">
        <div class="flex flex-col items-stretch justify-start flex-initial min-h-full pb-4">
          <div class="flex-1 px-3">
            <div class="ml-1 flex items-center justify-between gap-2 p-1">
              <div class="flex items-center px-2 space-x-0.5 font-medium">
                <Circle :size="10" />
                <span class="text-base text-nowrap p-1">Log created</span>
              </div>
              <LogSidebarRichDate :date />
            </div>

            <LogSidebarPropDisplay :item />
          </div>
        </div>
      </div>
    </SidebarContent>
  </Sidebar>
</template>

<style scoped>
:root {
  --sidebar-width: max(min(400px,50vw),350px);
}
</style>
