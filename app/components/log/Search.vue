<script setup lang="ts">
import { SearchIcon } from 'lucide-vue-next'

const { logs } = defineProps<{
  logs: RawLogItem[]
}>()
</script>

<template>
  <Popover class="relative">
    <PopoverTrigger class="relative inline-flex w-full">
      <InputGroup>
        <InputGroupInput :placeholder="`${logs.length} logs found...`" />
        <InputGroupAddon>
          <SearchIcon :size="16" />
          <!-- <LucideLoader2 :size="16" class="animate-spin" /> -->
        </InputGroupAddon>
      </InputGroup>
    </PopoverTrigger>
    <PopoverContent class="w-(--reka-popper-anchor-width)! bg-black border">
      Placeholder
    </PopoverContent>
  </Popover>
</template>

<style scoped>

</style>
