<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import AdminLayout from '../../layouts/AdminLayout.vue'
import { useSocialStore } from '../../stores/social'
import Swal from 'sweetalert2'

const socialStore = useSocialStore()

// Tabs
const activeTab = ref('hero')

// Hero & Sejarah State
const heroTitle = ref('')
const heroSubtitle = ref('')
const sejarahText = ref('')

// About (Visi & Misi) State
const visiText = ref('')
const misiList = ref([])
const newMisiInput = ref('')

// Branding State
const brandName = ref('')
const primaryColor = ref('')
const secondaryColor = ref('')

// Hydration Logic
const initConfig = () => {
  heroTitle.value = socialStore.landingConfig?.heroTitle || ''
  heroSubtitle.value = socialStore.landingConfig?.heroSubtitle || ''
  sejarahText.value = socialStore.landingConfig?.sejarah || ''

  // Load About
  const aboutSec = socialStore.landingSections?.find(s => s.key === 'about')
  if (aboutSec && aboutSec.content) {
    let parsed = aboutSec.content
    if (typeof parsed === 'string') {
      try { parsed = JSON.parse(parsed) } catch (e) {}
    }
    visiText.value = parsed.visi || ''
    misiList.value = parsed.misi || []
  }

  // Load Brand Settings
  brandName.value = socialStore.landingSettings?.find(s => s.key === 'brand_name')?.value || 'FORMULA'
  primaryColor.value = socialStore.landingSettings?.find(s => s.key === 'primary_color')?.value || '#10b981'
  secondaryColor.value = socialStore.landingSettings?.find(s => s.key === 'secondary_color')?.value || '#047857'
}

onMounted(() => {
  initConfig()
})

watch(() => socialStore.landingConfig, initConfig, { deep: true })
watch(() => socialStore.landingSections, initConfig, { deep: true })
watch(() => socialStore.landingSettings, initConfig, { deep: true })

// ----------------------------------
// Submits
// ----------------------------------

const handleSaveHero = async () => {
  const res = await socialStore.saveLandingConfig(heroTitle.value.trim(), heroSubtitle.value.trim(), sejarahText.value.trim())
  if (res.success) {
    Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Hero & Sejarah berhasil diperbarui!', timer: 1500, showConfirmButton: false })
  } else {
    Swal.fire({ icon: 'error', title: 'Gagal', text: 'Gagal menyimpan data.' })
  }
}

const addMisi = () => {
  if (newMisiInput.value.trim()) {
    misiList.value.push(newMisiInput.value.trim())
    newMisiInput.value = ''
  }
}

const removeMisi = (index) => {
  misiList.value.splice(index, 1)
}

const handleSaveAbout = async () => {
  const payload = {
    visi: visiText.value.trim(),
    misi: misiList.value
  }
  const res = await socialStore.saveSection('about', payload)
  if (res.success) {
    Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Visi & Misi berhasil disimpan!', timer: 1500, showConfirmButton: false })
  } else {
    Swal.fire({ icon: 'error', title: 'Gagal', text: 'Gagal menyimpan data Visi & Misi.' })
  }
}

const handleSaveBranding = async () => {
  const payload = {
    brand_name: brandName.value.trim(),
    primary_color: primaryColor.value.trim(),
    secondary_color: secondaryColor.value.trim()
  }
  const res = await socialStore.saveSettings(payload)
  if (res.success) {
    // Dynamically apply to browser instantly for admin to see
    document.documentElement.style.setProperty('--primary-color', primaryColor.value)
    document.documentElement.style.setProperty('--secondary-color', secondaryColor.value)
    
    Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Pengaturan Branding & Warna Tema berhasil disimpan!', timer: 1500, showConfirmButton: false })
  } else {
    Swal.fire({ icon: 'error', title: 'Gagal', text: 'Gagal menyimpan data branding.' })
  }
}

// ----------------------------------
// Fitur / Kegiatan CRUD
// ----------------------------------
const featureForm = ref({ id: null, title: '', icon: '🌱', description: '', badge: '', order_index: 1 })
const isEditingFeature = ref(false)

const resetFeatureForm = () => {
  featureForm.value = { id: null, title: '', icon: '🌱', description: '', badge: '', order_index: 1 }
  isEditingFeature.value = false
}

const editFeature = (feat) => {
  featureForm.value = { ...feat }
  isEditingFeature.value = true
}

const handleSaveFeature = async () => {
  if (!featureForm.value.title || !featureForm.value.description) {
    Swal.fire({ icon: 'warning', title: 'Validasi', text: 'Judul dan Deskripsi wajib diisi!' })
    return
  }
  const res = await socialStore.saveFeature(featureForm.value)
  if (res.success) {
    Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Fitur/Kegiatan berhasil disimpan!', timer: 1500, showConfirmButton: false })
    resetFeatureForm()
  } else {
    Swal.fire({ icon: 'error', title: 'Gagal', text: 'Gagal menyimpan data fitur.' })
  }
}

const handleDeleteFeature = async (id) => {
  const confirm = await Swal.fire({
    title: 'Hapus Fitur?',
    text: 'Tindakan ini tidak dapat dibatalkan.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    confirmButtonText: 'Ya, Hapus'
  })
  if (confirm.isConfirmed) {
    const res = await socialStore.deleteFeature(id)
    if (res.success) {
      Swal.fire({ icon: 'success', title: 'Dihapus', text: 'Fitur berhasil dihapus!', timer: 1500, showConfirmButton: false })
    }
  }
}

// ----------------------------------
// Galeri Dokumentasi CRUD
// ----------------------------------
const galleryForm = ref({ id: null, title: '', image_url: '', category: 'Kegiatan', description: '', event_date: new Date().toISOString().substring(0, 10) })
const isEditingGallery = ref(false)

const resetGalleryForm = () => {
  galleryForm.value = { id: null, title: '', image_url: '', category: 'Kegiatan', description: '', event_date: new Date().toISOString().substring(0, 10) }
  isEditingGallery.value = false
}

const editGallery = (item) => {
  galleryForm.value = { ...item }
  isEditingGallery.value = true
}

const handleSaveGallery = async () => {
  if (!galleryForm.value.title || !galleryForm.value.image_url) {
    Swal.fire({ icon: 'warning', title: 'Validasi', text: 'Judul dan URL Gambar wajib diisi!' })
    return
  }
  const res = await socialStore.saveGallery(galleryForm.value)
  if (res.success) {
    Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Foto Dokumentasi berhasil disimpan!', timer: 1500, showConfirmButton: false })
    resetGalleryForm()
  } else {
    Swal.fire({ icon: 'error', title: 'Gagal', text: 'Gagal menyimpan dokumentasi.' })
  }
}

const handleDeleteGallery = async (id) => {
  const confirm = await Swal.fire({
    title: 'Hapus Foto?',
    text: 'Dokumentasi akan terhapus dari landing page.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    confirmButtonText: 'Ya, Hapus'
  })
  if (confirm.isConfirmed) {
    const res = await socialStore.deleteGallery(id)
    if (res.success) {
      Swal.fire({ icon: 'success', title: 'Dihapus', text: 'Foto berhasil dihapus!', timer: 1500, showConfirmButton: false })
    }
  }
}

// ----------------------------------
// FAQ Accordion CRUD
// ----------------------------------
const faqForm = ref({ id: null, question: '', answer: '', order_index: 1 })
const isEditingFaq = ref(false)

const resetFaqForm = () => {
  faqForm.value = { id: null, question: '', answer: '', order_index: 1 }
  isEditingFaq.value = false
}

const editFaq = (faq) => {
  faqForm.value = { ...faq }
  isEditingFaq.value = true
}

const handleSaveFaq = async () => {
  if (!faqForm.value.question || !faqForm.value.answer) {
    Swal.fire({ icon: 'warning', title: 'Validasi', text: 'Pertanyaan dan Jawaban wajib diisi!' })
    return
  }
  const res = await socialStore.saveFaq(faqForm.value)
  if (res.success) {
    Swal.fire({ icon: 'success', title: 'Berhasil', text: 'FAQ berhasil disimpan!', timer: 1500, showConfirmButton: false })
    resetFaqForm()
  } else {
    Swal.fire({ icon: 'error', title: 'Gagal', text: 'Gagal menyimpan FAQ.' })
  }
}

const handleDeleteFaq = async (id) => {
  const confirm = await Swal.fire({
    title: 'Hapus FAQ?',
    text: 'Tindakan ini tidak dapat dibatalkan.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    confirmButtonText: 'Ya, Hapus'
  })
  if (confirm.isConfirmed) {
    const res = await socialStore.deleteFaq(id)
    if (res.success) {
      Swal.fire({ icon: 'success', title: 'Dihapus', text: 'FAQ berhasil dihapus!', timer: 1500, showConfirmButton: false })
    }
  }
}

// ----------------------------------
// Tautan Medsos CRUD
// ----------------------------------
const socialLinkForm = ref({ id: null, platform: '', url: '' })
const isEditingSocialLink = ref(false)

const resetSocialLinkForm = () => {
  socialLinkForm.value = { id: null, platform: '', url: '' }
  isEditingSocialLink.value = false
}

const editSocialLink = (link) => {
  socialLinkForm.value = { ...link }
  isEditingSocialLink.value = true
}

const handleSaveSocialLink = async () => {
  if (!socialLinkForm.value.platform || !socialLinkForm.value.url) {
    Swal.fire({ icon: 'warning', title: 'Validasi', text: 'Nama Platform dan URL wajib diisi!' })
    return
  }
  const res = await socialStore.saveSocialLink(socialLinkForm.value)
  if (res.success) {
    Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Tautan Medsos berhasil disimpan!', timer: 1500, showConfirmButton: false })
    resetSocialLinkForm()
  } else {
    Swal.fire({ icon: 'error', title: 'Gagal', text: 'Gagal menyimpan medsos.' })
  }
}

const handleDeleteSocialLink = async (id) => {
  const confirm = await Swal.fire({
    title: 'Hapus Tautan?',
    text: 'Medsos ini akan dihapus dari footer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    confirmButtonText: 'Ya, Hapus'
  })
  if (confirm.isConfirmed) {
    const res = await socialStore.deleteSocialLink(id)
    if (res.success) {
      Swal.fire({ icon: 'success', title: 'Dihapus', text: 'Tautan medsos berhasil dihapus!', timer: 1500, showConfirmButton: false })
    }
  }
}
</script>

<template>
  <AdminLayout>
    <div class="flex flex-col lg:flex-row gap-8">
      
      <!-- Left Sidebar Tabs (Horizontal scroll on mobile, vertical column on large screen) -->
      <div class="w-full lg:w-64 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-3 lg:pb-0 flex-nowrap scrollbar-none">
        <button 
          v-for="tab in [
            { id: 'hero', name: 'Header & Sejarah', emoji: '🕌' },
            { id: 'about', name: 'Visi & Misi', emoji: '🌿' },
            { id: 'brand', name: 'Branding & Warna', emoji: '🎨' },
            { id: 'features', name: 'Kegiatan / Fitur', emoji: '⚡' },
            { id: 'gallery', name: 'Galeri Dokumentasi', emoji: '📸' },
            { id: 'faqs', name: 'FAQ Tanya Jawab', emoji: '❓' },
            { id: 'social', name: 'Tautan Medsos', emoji: '🔗' }
          ]" 
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'flex-shrink-0 flex items-center gap-3 px-4 py-3 lg:px-5 lg:py-4 rounded-xl lg:rounded-2xl font-black text-[10px] lg:text-xs uppercase tracking-widest text-left transition-all border cursor-pointer',
            activeTab === tab.id 
              ? 'bg-emerald-600 border-emerald-600 text-white shadow-xl shadow-emerald-500/25' 
              : 'bg-slate-900/60 border-slate-900 text-slate-400 hover:text-white hover:bg-slate-800/50'
          ]"
        >
          <span>{{ tab.emoji }}</span>
          <span>{{ tab.name }}</span>
        </button>
      </div>

      <!-- Right Main Content Panel -->
      <div class="flex-1 bg-slate-900/60 border border-slate-900 rounded-xl lg:rounded-[2rem] p-4 lg:p-8 shadow-2xl shadow-emerald-500/5">
        
        <!-- Tab 1: Hero & Sejarah -->
        <div v-if="activeTab === 'hero'" class="space-y-6">
          <div class="border-b border-slate-800/80 pb-4">
            <h3 class="text-sm font-black uppercase tracking-widest text-white">Kelola Hero Header & Sejarah</h3>
            <p class="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">Sesuaikan kata sambutan dan sejarah dusun</p>
          </div>

          <div class="space-y-6">
            <div>
              <label class="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-2">Judul Utama Hero (Hero Title)</label>
              <input v-model="heroTitle" type="text" class="w-full px-5 py-4 bg-slate-950 border border-slate-800 rounded-2xl text-xs font-bold text-white placeholder-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-all">
            </div>
            <div>
              <label class="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-2">Sub-judul Hero (Hero Subtitle)</label>
              <textarea v-model="heroSubtitle" rows="3" class="w-full px-5 py-4 bg-slate-950 border border-slate-800 rounded-2xl text-xs font-bold text-white placeholder-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-all resize-none"></textarea>
            </div>
            <div>
              <label class="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-2">Sejarah Singkat Organisasi</label>
              <textarea v-model="sejarahText" rows="6" class="w-full px-5 py-4 bg-slate-950 border border-slate-800 rounded-2xl text-xs font-medium text-white placeholder-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-all resize-none"></textarea>
            </div>
            <div class="flex justify-end pt-4">
              <button @click="handleSaveHero" class="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-95">
                Simpan Konfig Hero & Sejarah
              </button>
            </div>
          </div>
        </div>

        <!-- Tab 2: About (Visi & Misi) -->
        <div v-if="activeTab === 'about'" class="space-y-6">
          <div class="border-b border-slate-800/80 pb-4">
            <h3 class="text-sm font-black uppercase tracking-widest text-white">Kelola Visi & Misi</h3>
            <p class="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">Seksi Penjabaran Visi Misi Organisasi</p>
          </div>

          <div class="space-y-6">
            <div>
              <label class="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-2">Pernyataan Visi Utama</label>
              <textarea v-model="visiText" rows="3" class="w-full px-5 py-4 bg-slate-950 border border-slate-800 rounded-2xl text-xs font-bold text-white placeholder-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-all resize-none"></textarea>
            </div>
            
            <div class="space-y-4">
              <label class="block text-[10px] font-black uppercase tracking-wider text-slate-500">Poin Misi Organisasi</label>
              
              <div class="flex gap-2">
                <input v-model="newMisiInput" type="text" placeholder="Tulis poin misi baru..." @keyup.enter="addMisi" class="flex-1 px-5 py-4 bg-slate-950 border border-slate-800 rounded-2xl text-xs font-bold text-white placeholder-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-all">
                <button @click="addMisi" class="px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest cursor-pointer transition-all">Tambah</button>
              </div>

              <div class="bg-slate-950 rounded-2xl border border-slate-800 p-4 divide-y divide-slate-900">
                <div v-if="misiList.length === 0" class="p-6 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Belum ada poin misi ditambahkan.
                </div>
                <div v-for="(misi, idx) in misiList" :key="idx" class="py-3 px-2 flex justify-between items-center gap-4 group">
                  <div class="flex items-center gap-3">
                    <span class="w-5 h-5 bg-emerald-950 border border-emerald-800/40 rounded-lg flex items-center justify-center text-[10px] font-black text-emerald-400">{{ idx + 1 }}</span>
                    <span class="text-xs text-slate-300 font-medium">{{ misi }}</span>
                  </div>
                  <button @click="removeMisi(idx)" class="text-rose-500 hover:text-rose-600 font-bold text-[10px] uppercase tracking-wider cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">Hapus</button>
                </div>
              </div>
            </div>

            <div class="flex justify-end pt-4">
              <button @click="handleSaveAbout" class="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-95">
                Simpan Konfig Visi & Misi
              </button>
            </div>
          </div>
        </div>

        <!-- Tab 3: Branding & Warna Tema -->
        <div v-if="activeTab === 'brand'" class="space-y-6">
          <div class="border-b border-slate-800/80 pb-4">
            <h3 class="text-sm font-black uppercase tracking-widest text-white">Kelola Branding & Warna Tema</h3>
            <p class="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">Ubah estetika web tanpa menyentuh kode CSS sama sekali</p>
          </div>

          <div class="space-y-6">
            <div>
              <label class="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-2">Nama Brand Utama (Brand Name)</label>
              <input v-model="brandName" type="text" class="w-full px-5 py-4 bg-slate-950 border border-slate-800 rounded-2xl text-xs font-bold text-white placeholder-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-all">
            </div>
            
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <label class="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-2">Warna Primer Web (Primary Color)</label>
                <div class="flex gap-3">
                  <input v-model="primaryColor" type="color" class="w-16 h-12 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer p-1">
                  <input v-model="primaryColor" type="text" class="flex-1 px-5 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-white focus:outline-hidden">
                </div>
                <p class="text-[9px] text-slate-500 mt-2 font-bold uppercase tracking-wide">Mempengaruhi warna tombol utama, navbar highlight, and judul.</p>
              </div>

              <div>
                <label class="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-2">Warna Sekunder Web (Secondary Color)</label>
                <div class="flex gap-3">
                  <input v-model="secondaryColor" type="color" class="w-16 h-12 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer p-1">
                  <input v-model="secondaryColor" type="text" class="flex-1 px-5 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-white focus:outline-hidden">
                </div>
                <p class="text-[9px] text-slate-500 mt-2 font-bold uppercase tracking-wide">Mempengaruhi warna efek hover, detail dekoratif, and link sekunder.</p>
              </div>
            </div>

            <div class="flex justify-end pt-4">
              <button @click="handleSaveBranding" class="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-95">
                Simpan Branding & Suntik Warna
              </button>
            </div>
          </div>
        </div>

        <!-- Tab 4: Fitur / Kegiatan CRUD -->
        <div v-if="activeTab === 'features'" class="space-y-6">
          <div class="border-b border-slate-800/80 pb-4 flex justify-between items-center">
            <div>
              <h3 class="text-sm font-black uppercase tracking-widest text-white">Kelola Kartu Kegiatan (CMS Features)</h3>
              <p class="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">Tambah, edit, and hapus kartu aksi kepemudaan</p>
            </div>
            <button v-if="isEditingFeature" @click="resetFeatureForm" class="px-4 py-2 border border-slate-800 text-slate-400 hover:text-white rounded-xl font-black text-[10px] uppercase tracking-wider cursor-pointer">Batal Edit</button>
          </div>

          <!-- Feature Form -->
          <div class="bg-slate-950 border border-slate-800 p-6 rounded-[1.5rem] space-y-4">
            <h4 class="text-[10px] font-black uppercase tracking-widest text-emerald-400">{{ isEditingFeature ? 'Mode Edit Kartu Kegiatan' : 'Tambah Kartu Kegiatan Baru' }}</h4>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-[9px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Emoji Ikon</label>
                <input v-model="featureForm.icon" type="text" class="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-white focus:outline-hidden">
              </div>
              <div class="md:col-span-2">
                <label class="block text-[9px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Judul Kegiatan</label>
                <input v-model="featureForm.title" type="text" class="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-white focus:outline-hidden">
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="md:col-span-2">
                <label class="block text-[9px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Siklus / Badge Periode (e.g. Mingguan, Rutin Bulanan)</label>
                <input v-model="featureForm.badge" type="text" class="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-white focus:outline-hidden">
              </div>
              <div>
                <label class="block text-[9px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Nomor Urutan Tampil</label>
                <input v-model.number="featureForm.order_index" type="number" class="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-white focus:outline-hidden">
              </div>
            </div>

            <div>
              <label class="block text-[9px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Deskripsi Singkat Aksi</label>
              <textarea v-model="featureForm.description" rows="2" class="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-xs font-medium text-white focus:outline-hidden resize-none"></textarea>
            </div>

            <div class="flex justify-end pt-2">
              <button @click="handleSaveFeature" class="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-[10px] uppercase tracking-widest cursor-pointer transition-all shadow-lg shadow-emerald-500/10">
                {{ isEditingFeature ? 'Simpan Edit Kegiatan' : 'Publikasi Kegiatan Baru' }}
              </button>
            </div>
          </div>

          <!-- Feature List -->
          <div class="overflow-x-auto border border-slate-900 bg-slate-950/60 rounded-[1.5rem] scrollbar-none">
            <table class="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr class="bg-slate-950 border-b border-slate-900 text-slate-500 text-[9px] font-black uppercase tracking-widest">
                  <th class="p-4 w-16 text-center">Urut</th>
                  <th class="p-4 w-16 text-center">Ikon</th>
                  <th class="p-4">Nama Kegiatan</th>
                  <th class="p-4">Deskripsi</th>
                  <th class="p-4">Badge</th>
                  <th class="p-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-900 text-xs font-bold text-slate-300">
                <tr v-for="feat in socialStore.landingFeatures" :key="feat.id" class="hover:bg-slate-900/20 transition-colors">
                  <td class="p-4 text-center font-black text-slate-500">#{{ feat.order_index }}</td>
                  <td class="p-4 text-center text-lg">{{ feat.icon }}</td>
                  <td class="p-4 text-white font-black">{{ feat.title }}</td>
                  <td class="p-4 text-slate-400 font-medium max-w-xs truncate">{{ feat.description }}</td>
                  <td class="p-4 text-emerald-400 text-[10px] font-black uppercase tracking-wider">{{ feat.badge }}</td>
                  <td class="p-4 text-center space-x-2">
                    <button @click="editFeature(feat)" class="text-emerald-500 hover:text-emerald-400 font-black uppercase text-[10px] tracking-wider cursor-pointer">Edit</button>
                    <button @click="handleDeleteFeature(feat.id)" class="text-rose-500 hover:text-rose-400 font-black uppercase text-[10px] tracking-wider cursor-pointer">Hapus</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Tab 5: Galeri Dokumentasi CRUD -->
        <div v-if="activeTab === 'gallery'" class="space-y-6">
          <div class="border-b border-slate-800/80 pb-4 flex justify-between items-center">
            <div>
              <h3 class="text-sm font-black uppercase tracking-widest text-white">Kelola Galeri Dokumentasi (Gallery Items)</h3>
              <p class="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">Ugah assets dokumentasi visual acara</p>
            </div>
            <button v-if="isEditingGallery" @click="resetGalleryForm" class="px-4 py-2 border border-slate-800 text-slate-400 hover:text-white rounded-xl font-black text-[10px] uppercase tracking-wider cursor-pointer">Batal Edit</button>
          </div>

          <!-- Gallery Form -->
          <div class="bg-slate-950 border border-slate-800 p-6 rounded-[1.5rem] space-y-4">
            <h4 class="text-[10px] font-black uppercase tracking-widest text-emerald-400">{{ isEditingGallery ? 'Mode Edit Foto Dokumentasi' : 'Tambah Foto Dokumentasi Baru' }}</h4>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-[9px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Nama Acara / Judul</label>
                <input v-model="galleryForm.title" type="text" class="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-white focus:outline-hidden">
              </div>
              <div>
                <label class="block text-[9px] font-black uppercase tracking-wider text-slate-500 mb-1.5">URL Gambar Dokumentasi</label>
                <input v-model="galleryForm.image_url" type="text" class="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-white focus:outline-hidden">
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-[9px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Kategori</label>
                <input v-model="galleryForm.category" type="text" class="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-white focus:outline-hidden">
              </div>
              <div>
                <label class="block text-[9px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Tanggal Acara</label>
                <input v-model="galleryForm.event_date" type="date" class="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-white focus:outline-hidden">
              </div>
            </div>

            <div>
              <label class="block text-[9px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Keterangan Singkat Acara</label>
              <textarea v-model="galleryForm.description" rows="2" class="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-xs font-medium text-white focus:outline-hidden resize-none"></textarea>
            </div>

            <div class="flex justify-end pt-2">
              <button @click="handleSaveGallery" class="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-[10px] uppercase tracking-widest cursor-pointer transition-all shadow-lg shadow-emerald-500/10">
                {{ isEditingGallery ? 'Simpan Edit Foto' : 'Unggah Foto Baru' }}
              </button>
            </div>
          </div>

          <!-- Gallery List -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="item in socialStore.landingGallery" :key="item.id" class="bg-slate-950 border border-slate-900 p-4 rounded-2xl flex gap-4 hover:border-slate-800 transition-colors">
              <img :src="item.image_url" class="w-24 h-24 rounded-xl object-cover bg-slate-900 border border-slate-800">
              <div class="flex-1 flex flex-col justify-between">
                <div>
                  <span class="text-[8px] font-black bg-emerald-950 border border-emerald-900 text-emerald-400 px-2 py-0.5 rounded-md uppercase tracking-wider">{{ item.category }}</span>
                  <h5 class="text-xs font-black text-white mt-1 leading-snug">{{ item.title }}</h5>
                  <p class="text-[10px] text-slate-500 font-medium line-clamp-2 mt-1 leading-normal">{{ item.description }}</p>
                </div>
                <div class="flex justify-between items-center mt-2 border-t border-slate-900 pt-2">
                  <span class="text-[9px] font-bold text-slate-600 uppercase tracking-widest">{{ item.event_date }}</span>
                  <div class="space-x-2">
                    <button @click="editGallery(item)" class="text-emerald-500 hover:text-emerald-400 font-black uppercase text-[10px] cursor-pointer">Edit</button>
                    <button @click="handleDeleteGallery(item.id)" class="text-rose-500 hover:text-rose-400 font-black uppercase text-[10px] cursor-pointer">Hapus</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab 6: FAQ Accordion CRUD -->
        <div v-if="activeTab === 'faqs'" class="space-y-6">
          <div class="border-b border-slate-800/80 pb-4 flex justify-between items-center">
            <div>
              <h3 class="text-sm font-black uppercase tracking-widest text-white">Kelola Tanya Jawab (Accordion FAQs)</h3>
              <p class="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">Ubah atau tambah pertanyaan yang sering ditanyakan warga</p>
            </div>
            <button v-if="isEditingFaq" @click="resetFaqForm" class="px-4 py-2 border border-slate-800 text-slate-400 hover:text-white rounded-xl font-black text-[10px] uppercase tracking-wider cursor-pointer">Batal Edit</button>
          </div>

          <!-- FAQ Form -->
          <div class="bg-slate-950 border border-slate-800 p-6 rounded-[1.5rem] space-y-4">
            <h4 class="text-[10px] font-black uppercase tracking-widest text-emerald-400">{{ isEditingFaq ? 'Mode Edit FAQ' : 'Tambah FAQ Baru' }}</h4>
            
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div class="md:col-span-3">
                <label class="block text-[9px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Pertanyaan</label>
                <input v-model="faqForm.question" type="text" class="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-white focus:outline-hidden">
              </div>
              <div>
                <label class="block text-[9px] font-black uppercase tracking-wider text-slate-500 mb-1.5">No Urut Tampil</label>
                <input v-model.number="faqForm.order_index" type="number" class="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-white focus:outline-hidden">
              </div>
            </div>

            <div>
              <label class="block text-[9px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Jawaban Lengkap</label>
              <textarea v-model="faqForm.answer" rows="3" class="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-xs font-medium text-white focus:outline-hidden resize-none"></textarea>
            </div>

            <div class="flex justify-end pt-2">
              <button @click="handleSaveFaq" class="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-[10px] uppercase tracking-widest cursor-pointer transition-all shadow-lg shadow-emerald-500/10">
                {{ isEditingFaq ? 'Simpan Edit FAQ' : 'Publikasi FAQ Baru' }}
              </button>
            </div>
          </div>

          <!-- FAQ List -->
          <div class="space-y-3">
            <div v-for="faq in socialStore.landingFaqs" :key="faq.id" class="bg-slate-950 border border-slate-900 p-5 rounded-2xl flex justify-between items-start gap-6 hover:border-slate-800 transition-colors group">
              <div class="space-y-1">
                <span class="text-[9px] font-black text-slate-500 uppercase tracking-widest">FAQ #{{ faq.order_index }}</span>
                <h5 class="text-xs font-black text-white leading-snug">{{ faq.question }}</h5>
                <p class="text-[11px] text-slate-400 font-medium leading-relaxed mt-1">{{ faq.answer }}</p>
              </div>
              <div class="flex gap-3 flex-shrink-0 pt-1">
                <button @click="editFaq(faq)" class="text-emerald-500 hover:text-emerald-400 font-black uppercase text-[10px] cursor-pointer">Edit</button>
                <button @click="handleDeleteFaq(faq.id)" class="text-rose-500 hover:text-rose-400 font-black uppercase text-[10px] cursor-pointer">Hapus</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab 7: Tautan Medsos CRUD -->
        <div v-if="activeTab === 'social'" class="space-y-6">
          <div class="border-b border-slate-800/80 pb-4 flex justify-between items-center">
            <div>
              <h3 class="text-sm font-black uppercase tracking-widest text-white">Kelola Tautan Medsos Footer</h3>
              <p class="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">Ubah atau tambah tautan medsos resmi organisasi</p>
            </div>
            <button v-if="isEditingSocialLink" @click="resetSocialLinkForm" class="px-4 py-2 border border-slate-800 text-slate-400 hover:text-white rounded-xl font-black text-[10px] uppercase tracking-wider cursor-pointer">Batal Edit</button>
          </div>

          <!-- Social Link Form -->
          <div class="bg-slate-950 border border-slate-800 p-6 rounded-[1.5rem] space-y-4">
            <h4 class="text-[10px] font-black uppercase tracking-widest text-emerald-400">{{ isEditingSocialLink ? 'Mode Edit Tautan Medsos' : 'Tambah Tautan Medsos Baru' }}</h4>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-[9px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Nama Platform (e.g. Instagram, WhatsApp, YouTube)</label>
                <input v-model="socialLinkForm.platform" type="text" class="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-white focus:outline-hidden" placeholder="Instagram">
              </div>
              <div>
                <label class="block text-[9px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Tujuan URL Medsos</label>
                <input v-model="socialLinkForm.url" type="text" class="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-white focus:outline-hidden" placeholder="https://instagram.com/...">
              </div>
            </div>

            <div class="flex justify-end pt-2">
              <button @click="handleSaveSocialLink" class="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-[10px] uppercase tracking-widest cursor-pointer transition-all shadow-lg shadow-emerald-500/10">
                {{ isEditingSocialLink ? 'Simpan Edit Tautan' : 'Simpan Tautan Baru' }}
              </button>
            </div>
          </div>

          <!-- Social Link List -->
          <div class="overflow-x-auto border border-slate-900 bg-slate-950/60 rounded-[1.5rem] scrollbar-none">
            <table class="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr class="bg-slate-950 border-b border-slate-900 text-slate-500 text-[9px] font-black uppercase tracking-widest">
                  <th class="p-4">Nama Platform</th>
                  <th class="p-4">Tujuan Tautan URL</th>
                  <th class="p-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-900 text-xs font-bold text-slate-300">
                <tr v-for="link in socialStore.landingSocialLinks" :key="link.id" class="hover:bg-slate-900/20 transition-colors">
                  <td class="p-4 text-white font-black flex items-center gap-2">
                    <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    {{ link.platform }}
                  </td>
                  <td class="p-4 text-slate-400 font-medium font-mono select-all">{{ link.url }}</td>
                  <td class="p-4 text-center space-x-2">
                    <button @click="editSocialLink(link)" class="text-emerald-500 hover:text-emerald-400 font-black uppercase text-[10px] cursor-pointer">Edit</button>
                    <button @click="handleDeleteSocialLink(link.id)" class="text-rose-500 hover:text-rose-400 font-black uppercase text-[10px] cursor-pointer">Hapus</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  </AdminLayout>
</template>

<style scoped>
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
