<script setup>
import { ref, onMounted, watch } from 'vue'
import { useSocialStore } from '../../../stores/social'
import Swal from 'sweetalert2'

const socialStore = useSocialStore()

const activeTab = ref('hero')

const heroTitle = ref('')
const heroSubtitle = ref('')
const sejarahText = ref('')

const visiText = ref('')
const misiList = ref([])
const newMisiInput = ref('')

const brandName = ref('')
const primaryColor = ref('')
const secondaryColor = ref('')

const initConfig = () => {
  heroTitle.value = socialStore.landingConfig?.heroTitle || ''
  heroSubtitle.value = socialStore.landingConfig?.heroSubtitle || ''
  sejarahText.value = socialStore.landingConfig?.sejarah || ''

  const aboutSec = socialStore.landingSections?.find(s => s.key === 'about')
  if (aboutSec && aboutSec.content) {
    let parsed = aboutSec.content
    if (typeof parsed === 'string') {
      try { parsed = JSON.parse(parsed) } catch (e) {}
    }
    visiText.value = parsed.visi || ''
    misiList.value = parsed.misi || []
  }

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

const handleSaveHero = async () => {
  const res = await socialStore.saveLandingConfig(heroTitle.value.trim(), heroSubtitle.value.trim(), sejarahText.value.trim())
  if (res.success) {
    Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Hero & Sejarah diperbarui!', timer: 1500, showConfirmButton: false })
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
    Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Visi & Misi disimpan!', timer: 1500, showConfirmButton: false })
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
    document.documentElement.style.setProperty('--primary-color', primaryColor.value)
    document.documentElement.style.setProperty('--secondary-color', secondaryColor.value)
    Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Tema berhasil disimpan!', timer: 1500, showConfirmButton: false })
  }
}

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
  if (!featureForm.value.title || !featureForm.value.description) return
  const res = await socialStore.saveFeature(featureForm.value)
  if (res.success) {
    resetFeatureForm()
    Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Fitur disimpan!', timer: 1500, showConfirmButton: false })
  }
}

const handleDeleteFeature = async (id) => {
  const confirm = await Swal.fire({
    title: 'Hapus Fitur?',
    text: 'Aksi ini tidak bisa dibatalkan!',
    icon: 'warning',
    showCancelButton: true
  })
  if (confirm.isConfirmed) {
    const res = await socialStore.deleteFeature(id)
    if (res.success) {
      Swal.fire({ icon: 'success', title: 'Dihapus', text: 'Fitur dihapus!', timer: 1500, showConfirmButton: false })
    }
  }
}

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
  if (!galleryForm.value.title || !galleryForm.value.image_url) return
  const res = await socialStore.saveGallery(galleryForm.value)
  if (res.success) {
    resetGalleryForm()
    Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Dokumentasi disimpan!', timer: 1500, showConfirmButton: false })
  }
}

const handleDeleteGallery = async (id) => {
  const confirm = await Swal.fire({
    title: 'Hapus Foto?',
    icon: 'warning',
    showCancelButton: true
  })
  if (confirm.isConfirmed) {
    const res = await socialStore.deleteGallery(id)
    if (res.success) {
      Swal.fire({ icon: 'success', title: 'Dihapus', text: 'Foto dihapus!', timer: 1500, showConfirmButton: false })
    }
  }
}

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
  if (!faqForm.value.question || !faqForm.value.answer) return
  const res = await socialStore.saveFaq(faqForm.value)
  if (res.success) {
    resetFaqForm()
    Swal.fire({ icon: 'success', title: 'Berhasil', text: 'FAQ disimpan!', timer: 1500, showConfirmButton: false })
  }
}

const handleDeleteFaq = async (id) => {
  const confirm = await Swal.fire({
    title: 'Hapus FAQ?',
    icon: 'warning',
    showCancelButton: true
  })
  if (confirm.isConfirmed) {
    const res = await socialStore.deleteFaq(id)
    if (res.success) {
      Swal.fire({ icon: 'success', title: 'Dihapus', text: 'FAQ dihapus!', timer: 1500, showConfirmButton: false })
    }
  }
}

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
  if (!socialLinkForm.value.platform || !socialLinkForm.value.url) return
  const res = await socialStore.saveSocialLink(socialLinkForm.value)
  if (res.success) {
    resetSocialLinkForm()
    Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Medsos disimpan!', timer: 1500, showConfirmButton: false })
  }
}

const handleDeleteSocialLink = async (id) => {
  const confirm = await Swal.fire({
    title: 'Hapus Medsos?',
    icon: 'warning',
    showCancelButton: true
  })
  if (confirm.isConfirmed) {
    const res = await socialStore.deleteSocialLink(id)
    if (res.success) {
      Swal.fire({ icon: 'success', title: 'Dihapus', text: 'Medsos dihapus!', timer: 1500, showConfirmButton: false })
    }
  }
}
</script>

<template>
  <div class="flex gap-8 items-stretch">
    <div class="w-64 flex-shrink-0">
      <div class="bg-white border border-slate-200/70 rounded-2xl p-4 flex flex-col gap-2 h-full shadow-xs">
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
            'flex items-center gap-3 px-4 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest text-left transition-all border cursor-pointer w-full',
            activeTab === tab.id 
              ? 'bg-emerald-600 border-emerald-600 text-white shadow-md' 
              : 'bg-slate-50 border-slate-200/80 text-slate-500 hover:bg-slate-100'
          ]"
        >
          <span>{{ tab.emoji }}</span>
          <span>{{ tab.name }}</span>
        </button>
      </div>
    </div>

    <div class="flex-1 bg-white border border-slate-200/70 rounded-2xl p-8 shadow-xs h-full">
      <div v-if="activeTab === 'hero'" class="space-y-6">
        <div class="border-b border-slate-150 pb-4">
          <h3 class="text-xs font-black uppercase tracking-widest text-slate-800">Kelola Hero Header & Sejarah</h3>
        </div>
        <div class="space-y-6">
          <div>
            <label class="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Judul Utama Hero</label>
            <input v-model="heroTitle" type="text" class="w-full px-4 py-3 bg-white border border-slate-200 rounded-md text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500">
          </div>
          <div>
            <label class="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Sub-judul Hero</label>
            <textarea v-model="heroSubtitle" rows="3" class="w-full px-4 py-3 bg-white border border-slate-200 rounded-md text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"></textarea>
          </div>
          <div>
            <label class="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Sejarah Singkat Organisasi</label>
            <textarea v-model="sejarahText" rows="6" class="w-full px-4 py-3 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none leading-relaxed"></textarea>
          </div>
          <div class="flex justify-end pt-4">
            <button @click="handleSaveHero" class="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-black text-xs uppercase tracking-widest transition-all cursor-pointer shadow-md active:scale-95">
              Simpan Hero & Sejarah
            </button>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'about'" class="space-y-6">
        <div class="border-b border-slate-150 pb-4">
          <h3 class="text-xs font-black uppercase tracking-widest text-slate-800">Kelola Visi & Misi</h3>
        </div>
        <div class="space-y-6">
          <div>
            <label class="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Pernyataan Visi Utama</label>
            <textarea v-model="visiText" rows="3" class="w-full px-4 py-3 bg-white border border-slate-200 rounded-md text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"></textarea>
          </div>
          <div class="space-y-4">
            <label class="block text-[10px] font-black uppercase tracking-wider text-slate-500">Poin Misi Organisasi</label>
            <div class="flex gap-2">
              <input v-model="newMisiInput" type="text" placeholder="Tulis poin misi baru..." @keyup.enter="addMisi" class="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-md text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500">
              <button @click="addMisi" class="px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-black text-xs uppercase tracking-widest cursor-pointer active:scale-95">Tambah</button>
            </div>
            <div class="bg-slate-50 border border-slate-200 p-4 divide-y divide-slate-150 rounded-xl shadow-2xs">
              <div v-if="misiList.length === 0" class="p-6 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                Belum ada poin misi ditambahkan.
              </div>
              <div v-for="(misi, idx) in misiList" :key="idx" class="py-3 px-2 flex justify-between items-center gap-4 group">
                <div class="flex items-center gap-3">
                  <span class="w-5 h-5 bg-emerald-50 border border-emerald-200 rounded-md flex items-center justify-center text-[10px] font-black text-emerald-600">{{ idx + 1 }}</span>
                  <span class="text-xs text-slate-700 font-medium leading-relaxed">{{ misi }}</span>
                </div>
                <button @click="removeMisi(idx)" class="text-rose-500 hover:text-rose-600 font-black text-[10px] uppercase tracking-wider cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">Hapus</button>
              </div>
            </div>
          </div>
          <div class="flex justify-end pt-4">
            <button @click="handleSaveAbout" class="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-black text-xs uppercase tracking-widest transition-all cursor-pointer shadow-md active:scale-95">
              Simpan Visi & Misi
            </button>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'brand'" class="space-y-6">
        <div class="border-b border-slate-150 pb-4">
          <h3 class="text-xs font-black uppercase tracking-widest text-slate-800">Kelola Branding & Warna Tema</h3>
        </div>
        <div class="space-y-6">
          <div>
            <label class="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Nama Brand Utama</label>
            <input v-model="brandName" type="text" class="w-full px-4 py-3 bg-white border border-slate-200 rounded-md text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500">
          </div>
          <div class="grid grid-cols-2 gap-6">
            <div>
              <label class="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Warna Primer Web</label>
              <div class="flex gap-3">
                <input v-model="primaryColor" type="color" class="w-16 h-11 bg-white border border-slate-200 rounded-md cursor-pointer p-1">
                <input v-model="primaryColor" type="text" class="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-md text-xs font-bold text-slate-700 focus:outline-none">
              </div>
            </div>
            <div>
              <label class="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Warna Sekunder Web</label>
              <div class="flex gap-3">
                <input v-model="secondaryColor" type="color" class="w-16 h-11 bg-white border border-slate-200 rounded-md cursor-pointer p-1">
                <input v-model="secondaryColor" type="text" class="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-md text-xs font-bold text-slate-700 focus:outline-none">
              </div>
            </div>
          </div>
          <div class="flex justify-end pt-4">
            <button @click="handleSaveBranding" class="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-black text-xs uppercase tracking-widest transition-all cursor-pointer shadow-md active:scale-95">
              Simpan Branding
            </button>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'features'" class="space-y-6">
        <div class="border-b border-slate-150 pb-4 flex justify-between items-center">
          <h3 class="text-xs font-black uppercase tracking-widest text-slate-800">Kelola Kartu Kegiatan</h3>
          <button v-if="isEditingFeature" @click="resetFeatureForm" class="px-4 py-2 border border-slate-200 text-slate-550 rounded-xl font-black text-[10px] uppercase tracking-wider">Batal Edit</button>
        </div>

        <div class="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-4 shadow-2xs">
          <div class="grid grid-cols-3 gap-4">
            <div>
              <label class="block text-[9px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Emoji Ikon</label>
              <select v-model="featureForm.icon" class="w-full px-2.5 py-2.5 bg-white border border-slate-200 rounded-md text-xs font-bold text-slate-700">
                <option value="🌱">🌱 Alam/Tunas</option>
                <option value="🎁">🎁 Santunan/Sosial</option>
                <option value="🌙">🌙 Religi/Ramadhan</option>
                <option value="📚">📚 Edukasi/Cerdas</option>
                <option value="⚽">⚽ Olahraga/Futsal</option>
                <option value="📢">📢 Pengumuman/Aksi</option>
                <option value="🎨">🎨 Seni</option>
                <option value="🕌">🕌 Keagamaan</option>
                <option value="🤝">🤝 Gotong Royong</option>
              </select>
            </div>
            <div class="col-span-2">
              <label class="block text-[9px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Judul Kegiatan</label>
              <input v-model="featureForm.title" type="text" class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-md text-xs font-bold focus:outline-none">
            </div>
          </div>

          <div class="grid grid-cols-3 gap-4">
            <div class="col-span-2">
              <label class="block text-[9px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Badge Periode</label>
              <input v-model="featureForm.badge" type="text" class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-md text-xs font-bold focus:outline-none">
            </div>
            <div>
              <label class="block text-[9px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Urutan</label>
              <input v-model.number="featureForm.order_index" type="number" class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-md text-xs font-bold focus:outline-none">
            </div>
          </div>

          <div>
            <label class="block text-[9px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Deskripsi Singkat</label>
            <textarea v-model="featureForm.description" rows="2" class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-md text-xs font-medium resize-none"></textarea>
          </div>

          <div class="flex justify-end">
            <button @click="handleSaveFeature" class="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-black text-[10px] uppercase tracking-widest cursor-pointer active:scale-95">
              {{ isEditingFeature ? 'Simpan Edit' : 'Publikasi Baru' }}
            </button>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div v-for="feat in socialStore.landingFeatures" :key="feat.id" class="bg-slate-50 border border-slate-200 p-5 rounded-2xl flex flex-col justify-between hover:border-slate-300 transition-all">
            <div class="space-y-4">
              <div class="flex justify-between items-start">
                <div class="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center font-bold text-lg text-emerald-600">
                  <span>{{ feat.icon }}</span>
                </div>
                <span class="text-[9px] font-black text-slate-400 uppercase">Urutan #{{ feat.order_index }}</span>
              </div>
              <div class="space-y-1">
                <span class="inline-block px-2 py-0.5 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded text-[8px] font-black uppercase">{{ feat.badge }}</span>
                <h5 class="text-xs font-black text-slate-800 uppercase mt-2">{{ feat.title }}</h5>
                <p class="text-[10px] text-slate-500 font-semibold leading-relaxed">{{ feat.description }}</p>
              </div>
            </div>
            <div class="flex justify-end gap-3 mt-4 pt-2 border-t border-slate-200">
              <button @click="editFeature(feat)" class="text-emerald-600 hover:text-emerald-750 font-black uppercase text-[10px] cursor-pointer">Edit</button>
              <button @click="handleDeleteFeature(feat.id)" class="text-rose-600 hover:text-rose-750 font-black uppercase text-[10px] cursor-pointer">Hapus</button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'gallery'" class="space-y-6">
        <div class="border-b border-slate-150 pb-4 flex justify-between items-center">
          <h3 class="text-xs font-black uppercase tracking-widest text-slate-800">Kelola Galeri Dokumentasi</h3>
          <button v-if="isEditingGallery" @click="resetGalleryForm" class="px-4 py-2 border border-slate-200 text-slate-550 rounded-xl font-black text-[10px] uppercase tracking-wider">Batal Edit</button>
        </div>

        <div class="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-4 shadow-2xs">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[9px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Nama Acara</label>
              <input v-model="galleryForm.title" type="text" class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-md text-xs font-bold focus:outline-none">
            </div>
            <div>
              <label class="block text-[9px] font-black uppercase tracking-wider text-slate-500 mb-1.5">URL Gambar</label>
              <input v-model="galleryForm.image_url" type="text" class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-md text-xs font-bold focus:outline-none">
            </div>
          </div>

          <div class="grid grid-cols-3 gap-4">
            <div>
              <label class="block text-[9px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Kategori</label>
              <input v-model="galleryForm.category" type="text" class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-md text-xs font-bold focus:outline-none">
            </div>
            <div>
              <label class="block text-[9px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Tanggal Acara</label>
              <input v-model="galleryForm.event_date" type="date" class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-md text-xs font-bold focus:outline-none">
            </div>
          </div>

          <div>
            <label class="block text-[9px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Keterangan Singkat</label>
            <textarea v-model="galleryForm.description" rows="2" class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-md text-xs font-medium resize-none"></textarea>
          </div>

          <div class="flex justify-end">
            <button @click="handleSaveGallery" class="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-black text-[10px] uppercase tracking-widest cursor-pointer active:scale-95">
              {{ isEditingGallery ? 'Simpan Edit' : 'Unggah Foto Baru' }}
            </button>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div v-for="item in socialStore.landingGallery" :key="item.id" class="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex gap-4 hover:border-slate-300">
            <img :src="item.image_url" class="w-24 h-24 rounded-xl object-cover bg-slate-100 border border-slate-200 flex-shrink-0">
            <div class="flex-grow flex flex-col justify-between min-w-0">
              <div>
                <span class="text-[8px] font-black bg-emerald-50 border border-emerald-100 text-emerald-700 px-2 py-0.5 rounded uppercase tracking-wider">{{ item.category }}</span>
                <h5 class="text-xs font-black text-slate-800 uppercase mt-1 truncate">{{ item.title }}</h5>
                <p class="text-[10px] text-slate-500 font-semibold line-clamp-2 mt-1">{{ item.description }}</p>
              </div>
              <div class="flex justify-between items-center mt-2 border-t border-slate-150 pt-2">
                <span class="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{{ item.event_date }}</span>
                <div class="space-x-3">
                  <button @click="editGallery(item)" class="text-emerald-600 hover:text-emerald-700 font-black uppercase text-[10px] cursor-pointer">Edit</button>
                  <button @click="handleDeleteGallery(item.id)" class="text-rose-600 hover:text-rose-700 font-black uppercase text-[10px] cursor-pointer">Hapus</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'faqs'" class="space-y-6">
        <div class="border-b border-slate-150 pb-4 flex justify-between items-center">
          <h3 class="text-xs font-black uppercase tracking-widest text-slate-800">Kelola Tanya Jawab</h3>
          <button v-if="isEditingFaq" @click="resetFaqForm" class="px-4 py-2 border border-slate-200 text-slate-550 rounded-xl font-black text-[10px] uppercase tracking-wider">Batal Edit</button>
        </div>

        <div class="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-4 shadow-2xs">
          <div class="grid grid-cols-4 gap-4">
            <div class="col-span-3">
              <label class="block text-[9px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Pertanyaan</label>
              <input v-model="faqForm.question" type="text" class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-md text-xs font-bold focus:outline-none">
            </div>
            <div>
              <label class="block text-[9px] font-black uppercase tracking-wider text-slate-500 mb-1.5">No Urut</label>
              <input v-model.number="faqForm.order_index" type="number" class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-md text-xs font-bold focus:outline-none">
            </div>
          </div>

          <div>
            <label class="block text-[9px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Jawaban</label>
            <textarea v-model="faqForm.answer" rows="3" class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-md text-xs font-medium resize-none"></textarea>
          </div>

          <div class="flex justify-end">
            <button @click="handleSaveFaq" class="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-black text-[10px] uppercase tracking-widest cursor-pointer active:scale-95">
              {{ isEditingFaq ? 'Simpan Edit' : 'Publikasi Baru' }}
            </button>
          </div>
        </div>

        <div class="space-y-3">
          <div v-for="faq in socialStore.landingFaqs" :key="faq.id" class="bg-slate-50 border border-slate-200 p-5 rounded-2xl flex justify-between items-start gap-4">
            <div>
              <span class="text-[8px] font-black text-slate-400 uppercase">FAQ #{{ faq.order_index }}</span>
              <h5 class="text-xs font-black text-slate-800 uppercase mt-1 leading-snug">{{ faq.question }}</h5>
              <p class="text-[10px] text-slate-550 font-semibold leading-relaxed mt-1">{{ faq.answer }}</p>
            </div>
            <div class="flex gap-3 flex-shrink-0 pt-1">
              <button @click="editFaq(faq)" class="text-emerald-600 hover:text-emerald-700 font-black uppercase text-[10px] cursor-pointer">Edit</button>
              <button @click="handleDeleteFaq(faq.id)" class="text-rose-600 hover:text-rose-700 font-black uppercase text-[10px] cursor-pointer">Hapus</button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'social'" class="space-y-6">
        <div class="border-b border-slate-150 pb-4 flex justify-between items-center">
          <h3 class="text-xs font-black uppercase tracking-widest text-slate-800">Kelola Tautan Medsos</h3>
          <button v-if="isEditingSocialLink" @click="resetSocialLinkForm" class="px-4 py-2 border border-slate-200 text-slate-550 rounded-xl font-black text-[10px] uppercase tracking-wider">Batal Edit</button>
        </div>

        <div class="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-4 shadow-2xs">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[9px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Nama Platform</label>
              <input v-model="socialLinkForm.platform" type="text" class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-md text-xs font-bold" placeholder="Instagram">
            </div>
            <div>
              <label class="block text-[9px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Tujuan URL</label>
              <input v-model="socialLinkForm.url" type="text" class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-md text-xs font-bold" placeholder="https://instagram.com/...">
            </div>
          </div>

          <div class="flex justify-end">
            <button @click="handleSaveSocialLink" class="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-black text-[10px] uppercase tracking-widest cursor-pointer active:scale-95">
              {{ isEditingSocialLink ? 'Simpan Edit' : 'Simpan Baru' }}
            </button>
          </div>
        </div>

        <div class="overflow-x-auto border border-slate-200 bg-white rounded-2xl shadow-2xs">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-200 text-slate-500 text-[9px] font-black uppercase tracking-widest">
                <th class="p-4">Nama Platform</th>
                <th class="p-4">Tujuan Tautan URL</th>
                <th class="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-150 text-xs font-bold text-slate-700">
              <tr v-for="link in socialStore.landingSocialLinks" :key="link.id" class="hover:bg-slate-50/50 transition-colors">
                <td class="p-4 text-slate-800 font-black uppercase tracking-wide text-[10px]">{{ link.platform }}</td>
                <td class="p-4 text-slate-500 font-medium font-mono select-all">{{ link.url }}</td>
                <td class="p-4 text-center space-x-3.5">
                  <button @click="editSocialLink(link)" class="text-emerald-600 hover:text-emerald-700 font-black uppercase text-[10px] cursor-pointer">Edit</button>
                  <button @click="handleDeleteSocialLink(link.id)" class="text-rose-600 hover:text-rose-700 font-black uppercase text-[10px] cursor-pointer">Hapus</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
