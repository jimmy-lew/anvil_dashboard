<script setup lang="ts">

</script>

<template>
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
</template>

<style scoped>

</style>
