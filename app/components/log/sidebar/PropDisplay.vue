<script setup lang="ts">
defineProps({
  item: { type: Object, required: true },
})
</script>

<template>
  <div class="flex flex-col border bg-[#0a0a0a] rounded">
    <div class="flex flex-col px-2 py-1">
      <div class="flex flex-col">
        <div v-for="(v, index) in Object.entries(item)" :key="index" class="border-b py-1 last:border-none">
          <Button variant="ghost" class="text-base w-full">
            <div class="flex items-center justify-between w-full gap-1">
              <span class="text-muted-foreground">{{ v[0] }}</span>
              <span class="pl-6 truncate">{{ v[1] }}</span>
            </div>
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
