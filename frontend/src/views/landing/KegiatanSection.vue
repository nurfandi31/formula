<script setup>
import { computed } from 'vue'
import { useSocialStore } from '../../stores/social'

const socialStore = useSocialStore()

const fallbackFeatures = [
  {
    title: 'Bakti Sosial Dusun',
    icon: '🎁',
    description: 'Gotong royong membersihkan makam dusun, pemeliharaan masjid Al-Fattah, serta penyaluran paket santunan berkala untuk warga.',
    badge: 'Rutin Bulanan'
  },
  {
    title: 'Semarak Ramadhan',
    icon: '🌙',
    description: 'Penyelenggaraan festival lomba anak saleh, bagi takjil gratis sore hari, kajian menjelang berbuka, serta takbir keliling dusun.',
    badge: 'Tahunan'
  },
  {
    title: 'Ngampon Cerdas',
    icon: '📚',
    description: 'Bimbingan belajar gratis mingguan untuk adik-adik dusun jenjang SD-SMP guna memicu prestasi belajar mereka.',
    badge: 'Mingguan'
  },
  {
    title: 'Seni & Kebugaran',
    icon: '⚽',
    description: 'Olahraga futsal persahabatan rutin pemuda dusun serta latihan alat musik rebana hadrah guna pelestarian budaya islam.',
    badge: 'Kreatifitas'
  }
]

const features = computed(() => {
  if (socialStore.landingFeatures && socialStore.landingFeatures.length > 0) {
    return socialStore.landingFeatures
  }
  return fallbackFeatures
})
</script>

<template>
  <section id="kegiatan" class="scroll-mt-28 relative overflow-hidden bg-white">
    <div class="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_10%_80%,rgba(16,185,129,0.03),transparent_40%)]"></div>
    <div class="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_90%_20%,rgba(59,130,246,0.03),transparent_40%)]"></div>
    <div class="absolute -bottom-10 -right-10 w-80 h-80 bg-blue-100/20 blur-[120px] rounded-full -z-10 animate-pulse"></div>
    <div class="max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-24">
      <div class="text-center max-w-3xl mx-auto mb-12 sm:mb-20 space-y-4">
        <span class="text-xs font-black uppercase tracking-[0.25em] text-emerald-600">Kegiatan Kami</span>
        <h2 class="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-tight">
          Aksi Nyata & <span class="text-transparent bg-clip-text bg-linear-to-r from-emerald-600 via-green-600 to-teal-500">Kiprah Kepemudaan</span>
        </h2>
        <p class="text-slate-500 font-medium text-base sm:text-lg leading-relaxed">
          Kami senantiasa berikhtiar menciptakan pergerakan nyata yang membawa manfaat positif secara kontinu bagi segenap warga Dusun Ngampon.
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        <div v-for="(feat, idx) in features" :key="idx" class="bg-white border border-slate-100/80 rounded-lg p-6 sm:p-8 shadow-xl shadow-slate-100 flex flex-col justify-between group hover:-translate-y-2 hover:border-emerald-500/20 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300">
          <div class="space-y-4 sm:space-y-6">
            <div :class="['w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl shadow-inner', idx === 0 ? 'bg-rose-50 text-rose-600' : idx === 1 ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600']">
              <i v-if="feat.icon && (feat.icon.startsWith('ri-') || feat.icon.includes(' '))" :class="feat.icon"></i>
              <span v-else>{{ feat.icon }}</span>
            </div>
            <div class="space-y-2 sm:space-y-3">
              <h4 class="text-base sm:text-lg font-black text-slate-900 leading-snug group-hover:text-emerald-600 transition-colors">{{ feat.title }}</h4>
              <p class="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">
                {{ feat.description }}
              </p>
            </div>
          </div>
          <span :class="['text-[10px] font-black uppercase tracking-widest mt-6 sm:mt-8 block', idx === 0 ? 'text-rose-500' : idx === 1 ? 'text-amber-500' : 'text-emerald-500']">{{ feat.badge }}</span>
        </div>
      </div>
    </div>
  </section>
</template>
