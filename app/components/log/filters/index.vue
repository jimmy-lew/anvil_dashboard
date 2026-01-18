<script setup lang="ts">
const { isFiltersActive } = useLogFilters()
</script>

<template>
  <div
    :class="isFiltersActive ? 'left-0' : '-left-[270px]'"
    class="hidden md:block dark:bg-black border-r relative h-full w-full transition-all ease-in-out duration-200"
  >
    <div class="fixed w-[270px]">
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
</template>

<style scoped>

</style>
