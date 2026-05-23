<script setup>
import { computed } from 'vue'
import { useSocialStore } from '../../stores/social'

const socialStore = useSocialStore()

const fallbackFeatures = [
  {
    title: 'Bakti Sosial Dusun',
    icon: '🎁',
    description: 'Gotong royong membersihkan makam dusun, pemeliharaan masjid Al-Fattah, serta penyaluran paket santunan berkala untuk warga.',
    badge: 'Rutin Bulanan',
    color: 'rose'
  },
  {
    title: 'Semarak Ramadhan',
    icon: '🌙',
    description: 'Festival lomba anak saleh, bagi takjil gratis, kajian menjelang berbuka, serta takbir keliling dusun yang meriah.',
    badge: 'Tahunan',
    color: 'amber'
  },
  {
    title: 'Ngampon Cerdas',
    icon: '📚',
    description: 'Bimbingan belajar gratis mingguan untuk adik-adip dusun jenjang SD-SMP guna memicu prestasi belajar mereka.',
    badge: 'Mingguan',
    color: 'emerald'
  },
  {
    title: 'Seni & Kebugaran',
    icon: '⚽',
    description: 'Futsal persahabatan rutin pemuda dusun serta latihan rebana hadrah guna pelestarian budaya islam.',
    badge: 'Kreatifitas',
    color: 'blue'
  }
]

const features = computed(() => {
  if (socialStore.landingFeatures && socialStore.landingFeatures.length > 0) {
    return socialStore.landingFeatures.map((f, i) => ({
      ...f,
      color: ['rose', 'amber', 'emerald', 'blue'][i % 4]
    }))
  }
  return fallbackFeatures
})

const colorMap = {
  rose:    { bg: 'bg-rose-50',    text: 'text-rose-600',    badge: 'bg-rose-50 text-rose-600',    border: 'border-rose-200/50',    glow: 'shadow-rose-500/10' },
  amber:   { bg: 'bg-amber-50',   text: 'text-amber-600',   badge: 'bg-amber-50 text-amber-600',   border: 'border-amber-200/50',   glow: 'shadow-amber-500/10' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', badge: 'bg-emerald-50 text-emerald-600', border: 'border-emerald-200/50', glow: 'shadow-emerald-500/10' },
  blue:    { bg: 'bg-blue-50',    text: 'text-blue-600',    badge: 'bg-blue-50 text-blue-600',    border: 'border-blue-200/50',    glow: 'shadow-blue-500/10' }
}
</script>

<template>
  <section id="kegiatan" class="scroll-mt-24 relative overflow-hidden bg-white">
    <div class="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_10%_80%,rgba(16,185,129,0.04),transparent_40%)]"></div>
    <div class="absolute -bottom-16 -right-16 w-72 h-72 bg-blue-100/20 blur-[100px] rounded-full -z-10"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">

      <div class="text-center max-w-3xl mx-auto mb-12 sm:mb-16 lg:mb-20 space-y-4">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 border border-emerald-200/60 rounded-full mb-2">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span class="text-[10px] sm:text-xs font-black text-emerald-600 uppercase tracking-[0.2em]">Kegiatan Kami</span>
        </div>
        <h2 class="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-tight">
          Aksi Nyata &
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500">Kiprah Kepemudaan</span>
        </h2>
        <p class="text-slate-500 font-medium text-sm sm:text-base lg:text-lg leading-relaxed">
          Kami senantiasa berikhtiar menciptakan pergerakan nyata yang membawa manfaat positif secara kontinu bagi segenap warga Dusun Ngampon.
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
        <div
          v-for="(feat, idx) in features"
          :key="idx"
          class="group relative bg-white border border-slate-100 rounded-2xl sm:rounded-3xl p-6 sm:p-7 shadow-lg shadow-slate-100/80 flex flex-col gap-5 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
          :class="[`hover:border-${colorMap[feat.color || 'emerald'].border}`, `hover:${colorMap[feat.color || 'emerald'].glow}`]"
        >
          <div :class="['w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shadow-inner flex-shrink-0', colorMap[feat.color || 'emerald'].bg]">
            <i v-if="feat.icon && (feat.icon.startsWith('ri-') || feat.icon.includes(' '))" :class="feat.icon"></i>
            <span v-else>{{ feat.icon }}</span>
          </div>

          <div class="flex-grow space-y-2">
            <h4 class="text-base sm:text-lg font-black text-slate-900 leading-snug group-hover:text-emerald-600 transition-colors">{{ feat.title }}</h4>
            <p class="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">{{ feat.description }}</p>
          </div>

          <div class="pt-2 border-t border-slate-100">
            <span :class="['inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full', colorMap[feat.color || 'emerald'].badge]">
              <span class="w-1.5 h-1.5 rounded-full bg-current opacity-60"></span>
              {{ feat.badge }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
