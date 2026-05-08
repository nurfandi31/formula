<script setup>
import { ref } from 'vue'
import AdminSidebar from './AdminSidebar.vue'
import AdminNavbar from './AdminNavbar.vue'
import AdminFooter from './AdminFooter.vue'

const isCollapsed = ref(false)
const isMobileOpen = ref(false)
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex font-sans select-none antialiased">
    <div v-if="isMobileOpen" @click="isMobileOpen = false" class="fixed inset-0 bg-black/60 backdrop-blur-xs z-20 md:hidden transition-opacity duration-300"></div>

    <AdminSidebar 
      :is-collapsed="isCollapsed" 
      :is-mobile-open="isMobileOpen" 
    />

    <main :class="['flex-1 min-h-screen relative overflow-hidden bg-slate-950 pb-12 transition-all duration-300 ease-in-out flex flex-col', isCollapsed ? 'md:ml-20' : 'md:ml-72']">
      <div class="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full -z-10"></div>
      <div class="absolute bottom-0 left-1/3 w-96 h-96 bg-teal-500/5 blur-[120px] rounded-full -z-10"></div>

      <AdminNavbar 
        :is-collapsed="isCollapsed" 
        @toggle-collapse="isCollapsed = !isCollapsed" 
        @toggle-mobile="isMobileOpen = !isMobileOpen" 
      />

      <div class="px-6 py-8 flex-1">
        <slot />
      </div>

      <AdminFooter />
    </main>
  </div>
</template>
