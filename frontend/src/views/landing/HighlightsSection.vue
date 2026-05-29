<script setup>
import { computed } from 'vue'
import { useSocialStore } from '../../stores/social'

const socialStore = useSocialStore()

const defaultItems = [
  {
    icon: '💰',
    title: 'Transparansi Kas',
    desc: 'Laporan keuangan kas masuk dan keluar di-update secara real-time demi menjaga keterbukaan.'
  },
  {
    icon: '📱',
    title: 'Presensi QR & PIN',
    desc: 'Kemudahan melakukan absensi rapat mandiri secara digital tanpa antrean kertas.'
  },
  {
    icon: '🤝',
    title: 'Kolaborasi Positif',
    desc: 'Wadah berkumpulnya pemuda Ngampon untuk menggagas aksi kemanusiaan dan bakti sosial.'
  }
]

const highlightsData = computed(() => {
  const sec = socialStore.landingSections?.find(s => s.key === 'highlights')
  if (sec && sec.content) {
    let c = sec.content
    if (typeof c === 'string') { try { c = JSON.parse(c) } catch (e) { c = {} } }
    return {
      sectionTitle: c.section_title || 'Aksi Nyata & Kiprah Kepemudaan',
      sectionSubtitle: c.section_subtitle || 'Kami senantiasa berikhtiar menciptakan pergerakan nyata yang membawa manfaat positif secara kontinu bagi segenap warga Dusun Ngampon.',
      items: (c.items && c.items.length > 0) ? c.items : defaultItems
    }
  }
  return {
    sectionTitle: 'Aksi Nyata & Kiprah Kepemudaan',
    sectionSubtitle: 'Kami senantiasa berikhtiar menciptakan pergerakan nyata yang membawa manfaat positif secara kontinu bagi segenap warga Dusun Ngampon.',
    items: defaultItems
  }
})
</script>

<template>
  <section id="highlights" class="scroll-mt-24 relative overflow-hidden bg-gradient-to-b from-slate-950 via-emerald-950 to-slate-950">
    <div class="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,rgba(16,185,129,0.12),transparent_50%)]"></div>
    <div class="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom_right,rgba(5,150,105,0.10),transparent_50%)]"></div>
    <div class="absolute inset-0 opacity-[0.025]" style="background-image: radial-gradient(circle, #fff 1px, transparent 1px); background-size: 28px 28px;"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">

      <div class="text-center max-w-3xl mx-auto mb-12 sm:mb-16 lg:mb-20 space-y-4">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/15 border border-emerald-500/25 rounded-full mb-2">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span class="text-[10px] sm:text-xs font-black text-emerald-400 uppercase tracking-[0.2em]">Platform Digital</span>
        </div>
        <h2 class="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
          {{ highlightsData.sectionTitle }}
        </h2>
        <p class="text-white/55 font-medium text-sm sm:text-base lg:text-lg leading-relaxed">
          {{ highlightsData.sectionSubtitle }}
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
        <div
          v-for="(item, idx) in highlightsData.items"
          :key="idx"
          class="group relative bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl p-7 sm:p-8 flex flex-col gap-5 hover:bg-white/8 hover:border-emerald-500/30 hover:-translate-y-1.5 transition-all duration-300 backdrop-blur-sm overflow-hidden"
        >
          <!-- glow accent -->
          <div class="absolute -top-8 -right-8 w-28 h-28 bg-emerald-500/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          <div class="w-14 h-14 bg-gradient-to-br from-emerald-500/20 to-green-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 group-hover:border-emerald-500/40 transition-colors">
            <i v-if="item.icon && (item.icon.startsWith('ri-') || item.icon.startsWith('fa'))" :class="['text-emerald-400 text-xl', item.icon]"></i>
            <span v-else>{{ item.icon }}</span>
          </div>

          <div class="flex-grow space-y-2.5 relative z-10">
            <h4 class="text-base sm:text-lg font-black text-white group-hover:text-emerald-300 transition-colors leading-snug">
              {{ item.title }}
            </h4>
            <p class="text-xs sm:text-sm text-white/50 font-medium leading-relaxed group-hover:text-white/65 transition-colors">
              {{ item.desc }}
            </p>
          </div>

          <div class="pt-3 border-t border-white/10 relative z-10">
            <span class="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-400/70 group-hover:text-emerald-400 transition-colors">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500/60"></span>
              Fitur Aktif
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
