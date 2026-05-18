<script setup>
defineProps({
  isCollapsed: Boolean
})

const emit = defineEmits(['toggleCollapse', 'toggleMobile'])
</script>

<template>
  <header class="h-16 bg-white/80 border-b border-slate-250/60 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
    <div class="flex items-center gap-4">
      <button @click="emit('toggleCollapse')" class="hidden md:flex items-center justify-center p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-850 border border-slate-200/70 cursor-pointer transition-all">
        <font-awesome-icon :icon="isCollapsed ? 'indent' : 'outdent'" class="text-sm" />
      </button>
      <button @click="emit('toggleMobile')" class="flex md:hidden items-center justify-center p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-850 border border-slate-200/70 cursor-pointer transition-all">
        <font-awesome-icon icon="bars" class="text-sm" />
      </button>
      <h2 class="text-xs font-black uppercase tracking-widest text-slate-500">Dashboard Administrator</h2>
    </div>
    <div class="flex items-center gap-4">
      <span class="text-xs font-black text-emerald-600 uppercase tracking-wider">Mode Admin</span>
      <div class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
    </div>
  </header>
</template>
