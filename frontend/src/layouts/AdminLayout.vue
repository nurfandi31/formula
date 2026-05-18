<script setup>
import { ref } from 'vue'
import AdminSidebar from './AdminSidebar.vue'
import AdminNavbar from './AdminNavbar.vue'
import AdminFooter from './AdminFooter.vue'

const isCollapsed = ref(false)
const isMobileOpen = ref(false)
</script>

<template>
  <div class="h-screen bg-slate-50 text-slate-800 flex font-sans select-none antialiased overflow-hidden">
    <div v-if="isMobileOpen" @click="isMobileOpen = false" class="fixed inset-0 bg-black/60 backdrop-blur-xs z-20 md:hidden transition-opacity duration-300"></div>

    <AdminSidebar 
      :is-collapsed="isCollapsed" 
      :is-mobile-open="isMobileOpen" 
      @close-mobile="isMobileOpen = false"
    />

    <main :class="['flex-1 h-screen relative overflow-hidden bg-slate-50 transition-all duration-300 ease-in-out flex flex-col', isCollapsed ? 'md:ml-28' : 'md:ml-72']">
      <div class="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full -z-10 pointer-events-none"></div>
      <div class="absolute bottom-0 left-1/3 w-96 h-96 bg-teal-500/10 blur-[120px] rounded-full -z-10 pointer-events-none"></div>

      <AdminNavbar 
        :is-collapsed="isCollapsed" 
        @toggle-collapse="isCollapsed = !isCollapsed" 
        @toggle-mobile="isMobileOpen = !isMobileOpen" 
        class="flex-shrink-0"
      />

      <div class="flex-1 overflow-y-auto px-6 py-8 flex flex-col justify-between">
        <div>
          <slot />
        </div>
        <AdminFooter class="mt-8" />
      </div>
    </main>
  </div>
</template>
