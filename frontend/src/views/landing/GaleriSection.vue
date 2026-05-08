<script setup>
import { ref } from 'vue'

const emit = defineEmits(['openGallery'])

const galleryItems = ref([
  {
    id: 1,
    title: 'Rapat Persiapan Kepengurusan FORMULA Ngampon',
    category: 'Diskusi Pemuda',
    image: '/formula_youth_landing_hero_1777344117635.png',
    date: '12 Maret 2026',
    author: 'Andi Pratama',
    description: 'Rapat pleno pengurus harian FORMULA dalam merencanakan program kerja strategis satu tahun ke depan. Membahas penugasan divisi, manajemen anggaran operasional, serta kalender aksi sosial Ramadhan dan kemanusiaan. Acara dihadiri oleh seluruh koordinator bidang dengan penuh semangat.',
    location: 'Sekretariat Dusun Ngampon',
    tags: ['Rapat Kerja', 'FORMULA 18', 'Pemuda Ngampon']
  },
  {
    id: 2,
    title: 'Suasana Pagi nan Asri dan Rukun di Dusun Ngampon',
    category: 'Dusun Cinta',
    image: '/ngampon_village_vibes_1777344139732.png',
    date: '08 Maret 2026',
    author: 'Siti Aminah',
    description: 'Keindahan alam, asri, rimbun, rukun, dan harmonisnya kehidupan sosial warga Dusun Ngampon di pagi hari. Menjadi representasi nyata atas nilai gotong royong dan kedamaian lingkungan dusun yang senantiasa dijaga kelestariannya oleh generasi muda.',
    location: 'Dusun Ngampon, RT 02',
    tags: ['Pemandangan', 'Kearifan Lokal', 'Guyub Rukun']
  },
  {
    id: 3,
    title: 'Bakti Kemanusiaan Menyapa Keluarga Prasejahtera',
    category: 'Gotong Royong',
    image: '/member_portrait_1_1777344189794.png',
    date: '01 Maret 2026',
    author: 'Rizky Ramadhan',
    description: 'Aksi nyata penyaluran bantuan paket sembako untuk warga lansia dan keluarga prasejahtera yang membutuhkan di sekitar lingkungan Dusun Ngampon. Kegiatan ini didanai penuh oleh kas swadaya pemuda serta sumbangan sukarela dari para donatur setia.',
    location: 'Dusun Ngampon Wilayah Barat',
    tags: ['Sosial', 'Bantuan Warga', 'Bakti Sosial']
  }
])
</script>

<template>
  <section id="galeri" class="scroll-mt-28 relative overflow-hidden bg-linear-to-b from-white via-emerald-50/10 to-white">
    <div class="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.04),transparent_50%)]"></div>
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-100/20 blur-[130px] rounded-full -z-10"></div>
    <div class="max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-24">
      <div class="text-center max-w-3xl mx-auto mb-12 sm:mb-20 space-y-4">
        <span class="text-xs font-black uppercase tracking-[0.25em] text-emerald-600">Galeri Kami</span>
        <h2 class="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-tight">
          Lensa Kegiatan & <span class="text-transparent bg-clip-text bg-linear-to-r from-emerald-600 via-green-600 to-teal-500">Dokumentasi</span>
        </h2>
        <p class="text-slate-500 font-medium text-base sm:text-lg leading-relaxed">
          Rekaman visual kebersamaan, senyum kegembiraan, gotong royong, serta pengabdian tulus pemuda-pemudi di Dusun Ngampon.
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
        <div v-for="item in galleryItems" :key="item.id" 
             @click="emit('openGallery', item)"
             class="group relative overflow-hidden rounded-[1.75rem] sm:rounded-[2.5rem] aspect-video md:aspect-[4/5] bg-slate-50 shadow-2xl shadow-emerald-500/25 cursor-pointer">
          <img :src="item.image" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" :alt="item.title">
          <div class="absolute inset-0 bg-emerald-950/80 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 sm:p-8">
            <span class="text-xs text-emerald-300 font-black uppercase tracking-widest mb-1">{{ item.category }}</span>
            <h4 class="text-base sm:text-lg font-black text-white leading-snug">{{ item.title }}</h4>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
