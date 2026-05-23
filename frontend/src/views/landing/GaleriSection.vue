<script setup>
import { computed } from 'vue'
import { useSocialStore } from '../../stores/social'

const emit = defineEmits(['openGallery'])
const socialStore = useSocialStore()

const fallbackGallery = [
  {
    id: 1,
    title: 'Rapat Persiapan Kepengurusan FORMULA',
    category: 'Diskusi Pemuda',
    image: '/formula_youth_landing_hero_1777344117635.png',
    date: '12 Maret 2026',
    author: 'Andi Pratama',
    description: 'Rapat pleno pengurus harian FORMULA dalam merencanakan program kerja strategis satu tahun ke depan.',
    location: 'Sekretariat Dusun Ngampon',
    tags: ['Rapat Kerja', 'FORMULA 18', 'Pemuda Ngampon']
  },
  {
    id: 2,
    title: 'Suasana Asri Dusun Ngampon',
    category: 'Dusun Cinta',
    image: '/ngampon_village_vibes_1777344139732.png',
    date: '08 Maret 2026',
    author: 'Siti Aminah',
    description: 'Keindahan alam, asri, rimbun, dan harmonisnya kehidupan sosial warga Dusun Ngampon di pagi hari.',
    location: 'Dusun Ngampon, RT 02',
    tags: ['Pemandangan', 'Kearifan Lokal', 'Guyub Rukun']
  },
  {
    id: 3,
    title: 'Bakti Kemanusiaan Prasejahtera',
    category: 'Gotong Royong',
    image: '/member_portrait_1_1777344189794.png',
    date: '01 Maret 2026',
    author: 'Rizky Ramadhan',
    description: 'Penyaluran bantuan paket sembako untuk warga lansia dan keluarga prasejahtera di sekitar Dusun Ngampon.',
    location: 'Dusun Ngampon Wilayah Barat',
    tags: ['Sosial', 'Bantuan Warga', 'Bakti Sosial']
  }
]

const galleryItems = computed(() => {
  if (socialStore.landingGallery && socialStore.landingGallery.length > 0) {
    return socialStore.landingGallery.map(item => ({
      id: item.id,
      title: item.title,
      category: item.category || 'Kegiatan',
      image: item.image_url,
      date: item.event_date || 'Mei 2026',
      author: 'Pengurus FORMULA',
      description: item.description || item.title,
      location: 'Dusun Ngampon',
      tags: [item.category || 'Kegiatan', 'Aksi Sosial']
    }))
  }
  return fallbackGallery
})
</script>

<template>
  <section id="galeri" class="scroll-mt-24 relative overflow-hidden bg-gradient-to-b from-white via-emerald-50/10 to-white">
    <div class="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.04),transparent_50%)]"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">

      <div class="text-center max-w-3xl mx-auto mb-12 sm:mb-16 lg:mb-20 space-y-4">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 border border-emerald-200/60 rounded-full mb-2">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span class="text-[10px] sm:text-xs font-black text-emerald-600 uppercase tracking-[0.2em]">Galeri Kami</span>
        </div>
        <h2 class="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-tight">
          Lensa Kegiatan &
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500">Dokumentasi</span>
        </h2>
        <p class="text-slate-500 font-medium text-sm sm:text-base lg:text-lg leading-relaxed">
          Rekaman visual kebersamaan, senyum kegembiraan, gotong royong, serta pengabdian tulus pemuda-pemudi di Dusun Ngampon.
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        <div
          v-for="item in galleryItems"
          :key="item.id"
          @click="emit('openGallery', item)"
          class="group relative overflow-hidden rounded-2xl sm:rounded-3xl bg-slate-100 shadow-xl shadow-slate-200/60 cursor-pointer"
          style="aspect-ratio: 4/5;"
        >
          <img
            :src="item.image"
            :alt="item.title"
            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          >

          <div class="absolute top-4 left-4 z-10">
            <span class="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-emerald-700 text-[10px] sm:text-xs font-black uppercase tracking-wider rounded-xl shadow-sm">
              {{ item.category }}
            </span>
          </div>

          <div class="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-400 flex flex-col justify-end p-5 sm:p-6">
            <div class="translate-y-4 group-hover:translate-y-0 transition-transform duration-400">
              <h4 class="text-sm sm:text-base font-black text-white leading-snug mb-1">{{ item.title }}</h4>
              <div class="flex items-center gap-2 text-emerald-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                <span class="text-[10px] sm:text-xs font-black uppercase tracking-wide">{{ item.date }}</span>
              </div>
            </div>
          </div>

          <div class="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
          <div class="absolute bottom-4 left-4 right-4">
            <p class="text-[10px] font-black text-white/80 uppercase tracking-wider group-hover:opacity-0 transition-opacity">{{ item.title }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
