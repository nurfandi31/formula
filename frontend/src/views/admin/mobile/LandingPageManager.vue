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
    Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Tersimpan!', timer: 1200, showConfirmButton: false })
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
  const payload = { visi: visiText.value.trim(), misi: misiList.value }
  const res = await socialStore.saveSection('about', payload)
  if (res.success) {
    Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Tersimpan!', timer: 1200, showConfirmButton: false })
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
    Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Tersimpan!', timer: 1200, showConfirmButton: false })
  }
}

const featureForm = ref({ id: null, title: '', icon: '🌱', description: '', badge: '', order_index: 1 })
const isEditingFeature = ref(false)
const isFeatureModalOpen = ref(false)

const resetFeatureForm = () => {
  featureForm.value = { id: null, title: '', icon: '🌱', description: '', badge: '', order_index: 1 }
  isEditingFeature.value = false
  isFeatureModalOpen.value = false
}

const editFeature = (feat) => {
  featureForm.value = { ...feat }
  isEditingFeature.value = true
  isFeatureModalOpen.value = true
}

const handleSaveFeature = async () => {
  if (!featureForm.value.title || !featureForm.value.description) return
  const res = await socialStore.saveFeature(featureForm.value)
  if (res.success) {
    resetFeatureForm()
    Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Tersimpan!', timer: 1200, showConfirmButton: false })
  }
}

const handleDeleteFeature = async (id) => {
  const confirm = await Swal.fire({
    title: 'Hapus Kegiatan?',
    icon: 'warning',
    showCancelButton: true
  })
  if (confirm.isConfirmed) {
    const res = await socialStore.deleteFeature(id)
    if (res.success) {
      Swal.fire({ icon: 'success', title: 'Dihapus', text: 'Terhapus!', timer: 1200, showConfirmButton: false })
    }
  }
}

const galleryForm = ref({ id: null, title: '', image_url: '', category: 'Kegiatan', description: '', event_date: new Date().toISOString().substring(0, 10) })
const isEditingGallery = ref(false)
const isGalleryModalOpen = ref(false)

const resetGalleryForm = () => {
  galleryForm.value = { id: null, title: '', image_url: '', category: 'Kegiatan', description: '', event_date: new Date().toISOString().substring(0, 10) }
  isEditingGallery.value = false
  isGalleryModalOpen.value = false
}

const editGallery = (item) => {
  galleryForm.value = { ...item }
  isEditingGallery.value = true
  isGalleryModalOpen.value = true
}

const handleSaveGallery = async () => {
  if (!galleryForm.value.title || !galleryForm.value.image_url) return
  const res = await socialStore.saveGallery(galleryForm.value)
  if (res.success) {
    resetGalleryForm()
    Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Tersimpan!', timer: 1200, showConfirmButton: false })
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
      Swal.fire({ icon: 'success', title: 'Dihapus', text: 'Terhapus!', timer: 1200, showConfirmButton: false })
    }
  }
}

const faqForm = ref({ id: null, question: '', answer: '', order_index: 1 })
const isEditingFaq = ref(false)
const isFaqModalOpen = ref(false)

const resetFaqForm = () => {
  faqForm.value = { id: null, question: '', answer: '', order_index: 1 }
  isEditingFaq.value = false
  isFaqModalOpen.value = false
}

const editFaq = (faq) => {
  faqForm.value = { ...faq }
  isEditingFaq.value = true
  isFaqModalOpen.value = true
}

const handleSaveFaq = async () => {
  if (!faqForm.value.question || !faqForm.value.answer) return
  const res = await socialStore.saveFaq(faqForm.value)
  if (res.success) {
    resetFaqForm()
    Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Tersimpan!', timer: 1200, showConfirmButton: false })
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
      Swal.fire({ icon: 'success', title: 'Dihapus', text: 'Terhapus!', timer: 1200, showConfirmButton: false })
    }
  }
}

const socialLinkForm = ref({ id: null, platform: '', url: '' })
const isEditingSocialLink = ref(false)
const isSocialLinkModalOpen = ref(false)

const resetSocialLinkForm = () => {
  socialLinkForm.value = { id: null, platform: '', url: '' }
  isEditingSocialLink.value = false
  isSocialLinkModalOpen.value = false
}

const editSocialLink = (link) => {
  socialLinkForm.value = { ...link }
  isEditingSocialLink.value = true
  isSocialLinkModalOpen.value = true
}

const handleSaveSocialLink = async () => {
  if (!socialLinkForm.value.platform || !socialLinkForm.value.url) return
  const res = await socialStore.saveSocialLink(socialLinkForm.value)
  if (res.success) {
    resetSocialLinkForm()
    Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Tersimpan!', timer: 1200, showConfirmButton: false })
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
      Swal.fire({ icon: 'success', title: 'Dihapus', text: 'Terhapus!', timer: 1200, showConfirmButton: false })
    }
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="p-1 bg-slate-200/60 rounded-2xl flex overflow-x-auto scrollbar-none gap-1">
      <button 
        v-for="tab in [
          { id: 'hero', name: 'Hero' },
          { id: 'about', name: 'Visi' },
          { id: 'brand', name: 'Tema' },
          { id: 'features', name: 'Kegiatan' },
          { id: 'gallery', name: 'Galeri' },
          { id: 'faqs', name: 'FAQ' },
          { id: 'social', name: 'Medsos' }
        ]"
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="['px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex-shrink-0 cursor-pointer', activeTab === tab.id ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500']"
      >
        {{ tab.name }}
      </button>
    </div>

    <div v-if="activeTab === 'hero'" class="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
      <div>
        <label class="block text-[8px] font-black uppercase tracking-wider text-slate-450 mb-1">Judul Hero</label>
        <input v-model="heroTitle" type="text" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800">
      </div>
      <div>
        <label class="block text-[8px] font-black uppercase tracking-wider text-slate-450 mb-1">Sub-judul Hero</label>
        <textarea v-model="heroSubtitle" rows="3" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 resize-none font-sans"></textarea>
      </div>
      <div>
        <label class="block text-[8px] font-black uppercase tracking-wider text-slate-450 mb-1">Sejarah Singkat</label>
        <textarea v-model="sejarahText" rows="5" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-850 resize-none font-sans leading-relaxed"></textarea>
      </div>
      <button @click="handleSaveHero" class="w-full py-3.5 bg-emerald-600 active:bg-emerald-700 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all">
        Simpan Hero & Sejarah
      </button>
    </div>

    <div v-if="activeTab === 'about'" class="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
      <div>
        <label class="block text-[8px] font-black uppercase tracking-wider text-slate-450 mb-1">Visi Utama</label>
        <textarea v-model="visiText" rows="3" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 resize-none font-sans"></textarea>
      </div>
      
      <div class="space-y-3">
        <label class="block text-[8px] font-black uppercase tracking-wider text-slate-450">Poin Misi</label>
        <div class="flex gap-2">
          <input v-model="newMisiInput" type="text" placeholder="Tambah misi..." class="flex-grow px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800">
          <button @click="addMisi" class="px-4 bg-emerald-600 text-white rounded-xl font-black text-xs uppercase tracking-wider">Tambah</button>
        </div>
        <div class="space-y-2 max-h-48 overflow-y-auto pr-1">
          <div v-for="(misi, idx) in misiList" :key="idx" class="p-3 bg-slate-50 border border-slate-150 rounded-xl flex justify-between items-center gap-3">
            <span class="text-xs text-slate-700 font-semibold leading-normal">{{ misi }}</span>
            <button @click="removeMisi(idx)" class="text-rose-600 font-black text-[10px] uppercase">Hapus</button>
          </div>
        </div>
      </div>

      <button @click="handleSaveAbout" class="w-full py-3.5 bg-emerald-600 active:bg-emerald-700 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all">
        Simpan Visi & Misi
      </button>
    </div>

    <div v-if="activeTab === 'brand'" class="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
      <div>
        <label class="block text-[8px] font-black uppercase tracking-wider text-slate-455 mb-1">Nama Brand</label>
        <input v-model="brandName" type="text" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800">
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-[8px] font-black uppercase tracking-wider text-slate-455 mb-1">Warna Primer</label>
          <div class="flex gap-2">
            <input v-model="primaryColor" type="color" class="w-10 h-10 bg-white border border-slate-200 rounded-xl cursor-pointer p-0.5">
            <input v-model="primaryColor" type="text" class="flex-grow min-w-0 px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700">
          </div>
        </div>
        <div>
          <label class="block text-[8px] font-black uppercase tracking-wider text-slate-455 mb-1">Warna Sekunder</label>
          <div class="flex gap-2">
            <input v-model="secondaryColor" type="color" class="w-10 h-10 bg-white border border-slate-200 rounded-xl cursor-pointer p-0.5">
            <input v-model="secondaryColor" type="text" class="flex-grow min-w-0 px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700">
          </div>
        </div>
      </div>
      <button @click="handleSaveBranding" class="w-full py-3.5 bg-emerald-600 active:bg-emerald-700 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all">
        Simpan Branding
      </button>
    </div>

    <div v-if="activeTab === 'features'" class="space-y-4">
      <button @click="isFeatureModalOpen = true" class="w-full py-4 bg-emerald-600 active:bg-emerald-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-md flex items-center justify-center gap-2">
        + Tambah Kegiatan Baru
      </button>

      <div class="space-y-3">
        <div v-for="feat in socialStore.landingFeatures" :key="feat.id" class="bg-white border border-slate-200 p-4 rounded-2xl flex flex-col justify-between shadow-xs">
          <div class="flex justify-between items-start gap-3">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-lg">
                <span>{{ feat.icon }}</span>
              </div>
              <div>
                <span class="inline-block px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[8px] font-black uppercase">{{ feat.badge }}</span>
                <h5 class="text-xs font-black text-slate-800 uppercase mt-0.5 leading-snug">{{ feat.title }}</h5>
              </div>
            </div>
            <span class="text-[8px] font-bold text-slate-400">Urutan #{{ feat.order_index }}</span>
          </div>
          <p class="text-[10px] text-slate-500 font-semibold leading-relaxed mt-2.5">{{ feat.description }}</p>
          <div class="flex justify-end gap-3 mt-3 pt-2 border-t border-slate-100">
            <button @click="editFeature(feat)" class="text-emerald-600 font-black uppercase text-[10px]">Edit</button>
            <button @click="handleDeleteFeature(feat.id)" class="text-rose-600 font-black uppercase text-[10px]">Hapus</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'gallery'" class="space-y-4">
      <button @click="isGalleryModalOpen = true" class="w-full py-4 bg-emerald-600 active:bg-emerald-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-md flex items-center justify-center gap-2">
        + Unggah Foto Dokumentasi
      </button>

      <div class="space-y-3">
        <div v-for="item in socialStore.landingGallery" :key="item.id" class="bg-white border border-slate-200 p-3 rounded-2xl flex gap-3 shadow-xs">
          <img :src="item.image_url" class="w-16 h-16 rounded-xl object-cover border border-slate-200 flex-shrink-0">
          <div class="flex-grow flex flex-col justify-between min-w-0">
            <div>
              <span class="text-[8px] font-black bg-emerald-55 text-emerald-700 px-1.5 py-0.5 rounded uppercase leading-none">{{ item.category }}</span>
              <h5 class="text-xs font-black text-slate-850 truncate mt-1 leading-snug">{{ item.title }}</h5>
            </div>
            <div class="flex justify-between items-center mt-2 border-t border-slate-100 pt-1.5">
              <span class="text-[8px] font-bold text-slate-400">{{ item.event_date }}</span>
              <div class="space-x-3">
                <button @click="editGallery(item)" class="text-emerald-600 font-black uppercase text-[10px]">Edit</button>
                <button @click="handleDeleteGallery(item.id)" class="text-rose-600 font-black uppercase text-[10px]">Hapus</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'faqs'" class="space-y-4">
      <button @click="isFaqModalOpen = true" class="w-full py-4 bg-emerald-600 active:bg-emerald-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-md flex items-center justify-center gap-2">
        + Buat FAQ Baru
      </button>

      <div class="space-y-3">
        <div v-for="faq in socialStore.landingFaqs" :key="faq.id" class="bg-white border border-slate-200 p-4 rounded-2xl space-y-2 shadow-xs">
          <div class="flex justify-between items-start gap-3">
            <div>
              <span class="text-[8px] font-black text-slate-400">FAQ #{{ faq.order_index }}</span>
              <h5 class="text-xs font-black text-slate-800 uppercase mt-0.5 leading-snug">{{ faq.question }}</h5>
            </div>
          </div>
          <p class="text-[10px] text-slate-550 font-semibold leading-relaxed">{{ faq.answer }}</p>
          <div class="flex justify-end gap-3 mt-2 pt-2 border-t border-slate-100">
            <button @click="editFaq(faq)" class="text-emerald-600 font-black uppercase text-[10px]">Edit</button>
            <button @click="handleDeleteFaq(faq.id)" class="text-rose-600 font-black uppercase text-[10px]">Hapus</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'social'" class="space-y-4">
      <button @click="isSocialLinkModalOpen = true" class="w-full py-4 bg-emerald-600 active:bg-emerald-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-md flex items-center justify-center gap-2">
        + Buat Tautan Baru
      </button>

      <div class="space-y-3">
        <div v-for="link in socialStore.landingSocialLinks" :key="link.id" class="bg-white border border-slate-200 p-4 rounded-2xl flex justify-between items-center gap-3 shadow-xs">
          <div class="min-w-0">
            <h4 class="text-xs font-black text-slate-800 uppercase leading-snug">{{ link.platform }}</h4>
            <p class="text-[9px] text-slate-400 truncate mt-0.5">{{ link.url }}</p>
          </div>
          <div class="flex gap-3.5 flex-shrink-0">
            <button @click="editSocialLink(link)" class="text-emerald-600 font-black uppercase text-[10px]">Edit</button>
            <button @click="handleDeleteSocialLink(link.id)" class="text-rose-600 font-black uppercase text-[10px]">Hapus</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isFeatureModalOpen" class="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-end justify-center">
      <div class="fixed inset-0" @click="resetFeatureForm"></div>
      <div class="bg-white w-full rounded-t-3xl p-6 space-y-4 relative z-10 shadow-2xl animate-in slide-in-from-bottom duration-300">
        <div class="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-2"></div>
        <h3 class="text-xs font-black uppercase tracking-widest text-slate-800 pb-2 border-b border-slate-100">{{ isEditingFeature ? 'Edit Kegiatan' : 'Buat Kegiatan Baru' }}</h3>
        
        <div class="space-y-4 py-2">
          <div class="grid grid-cols-3 gap-3">
            <div>
              <label class="block text-[8px] font-black uppercase tracking-wider text-slate-500 mb-1">Ikon</label>
              <select v-model="featureForm.icon" class="w-full px-2 py-2 bg-slate-50 border border-slate-250 rounded-xl text-xs font-bold text-slate-700">
                <option value="🌱">🌱 Alam</option>
                <option value="🎁">🎁 Sosial</option>
                <option value="🌙">🌙 Religi</option>
                <option value="📚">📚 Edukasi</option>
                <option value="⚽">⚽ Olahraga</option>
              </select>
            </div>
            <div class="col-span-2">
              <label class="block text-[8px] font-black uppercase tracking-wider text-slate-500 mb-1">Judul Kegiatan</label>
              <input v-model="featureForm.title" type="text" class="w-full px-3 py-2 bg-slate-50 border border-slate-250 rounded-xl text-xs text-slate-800">
            </div>
          </div>

          <div class="grid grid-cols-3 gap-3">
            <div class="col-span-2">
              <label class="block text-[8px] font-black uppercase tracking-wider text-slate-500 mb-1">Badge</label>
              <input v-model="featureForm.badge" type="text" class="w-full px-3 py-2 bg-slate-50 border border-slate-250 rounded-xl text-xs text-slate-800">
            </div>
            <div>
              <label class="block text-[8px] font-black uppercase tracking-wider text-slate-500 mb-1">Urutan</label>
              <input v-model.number="featureForm.order_index" type="number" class="w-full px-3 py-2 bg-slate-50 border border-slate-250 rounded-xl text-xs text-slate-800">
            </div>
          </div>

          <div>
            <label class="block text-[8px] font-black uppercase tracking-wider text-slate-500 mb-1">Deskripsi</label>
            <textarea v-model="featureForm.description" rows="2" class="w-full px-3 py-2 bg-slate-50 border border-slate-250 rounded-xl text-xs text-slate-800 resize-none font-sans"></textarea>
          </div>

          <button @click="handleSaveFeature" class="w-full py-3.5 bg-emerald-600 text-white rounded-xl font-black text-xs uppercase tracking-widest">Simpan</button>
        </div>
      </div>
    </div>

    <div v-if="isGalleryModalOpen" class="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-end justify-center">
      <div class="fixed inset-0" @click="resetGalleryForm"></div>
      <div class="bg-white w-full rounded-t-3xl p-6 space-y-4 relative z-10 shadow-2xl animate-in slide-in-from-bottom duration-300">
        <div class="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-2"></div>
        <h3 class="text-xs font-black uppercase tracking-widest text-slate-800 pb-2 border-b border-slate-100">{{ isEditingGallery ? 'Edit Foto' : 'Unggah Foto Baru' }}</h3>
        
        <div class="space-y-4 py-2">
          <div>
            <label class="block text-[8px] font-black uppercase tracking-wider text-slate-500 mb-1">Nama Acara</label>
            <input v-model="galleryForm.title" type="text" class="w-full px-3 py-2 bg-slate-50 border border-slate-250 rounded-xl text-xs text-slate-800">
          </div>
          <div>
            <label class="block text-[8px] font-black uppercase tracking-wider text-slate-500 mb-1">URL Gambar</label>
            <input v-model="galleryForm.image_url" type="text" class="w-full px-3 py-2 bg-slate-50 border border-slate-250 rounded-xl text-xs text-slate-800">
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-[8px] font-black uppercase tracking-wider text-slate-500 mb-1">Kategori</label>
              <input v-model="galleryForm.category" type="text" class="w-full px-3 py-2 bg-slate-50 border border-slate-250 rounded-xl text-xs text-slate-800">
            </div>
            <div>
              <label class="block text-[8px] font-black uppercase tracking-wider text-slate-500 mb-1">Tanggal</label>
              <input v-model="galleryForm.event_date" type="date" class="w-full px-3 py-2 bg-slate-50 border border-slate-250 rounded-xl text-xs text-slate-800">
            </div>
          </div>

          <div>
            <label class="block text-[8px] font-black uppercase tracking-wider text-slate-500 mb-1">Deskripsi</label>
            <textarea v-model="galleryForm.description" rows="2" class="w-full px-3 py-2 bg-slate-50 border border-slate-250 rounded-xl text-xs text-slate-800 resize-none font-sans"></textarea>
          </div>

          <button @click="handleSaveGallery" class="w-full py-3.5 bg-emerald-600 text-white rounded-xl font-black text-xs uppercase tracking-widest">Simpan</button>
        </div>
      </div>
    </div>

    <div v-if="isFaqModalOpen" class="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-end justify-center">
      <div class="fixed inset-0" @click="resetFaqForm"></div>
      <div class="bg-white w-full rounded-t-3xl p-6 space-y-4 relative z-10 shadow-2xl animate-in slide-in-from-bottom duration-300">
        <div class="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-2"></div>
        <h3 class="text-xs font-black uppercase tracking-widest text-slate-800 pb-2 border-b border-slate-100">{{ isEditingFaq ? 'Edit FAQ' : 'Buat FAQ Baru' }}</h3>
        
        <div class="space-y-4 py-2">
          <div class="grid grid-cols-4 gap-3">
            <div class="col-span-3">
              <label class="block text-[8px] font-black uppercase tracking-wider text-slate-500 mb-1">Pertanyaan</label>
              <input v-model="faqForm.question" type="text" class="w-full px-3 py-2 bg-slate-50 border border-slate-255 rounded-xl text-xs text-slate-800">
            </div>
            <div>
              <label class="block text-[8px] font-black uppercase tracking-wider text-slate-500 mb-1">Urutan</label>
              <input v-model.number="faqForm.order_index" type="number" class="w-full px-3 py-2 bg-slate-50 border border-slate-255 rounded-xl text-xs text-slate-800">
            </div>
          </div>

          <div>
            <label class="block text-[8px] font-black uppercase tracking-wider text-slate-500 mb-1">Jawaban</label>
            <textarea v-model="faqForm.answer" rows="3" class="w-full px-3 py-2 bg-slate-50 border border-slate-255 rounded-xl text-xs text-slate-800 resize-none font-sans"></textarea>
          </div>

          <button @click="handleSaveFaq" class="w-full py-3.5 bg-emerald-600 text-white rounded-xl font-black text-xs uppercase tracking-widest">Simpan</button>
        </div>
      </div>
    </div>

    <div v-if="isSocialLinkModalOpen" class="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-end justify-center">
      <div class="fixed inset-0" @click="resetSocialLinkForm"></div>
      <div class="bg-white w-full rounded-t-3xl p-6 space-y-4 relative z-10 shadow-2xl animate-in slide-in-from-bottom duration-300">
        <div class="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-2"></div>
        <h3 class="text-xs font-black uppercase tracking-widest text-slate-800 pb-2 border-b border-slate-100">{{ isEditingSocialLink ? 'Edit Medsos' : 'Buat Medsos Baru' }}</h3>
        
        <div class="space-y-4 py-2">
          <div>
            <label class="block text-[8px] font-black uppercase tracking-wider text-slate-500 mb-1">Nama Platform</label>
            <input v-model="socialLinkForm.platform" type="text" class="w-full px-3 py-2 bg-slate-50 border border-slate-250 rounded-xl text-xs text-slate-800">
          </div>
          <div>
            <label class="block text-[8px] font-black uppercase tracking-wider text-slate-500 mb-1">Tujuan URL</label>
            <input v-model="socialLinkForm.url" type="text" class="w-full px-3 py-2 bg-slate-50 border border-slate-250 rounded-xl text-xs text-slate-800">
          </div>

          <button @click="handleSaveSocialLink" class="w-full py-3.5 bg-emerald-600 text-white rounded-xl font-black text-xs uppercase tracking-widest">Simpan</button>
        </div>
      </div>
    </div>
  </div>
</template>
