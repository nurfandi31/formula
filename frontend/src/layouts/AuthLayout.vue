<template>
  <div class="min-h-screen bg-[#fcfdfd] flex items-center justify-center p-6 font-sans relative overflow-hidden">
    <!-- Decorative background elements -->
    <div class="absolute top-0 right-0 w-96 h-96 bg-emerald-100/50 blur-[120px] rounded-full opacity-60 translate-x-1/4 -translate-y-1/4 pointer-events-none"></div>
    <div class="absolute bottom-0 left-0 w-96 h-96 bg-teal-100/40 blur-[120px] rounded-full opacity-60 -translate-x-1/4 translate-y-1/4 pointer-events-none"></div>
    
    <div class="w-full max-w-md relative z-10">
      <div class="text-center mb-8">
        <router-link to="/" class="inline-flex items-center gap-3 group">
          <div class="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/30 group-hover:rotate-6 transition-all duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="text-white"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
          </div>
          <div class="text-left">
            <span class="text-2xl font-black tracking-tight text-emerald-600 block leading-none">FORMULA</span>
            <span class="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase">Ngampon Youth</span>
          </div>
        </router-link>
      </div>
      <slot />
    </div>
  </div>
</template>
