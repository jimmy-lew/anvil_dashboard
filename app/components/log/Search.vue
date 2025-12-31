<script setup lang="ts">
import { EllipsisVerticalIcon, FilterIcon, PlayCircleIcon, RefreshCwIcon, SearchIcon } from 'lucide-vue-next'

const { logs } = defineProps<{
  logs: RawLogItem[]
}>()
</script>

<template>
  <div class="flex flex-col md:flex-row items-stretch justify-start flex-initial">
    <div class="flex flex-row items-stretch justify-start md:gap-2 flex-initial grow">
      <Button class="hidden md:inline-flex" variant="outline" size="icon">
        <FilterIcon />
      </Button>
      <LogDownload class="hidden md:inline-flex" />
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
        <RefreshCwIcon />
      </Button>
      <Button variant="outline" size="icon">
        <EllipsisVerticalIcon />
      </Button>
    </div>
  </div>
</template>

<style scoped>

</style>
