<script setup>
import { ref } from 'vue'
import AdminLayout from '../../layouts/AdminLayout.vue'
import { useSocialStore } from '../../stores/social'
import Swal from 'sweetalert2'

const socialStore = useSocialStore()

const heroTitle = ref(socialStore.landingConfig.heroTitle)
const heroSubtitle = ref(socialStore.landingConfig.heroSubtitle)
const sejarahText = ref(socialStore.landingConfig.sejarah)

const handleSave = () => {
  socialStore.landingConfig.heroTitle = heroTitle.value.trim()
  socialStore.landingConfig.heroSubtitle = heroSubtitle.value.trim()
  socialStore.landingConfig.sejarah = sejarahText.value.trim()

  Swal.fire({ icon: 'success', title: 'Berhasil Disimpan', text: 'Konten Landing Page berhasil diperbarui!', timer: 1500, showConfirmButton: false })
}
</script>

<template>
  <AdminLayout>
    <div class="bg-slate-900/60 border border-slate-900 rounded-lg p-6">
      <h3 class="text-xs font-black uppercase tracking-widest text-white mb-6">Kelola Konten Landing Page</h3>
      <div class="space-y-6">
        <div>
          <label class="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-2">Judul Utama Hero (Hero Title)</label>
          <input v-model="heroTitle" type="text" class="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500">
        </div>
        <div>
          <label class="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-2">Sub-judul Hero (Hero Subtitle)</label>
          <textarea v-model="heroSubtitle" rows="3" class="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"></textarea>
        </div>
        <div>
          <label class="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-2">Sejarah Organisasi (Sejarah Section)</label>
          <textarea v-model="sejarahText" rows="6" class="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"></textarea>
        </div>
        <div class="flex justify-end">
          <button @click="handleSave" class="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer">
            Simpan Perubahan Landing Page
          </button>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>
