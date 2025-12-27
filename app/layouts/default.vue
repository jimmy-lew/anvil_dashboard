<script setup lang="ts">
const open = ref(false)
</script>

<template>
  <SidebarProvider :default-open="open">
    <!-- <LayoutAppSidebar /> -->
    <SidebarInset>
      <LayoutHeader />
      <div class="flex flex-col flex-1">
        <div class="@container/main grow">
          <slot />
        </div>
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>

<style scoped>

</style>
