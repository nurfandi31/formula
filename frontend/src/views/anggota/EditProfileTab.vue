<script setup>
defineProps({
  editName: String,
  editQuote: String,
  editHobby: String,
  editEducation: String,
  editInstagram: String,
  editAvatar: String,
  presetAvatars: Array
})
const emit = defineEmits([
  'update:editName', 'update:editQuote', 'update:editHobby',
  'update:editEducation', 'update:editInstagram', 'update:editAvatar',
  'save'
])
</script>

<template>
  <div class="max-w-lg mx-auto space-y-6 animate-in fade-in duration-300">
    <div class="text-center">
      <h2 class="text-xl sm:text-2xl font-black text-white uppercase tracking-wider">Perbarui Informasi Profil</h2>
      <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">Sesuaikan Profil Media Sosial FORMULA Anda</p>
    </div>

    <form @submit.prevent="emit('save')" class="bg-slate-900/30 border border-slate-850 rounded-[2.5rem] p-6 space-y-5 shadow-2xl">
      <div class="space-y-3">
        <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Pilih Foto Profil (Avatar)</label>
        <div class="flex justify-center gap-4 py-2">
          <div
            v-for="ava in presetAvatars"
            :key="ava.path"
            @click="emit('update:editAvatar', ava.path)"
            :class="['w-14 h-14 rounded-full overflow-hidden border cursor-pointer transition-all', editAvatar === ava.path ? 'border-emerald-500 scale-110 shadow-lg shadow-emerald-500/20' : 'border-slate-800 hover:border-slate-600']"
          >
            <img :src="ava.path" class="w-full h-full object-cover">
          </div>
        </div>
      </div>

      <div class="space-y-1.5">
        <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Nama Lengkap</label>
        <input :value="editName" @input="emit('update:editName', $event.target.value)" type="text" required
          class="w-full px-4 py-3 bg-slate-950 border border-slate-850 rounded-2xl text-xs font-bold text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500">
      </div>

      <div class="space-y-1.5">
        <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Kutipan Pribadi (Quote/Bio)</label>
        <input :value="editQuote" @input="emit('update:editQuote', $event.target.value)" type="text" placeholder="Contoh: Maju terus pemuda dusun, aksi nyata!"
          class="w-full px-4 py-3 bg-slate-950 border border-slate-850 rounded-2xl text-xs font-bold text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500">
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-1.5">
          <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest block text-left">Pendidikan</label>
          <input :value="editEducation" @input="emit('update:editEducation', $event.target.value)" type="text" placeholder="Contoh: S1 Informatika"
            class="w-full px-4 py-3 bg-slate-950 border border-slate-850 rounded-2xl text-xs font-bold text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500">
        </div>
        <div class="space-y-1.5">
          <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest block text-left">Hobi</label>
          <input :value="editHobby" @input="emit('update:editHobby', $event.target.value)" type="text" placeholder="Contoh: Futsal & Musik"
            class="w-full px-4 py-3 bg-slate-950 border border-slate-850 rounded-2xl text-xs font-bold text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500">
        </div>
      </div>

      <div class="space-y-1.5">
        <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Nama Akun Instagram</label>
        <input :value="editInstagram" @input="emit('update:editInstagram', $event.target.value)" type="text" placeholder="Contoh: @nama_kamu"
          class="w-full px-4 py-3 bg-slate-950 border border-slate-850 rounded-2xl text-xs font-bold text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500">
      </div>

      <button type="submit" class="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-emerald-600/10 cursor-pointer">
        Simpan Perubahan Profil
      </button>
    </form>
  </div>
</template>
