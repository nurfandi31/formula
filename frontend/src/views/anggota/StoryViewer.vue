<script setup>
import { ref } from 'vue'
defineProps({
  activeStory: Object,
  activeSlideIndex: Number,
  storyProgress: Number,
  stories: Array
})
const emit = defineEmits(['close', 'next', 'prev', 'reply', 'viewProfile'])
const replyText = ref('')
const sendReply = () => {
  if (!replyText.value.trim()) return
  emit('reply', replyText.value.trim())
  replyText.value = ''
}
</script>

<template>
  <div v-if="activeStory" class="fixed inset-0 bg-slate-950/95 backdrop-blur-xs flex items-center justify-center z-50 animate-in fade-in duration-200">
    <div class="relative w-full max-w-md h-[85vh] sm:h-[80vh] flex flex-col bg-slate-900 border border-slate-800 sm:rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
      <div class="absolute top-4 left-4 right-4 flex gap-1 z-30">
        <div
          v-for="(slide, index) in (activeStory.slides || [])"
          :key="slide.id"
          class="h-1 flex-1 bg-slate-800 rounded-full overflow-hidden"
        >
          <div
            class="h-full bg-linear-to-r from-emerald-400 to-teal-400 transition-all duration-100 ease-linear"
            :style="{ width: index === activeSlideIndex ? `${storyProgress}%` : (index < activeSlideIndex ? '100%' : '0%') }"
          ></div>
        </div>
      </div>

      <div class="absolute top-8 left-4 right-4 flex items-center justify-between z-30 bg-gradient-to-b from-black/60 to-transparent p-2 rounded-xl">
        <div class="flex items-center gap-3 cursor-pointer group" @click="emit('viewProfile', activeStory.name)">
          <img :src="activeStory.image" class="w-9 h-9 rounded-full object-cover border border-emerald-500 group-hover:scale-105 transition-transform">
          <div>
            <h4 class="text-xs font-black text-white leading-none group-hover:underline">{{ activeStory.name }}</h4>
            <span class="text-[8px] font-bold text-slate-300 uppercase tracking-widest mt-1 inline-block">Cerita FORMULA</span>
          </div>
        </div>
        <button @click="emit('close')" class="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 flex items-center justify-center text-white font-bold cursor-pointer text-xs">✕</button>
      </div>

      <div class="flex-grow relative flex items-center justify-center bg-slate-950">
        <img
          v-if="activeStory.slides && activeStory.slides[activeSlideIndex]"
          :src="activeStory.slides[activeSlideIndex].image"
          class="w-full h-full object-cover"
        >
        <div @click="emit('prev')" class="absolute inset-y-0 left-0 w-1/4 z-20 cursor-pointer"></div>
        <div @click="emit('next')" class="absolute inset-y-0 right-0 w-1/4 z-20 cursor-pointer"></div>
        <div
          v-if="activeStory.slides && activeStory.slides[activeSlideIndex]"
          class="absolute bottom-20 left-4 right-4 bg-black/60 backdrop-blur-xs p-4 rounded-2xl border border-white/5 z-25 animate-in slide-in-from-bottom duration-300"
        >
          <p class="text-xs text-white leading-relaxed text-center font-bold">
            {{ activeStory.slides[activeSlideIndex].caption }}
          </p>
        </div>
      </div>

      <div class="p-4 bg-slate-900 border-t border-slate-850 flex gap-2 items-center z-30">
        <input
          v-model="replyText"
          @keyup.enter="sendReply"
          type="text"
          placeholder="Kirim pesan balasan..."
          class="flex-grow px-5 py-3 bg-slate-950 border border-slate-800 rounded-full text-xs font-bold text-slate-100 placeholder-slate-600 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
        >
        <button @click="sendReply" class="w-10 h-10 rounded-full bg-emerald-600 hover:bg-emerald-700 flex items-center justify-center text-white text-sm shadow-md transition-all active:scale-90 cursor-pointer">
          ✈️
        </button>
      </div>
    </div>
  </div>
</template>
