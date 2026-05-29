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

const aboutDescText = ref('')
const semboyanText = ref('')
const valuesList = ref([])
const newValueEmoji = ref('🌱')
const newValueTitle = ref('')
const newValueDesc = ref('')

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
    aboutDescText.value = parsed.about_desc || ''
    semboyanText.value = parsed.semboyan || ''
    valuesList.value = parsed.values || []
  } else {
    aboutDescText.value = 'FORMULA (Forum Muda Mudi Islam Ngampon) adalah organisasi kepemudaan aktif di bidang sosial, religius, edukasi, dan kreatif untuk melahirkan pemuda yang tangguh dan berakhlak.'
    semboyanText.value = 'Muda, Beriman, Berprestasi — Bersama Membangun Dusun yang Lebih Baik.'
    visiText.value = 'Terwujudnya pemuda Ngampon yang unggul, agamis, kolaboratif, dan berdampak sosial nyata.'
    misiList.value = [
      'Membina keimanan dan kreativitas pemuda secara berkesinambungan.',
      'Menyelenggarakan bakti sosial kemasyarakatan yang swadaya.',
      'Mengembangkan transparansi keuangan dan kolaborasi organisasi.'
    ]
    valuesList.value = [
      { emoji: '🌱', title: 'Muda', desc: 'Bersemangat, energik, berani mengambil langkah kreatif, serta tangguh menghadapi tantangan.' },
      { emoji: '🕌', title: 'Beriman', desc: 'Mendasarkan segala perbuatan dan kegiatan pada ajaran suci agama Islam.' },
      { emoji: '🏆', title: 'Berprestasi', desc: 'Berkomitmen melahirkan prestasi serta mendatangkan kegunaan konkret bagi dusun.' },
      { emoji: '🤝', title: 'Sinergitas', desc: 'Melangkah beriringan bersama masyarakat, pengurus RT, serta sesepuh dusun.' }
    ]
  }

  brandName.value = socialStore.landingSettings?.find(s => s.key === 'brand_name')?.value || 'FORMULA'
  primaryColor.value = socialStore.landingSettings?.find(s => s.key === 'primary_color')?.value || '#10b981'
  secondaryColor.value = socialStore.landingSettings?.find(s => s.key === 'secondary_color')?.value || '#047857'

  const highlightSec = socialStore.landingSections?.find(s => s.key === 'highlights')
  if (highlightSec && highlightSec.content) {
    let hc = highlightSec.content
    if (typeof hc === 'string') { try { hc = JSON.parse(hc) } catch (e) { hc = {} } }
    highlightTitle.value = hc.section_title || 'Aksi Nyata & Kiprah Kepemudaan'
    highlightSubtitle.value = hc.section_subtitle || ''
    highlightItems.value = hc.items || defaultHighlightItems()
  } else {
    highlightTitle.value = 'Aksi Nyata & Kiprah Kepemudaan'
    highlightSubtitle.value = 'Kami senantiasa berikhtiar menciptakan pergerakan nyata yang membawa manfaat positif secara kontinu bagi segenap warga Dusun Ngampon.'
    highlightItems.value = defaultHighlightItems()
  }
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

const addValue = () => {
  if (newValueTitle.value.trim() && newValueDesc.value.trim()) {
    valuesList.value.push({
      emoji: newValueEmoji.value,
      title: newValueTitle.value.trim(),
      desc: newValueDesc.value.trim()
    })
    newValueEmoji.value = '🌱'
    newValueTitle.value = ''
    newValueDesc.value = ''
  }
}

const removeValue = (index) => {
  valuesList.value.splice(index, 1)
}

// --- Highlights Section ---
const defaultHighlightItems = () => [
  { icon: '💰', title: 'Transparansi Kas', desc: 'Laporan keuangan kas masuk dan keluar di-update secara real-time demi menjaga keterbukaan.' },
  { icon: '📱', title: 'Presensi QR & PIN', desc: 'Kemudahan melakukan absensi rapat mandiri secara digital tanpa antrean kertas.' },
  { icon: '🤝', title: 'Kolaborasi Positif', desc: 'Wadah berkumpulnya pemuda Ngampon untuk menggagas aksi kemanusiaan dan bakti sosial.' }
]

const highlightTitle = ref('')
const highlightSubtitle = ref('')
const highlightItems = ref([])
const newHlIcon = ref('✨')
const newHlTitle = ref('')
const newHlDesc = ref('')

const addHighlightItem = () => {
  if (newHlTitle.value.trim() && newHlDesc.value.trim()) {
    highlightItems.value.push({
      icon: newHlIcon.value || '✨',
      title: newHlTitle.value.trim(),
      desc: newHlDesc.value.trim()
    })
    newHlIcon.value = '✨'
    newHlTitle.value = ''
    newHlDesc.value = ''
  }
}

const removeHighlightItem = (index) => {
  highlightItems.value.splice(index, 1)
}

const handleSaveHighlights = async () => {
  const payload = {
    section_title: highlightTitle.value.trim(),
    section_subtitle: highlightSubtitle.value.trim(),
    items: highlightItems.value
  }
  const res = await socialStore.saveSection('highlights', payload)
  if (res.success) {
    Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Highlights disimpan!', timer: 1500, showConfirmButton: false })
  }
}

const handleSaveAbout = async () => {
  const payload = {
    about_desc: aboutDescText.value.trim(),
    visi: visiText.value.trim(),
    misi: misiList.value,
    semboyan: semboyanText.value.trim(),
    values: valuesList.value
  }
  const res = await socialStore.saveSection('about', payload)
  if (res.success) {
    Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Visi, Misi & Nilai Perjuangan disimpan!', timer: 1500, showConfirmButton: false })
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

const generationForm = ref({ id: null, num: 1, year: '', leader: '', secretary: '', treasurer: '', active_members_raw: '', story: '' })
const isEditingGeneration = ref(false)

const resetGenerationForm = () => {
  const nextNum = socialStore.landingGenerations && socialStore.landingGenerations.length > 0 
    ? Math.max(...socialStore.landingGenerations.map(g => g.num)) + 1 
    : 1
  generationForm.value = { id: null, num: nextNum, year: '', leader: '', secretary: '', treasurer: '', active_members_raw: '', story: '' }
  isEditingGeneration.value = false
}

const editGeneration = (gen) => {
  generationForm.value = {
    id: gen.id,
    num: gen.num,
    year: gen.year,
    leader: gen.leader,
    secretary: gen.secretary,
    treasurer: gen.treasurer,
    active_members_raw: Array.isArray(gen.active_members) ? gen.active_members.join(', ') : '',
    story: gen.story
  }
  isEditingGeneration.value = true
}

const handleSaveGeneration = async () => {
  if (!generationForm.value.num || !generationForm.value.year || !generationForm.value.leader || !generationForm.value.story) return

  const activeMembersArr = generationForm.value.active_members_raw
    ? generationForm.value.active_members_raw.split(',').map(m => m.trim()).filter(m => m.length > 0)
    : []

  const payload = {
    id: generationForm.value.id,
    num: parseInt(generationForm.value.num),
    year: generationForm.value.year.toString().trim(),
    leader: generationForm.value.leader.trim(),
    secretary: generationForm.value.secretary.trim(),
    treasurer: generationForm.value.treasurer.trim(),
    active_members: activeMembersArr,
    story: generationForm.value.story.trim()
  }

  const res = await socialStore.saveGeneration(payload)
  if (res.success) {
    resetGenerationForm()
    Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Data Generasi disimpan!', timer: 1500, showConfirmButton: false })
  } else {
    Swal.fire({ icon: 'error', title: 'Gagal', text: 'Nomor Generasi sudah ada atau data tidak valid!' })
  }
}

const handleDeleteGeneration = async (id) => {
  const confirm = await Swal.fire({
    title: 'Hapus Data Generasi?',
    text: 'Aksi ini tidak bisa dibatalkan!',
    icon: 'warning',
    showCancelButton: true
  })
  if (confirm.isConfirmed) {
    const res = await socialStore.deleteGeneration(id)
    if (res.success) {
      Swal.fire({ icon: 'success', title: 'Dihapus', text: 'Generasi dihapus!', timer: 1500, showConfirmButton: false })
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
            { id: 'social', name: 'Tautan Medsos', emoji: '🔗' },
            { id: 'highlights', name: 'Highlight Fitur', emoji: '⚡' },
            { id: 'generations', name: 'Rekam Jejak Generasi', emoji: '👥' }
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

      <div v-if="activeTab === 'generations'" class="space-y-6">
        <div class="border-b border-slate-150 pb-4 flex justify-between items-center">
          <h3 class="text-xs font-black uppercase tracking-widest text-slate-800">Kelola Rekam Jejak 10 Generasi</h3>
          <button v-if="isEditingGeneration" @click="resetGenerationForm" class="px-4 py-2 border border-slate-200 text-slate-550 rounded-xl font-black text-[10px] uppercase tracking-wider">Batal Edit</button>
        </div>

        <div class="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-4 shadow-2xs">
          <div class="grid grid-cols-4 gap-4">
            <div>
              <label class="block text-[9px] font-black uppercase tracking-wider text-slate-500 mb-1.5">No. Generasi</label>
              <input v-model.number="generationForm.num" type="number" class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-md text-xs font-bold focus:outline-none">
            </div>
            <div>
              <label class="block text-[9px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Tahun Bakti</label>
              <input v-model="generationForm.year" type="text" class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-md text-xs font-bold focus:outline-none" placeholder="2026">
            </div>
            <div class="col-span-2">
              <label class="block text-[9px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Ketua Generasi</label>
              <input v-model="generationForm.leader" type="text" class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-md text-xs font-bold focus:outline-none" placeholder="Nama Ketua">
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[9px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Sekretaris</label>
              <input v-model="generationForm.secretary" type="text" class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-md text-xs font-bold focus:outline-none" placeholder="Nama Sekretaris">
            </div>
            <div>
              <label class="block text-[9px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Bendahara</label>
              <input v-model="generationForm.treasurer" type="text" class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-md text-xs font-bold focus:outline-none" placeholder="Nama Bendahara">
            </div>
          </div>

          <div>
            <label class="block text-[9px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Anggota Aktif (Pisahkan dengan koma)</label>
            <input v-model="generationForm.active_members_raw" type="text" class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-md text-xs font-medium focus:outline-none" placeholder="Contoh: Bambang, Lilis, Indah">
          </div>

          <div>
            <label class="block text-[9px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Sejarah Singkat / Kisah Sukses Generasi</label>
            <textarea v-model="generationForm.story" rows="3" class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-md text-xs font-medium resize-none" placeholder="Tuliskan pencapaian penting generasi ini..."></textarea>
          </div>

          <div class="flex justify-end gap-3">
            <button v-if="isEditingGeneration" @click="resetGenerationForm" class="px-6 py-3 border border-slate-200 text-slate-600 rounded-md font-black text-[10px] uppercase tracking-widest cursor-pointer active:scale-95">Batal</button>
            <button @click="handleSaveGeneration" class="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-black text-[10px] uppercase tracking-widest cursor-pointer active:scale-95">
              {{ isEditingGeneration ? 'Simpan Edit' : 'Tambah Generasi' }}
            </button>
          </div>
        </div>

        <div class="overflow-x-auto border border-slate-200 bg-white rounded-2xl shadow-2xs">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50 border-b border-slate-200 text-slate-500 text-[9px] font-black uppercase tracking-widest">
                <th class="p-4 w-16 text-center">Gen</th>
                <th class="p-4 w-24">Tahun</th>
                <th class="p-4">Struktur Inti</th>
                <th class="p-4">Anggota Aktif</th>
                <th class="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-150 text-xs font-bold text-slate-700">
              <tr v-if="!socialStore.landingGenerations || socialStore.landingGenerations.length === 0">
                <td colspan="5" class="p-8 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Belum ada data generasi di database. Halaman Beranda menggunakan fallback data default.
                </td>
              </tr>
              <tr v-for="gen in socialStore.landingGenerations" :key="gen.id" class="hover:bg-slate-50/50 transition-colors">
                <td class="p-4 text-center text-emerald-600 font-black">G-{{ gen.num }}</td>
                <td class="p-4 font-black">{{ gen.year }}</td>
                <td class="p-4 space-y-1">
                  <div><span class="text-[9px] font-black text-slate-400 uppercase">Ketua:</span> {{ gen.leader }}</div>
                  <div><span class="text-[9px] font-black text-slate-400 uppercase">Sekretaris:</span> {{ gen.secretary }}</div>
                  <div><span class="text-[9px] font-black text-slate-400 uppercase">Bendahara:</span> {{ gen.treasurer }}</div>
                </td>
                <td class="p-4">
                  <div class="flex flex-wrap gap-1 max-w-md">
                    <span v-for="m in gen.active_members" :key="m" class="px-2 py-0.5 bg-slate-100 text-slate-600 text-[8px] font-black uppercase rounded">
                      {{ m }}
                    </span>
                  </div>
                </td>
                <td class="p-4 text-center space-x-3.5">
                  <button @click="editGeneration(gen)" class="text-emerald-600 hover:text-emerald-700 font-black uppercase text-[10px] cursor-pointer">Edit</button>
                  <button @click="handleDeleteGeneration(gen.id)" class="text-rose-600 hover:text-rose-700 font-black uppercase text-[10px] cursor-pointer">Hapus</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="activeTab === 'highlights'" class="space-y-6">
        <div class="border-b border-slate-150 pb-4">
          <h3 class="text-xs font-black uppercase tracking-widest text-slate-800">Kelola Seksi Highlight Fitur Platform</h3>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Judul Seksi</label>
            <input v-model="highlightTitle" type="text" class="w-full px-4 py-3 bg-white border border-slate-200 rounded-md text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500" placeholder="Aksi Nyata & Kiprah Kepemudaan">
          </div>
          <div>
            <label class="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Sub-judul Seksi</label>
            <textarea v-model="highlightSubtitle" rows="2" class="w-full px-4 py-3 bg-white border border-slate-200 rounded-md text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none" placeholder="Deskripsi singkat bagian ini..."></textarea>
          </div>
        </div>

        <div class="space-y-3">
          <label class="block text-[10px] font-black uppercase tracking-wider text-slate-500">Kartu Highlight (tambah / hapus)</label>
          <div class="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-3">
            <div class="grid grid-cols-4 gap-3">
              <div>
                <label class="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1">Emoji/Ikon</label>
                <input v-model="newHlIcon" type="text" maxlength="4" class="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-md text-sm font-bold text-center focus:outline-none" placeholder="💰">
              </div>
              <div class="col-span-3">
                <label class="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1">Judul Fitur</label>
                <input v-model="newHlTitle" type="text" class="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-md text-xs font-bold focus:outline-none" placeholder="Transparansi Kas">
              </div>
            </div>
            <div class="flex gap-2">
              <input v-model="newHlDesc" type="text" @keyup.enter="addHighlightItem" class="flex-1 px-3 py-2.5 bg-white border border-slate-200 rounded-md text-xs font-medium focus:outline-none" placeholder="Deskripsi fitur highlight ini...">
              <button @click="addHighlightItem" class="px-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-black text-[10px] uppercase tracking-widest cursor-pointer active:scale-95">Tambah</button>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div v-if="highlightItems.length === 0" class="sm:col-span-3 p-6 text-center text-xs font-bold text-slate-400 uppercase tracking-wider border border-dashed border-slate-200 rounded-2xl">
              Belum ada kartu highlight. Tambahkan di atas.
            </div>
            <div v-for="(item, idx) in highlightItems" :key="idx" class="bg-white border border-slate-200 p-5 rounded-2xl flex flex-col gap-3 group hover:border-emerald-200 transition-colors">
              <div class="flex items-start justify-between">
                <span class="text-2xl">{{ item.icon }}</span>
                <button @click="removeHighlightItem(idx)" class="text-rose-500 hover:text-rose-600 font-black text-[10px] uppercase tracking-wider cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">Hapus</button>
              </div>
              <div>
                <h5 class="text-xs font-black text-slate-800 uppercase">{{ item.title }}</h5>
                <p class="text-[10px] text-slate-500 font-medium leading-relaxed mt-1">{{ item.desc }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end pt-4">
          <button @click="handleSaveHighlights" class="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-black text-xs uppercase tracking-widest transition-all cursor-pointer shadow-md active:scale-95">
            Simpan Highlights
          </button>
        </div>
      </div>

    </div>
  </div>
</template>
