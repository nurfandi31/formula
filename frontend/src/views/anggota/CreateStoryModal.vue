<script setup>
import { ref } from 'vue'
const props = defineProps({
  show: Boolean,
  newStoryImage: String,
  newStoryCaption: String,
  presetImages: Array,
  storySourceMode: String,
  isCameraActive: Boolean,
  videoElement: Object
})
const emit = defineEmits([
  'close', 'publish',
  'update:newStoryCaption', 'update:newStoryImage',
  'setMode', 'toggleCamera', 'capturePhoto', 'uploadFile'
])
const storyFileInput = ref(null)
const videoEl = ref(null)
defineExpose({ videoEl })
</script>

<template>
  <div v-if="show" class="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
    <div class="bg-slate-900 border border-slate-800 rounded-[2.5rem] w-full max-w-md overflow-hidden relative shadow-2xl animate-in zoom-in-95 duration-300">
      <div class="p-6 border-b border-slate-850 flex justify-between items-center bg-slate-900/60">
        <h3 class="text-sm font-black uppercase tracking-wider text-white">Buat Cerita Saya</h3>
        <button @click="emit('close')" class="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-750 flex items-center justify-center text-slate-300 hover:text-white font-bold cursor-pointer text-xs">✕</button>
      </div>

      <div class="p-6 space-y-5">
        <div class="flex p-1 bg-slate-950 rounded-2xl border border-slate-850">
          <button
            @click="emit('setMode', 'gallery')"
            :class="['flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer', storySourceMode === 'gallery' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white']"
          >📁 Galeri & Preset</button>
          <button
            @click="emit('setMode', 'camera')"
            :class="['flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer', storySourceMode === 'camera' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white']"
          >📷 Ambil Foto</button>
        </div>

        <div v-if="storySourceMode === 'camera'" class="space-y-4">
          <div class="aspect-video rounded-2xl overflow-hidden bg-black border border-slate-800 relative shadow-inner">
            <video ref="videoEl" autoplay playsinline class="w-full h-full object-cover transform -scale-x-100"></video>
          </div>
          <div class="flex gap-3">
            <button @click="emit('toggleCamera')" class="flex-1 py-3 bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer border border-slate-800">
              🔄 Putar Kamera
            </button>
            <button @click="emit('capturePhoto')" class="flex-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer shadow-lg">
              📸 Tangkap Foto
            </button>
          </div>
        </div>

        <div v-else class="space-y-4 animate-in fade-in duration-200">
          <div class="space-y-2">
            <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Unggah Foto Cerita</label>
            <div class="aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-850 relative group shadow-inner">
              <img :src="newStoryImage" class="w-full h-full object-cover">
              <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2 transition-all">
                <button @click="storyFileInput.click()" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer">
                  Pilih File Foto
                </button>
                <p class="text-[8px] font-black text-slate-400 uppercase tracking-widest">Atau Pilih Preset Di Bawah</p>
              </div>
            </div>
            <input ref="storyFileInput" type="file" accept="image/*" class="hidden" @change="emit('uploadFile', $event)">
          </div>

          <div class="space-y-2">
            <span class="text-[8px] font-black text-slate-500 uppercase tracking-widest">Preset Cepat:</span>
            <div class="grid grid-cols-3 gap-2">
              <div
                v-for="img in presetImages"
                :key="img.id"
                @click="emit('update:newStoryImage', img.path)"
                :class="['h-12 rounded-xl overflow-hidden border cursor-pointer transition-all', newStoryImage === img.path ? 'border-emerald-500 scale-105' : 'border-slate-800 hover:border-slate-600']"
              >
                <img :src="img.path" class="w-full h-full object-cover">
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-1.5">
          <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Tulis Keterangan Cerita</label>
          <textarea
            :value="newStoryCaption"
            @input="emit('update:newStoryCaption', $event.target.value)"
            rows="3"
            placeholder="Bagikan kegiatan harian, rapat, atau ungkapan santai saat ini..."
            class="w-full px-4 py-3 bg-slate-950 border border-slate-850 rounded-2xl text-xs font-bold text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 placeholder-slate-600"
          ></textarea>
        </div>

        <button @click="emit('publish')" class="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg active:scale-[0.98] cursor-pointer">
          Bagikan Ke Cerita Saya
        </button>
      </div>
    </div>
  </div>
</template>
