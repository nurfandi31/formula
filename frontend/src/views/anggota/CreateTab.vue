<script setup>
const props = defineProps({
  presetImages: Array,
  selectedImage: String,
  captionText: String
})
const emit = defineEmits(['update:selectedImage', 'update:captionText', 'publish', 'uploadImage'])
</script>

<template>
  <div class="max-w-lg mx-auto space-y-6 animate-in fade-in duration-300">
    <div class="text-center">
      <h2 class="text-xl sm:text-2xl font-black text-white uppercase tracking-wider">Buat Kiriman Baru</h2>
      <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">Bagikan Kegiatan Anda di Dusun Ngampon</p>
    </div>

    <div class="bg-slate-900/30 border border-slate-850 rounded-[2.5rem] p-6 space-y-6 shadow-2xl relative overflow-hidden">
      <div class="space-y-2">
        <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Unggah Foto Kiriman</label>
        <div class="aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-850 relative group">
          <img :src="selectedImage" class="w-full h-full object-cover">
          <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2 transition-all">
            <button @click="emit('uploadImage')" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer">
              Pilih File Foto
            </button>
            <p class="text-[8px] font-black text-slate-400 uppercase tracking-widest">Atau Pilih Preset Di Bawah</p>
          </div>
        </div>
      </div>

      <div class="space-y-2">
        <span class="text-[8px] font-black text-slate-500 uppercase tracking-widest">Opsi Foto Cepat (Preset):</span>
        <div class="grid grid-cols-3 gap-3">
          <div
            v-for="img in presetImages"
            :key="img.id"
            @click="emit('update:selectedImage', img.path)"
            :class="['h-14 rounded-xl overflow-hidden border cursor-pointer transition-all', selectedImage === img.path ? 'border-emerald-500 scale-105 shadow-md shadow-emerald-500/10' : 'border-slate-800 hover:border-slate-600']"
          >
            <img :src="img.path" class="w-full h-full object-cover">
          </div>
        </div>
      </div>

      <div class="space-y-1.5">
        <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Tulis Keterangan (Caption)</label>
        <textarea
          :value="captionText"
          @input="emit('update:captionText', $event.target.value)"
          rows="4"
          placeholder="Semangat pemuda Ngampon! Berikan deskripsi yang menginspirasi... #FormulaAksi #PemudaDusun"
          class="w-full px-4 py-3.5 bg-slate-950 border border-slate-850 rounded-2xl text-xs font-bold text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 placeholder-slate-600"
        ></textarea>
      </div>

      <button
        @click="emit('publish')"
        class="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-emerald-600/10 active:scale-[0.98] cursor-pointer"
      >
        Bagikan Kiriman Sekarang
      </button>
    </div>
  </div>
</template>
