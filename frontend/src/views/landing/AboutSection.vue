<script setup>
import { computed } from 'vue'
import { useSocialStore } from '../../stores/social'

const socialStore = useSocialStore()

const aboutData = computed(() => {
  const aboutSection = socialStore.landingSections.find(s => s.key === 'about')
  if (aboutSection && aboutSection.content) {
    return {
      visi: aboutSection.content.visi || 'Mewujudkan generasi muda Dusun Ngampon yang berkarakter islami, berintegritas tinggi, kreatif, inovatif, dan berdaya saing secara global demi kemaslahatan bersama.',
      misi: aboutSection.content.misi || [
        'Membina kepribadian yang mulia, religius, dan berakhlakul karimah lewat kajian serta kepanitiaan hari besar Islam.',
        'Mendorong peningkatan skill pemuda di bidang teknologi informasi, seni, kebudayaan, serta minat kewirausahaan dusun.',
        'Menumbuhkan kepekaan sosial serta kebersamaan melalui bakti kemanusiaan rutin demi melayani sesama warga dusun.'
      ]
    }
  }
  return {
    visi: 'Mewujudkan generasi muda Dusun Ngampon yang berkarakter islami, berintegritas tinggi, kreatif, inovatif, dan berdaya saing secara global demi kemaslahatan bersama.',
    misi: [
      'Membina kepribadian yang mulia, religius, dan berakhlakul karimah lewat kajian serta kepanitiaan hari besar Islam.',
      'Mendorong peningkatan skill pemuda di bidang teknologi informasi, seni, kebudayaan, serta minat kewirausahaan dusun.',
      'Menumbuhkan kepekaan sosial serta kebersamaan melalui bakti kemanusiaan rutin demi melayani sesama warga dusun.'
    ]
  }
})

const values = [
  { emoji: '🌱', title: 'Muda', desc: 'Bersemangat, energik, berani mengambil langkah kreatif, serta tangguh menghadapi tantangan.' },
  { emoji: '🕌', title: 'Beriman', desc: 'Mendasarkan segala perbuatan dan kegiatan pada ajaran suci agama Islam.' },
  { emoji: '🏆', title: 'Berprestasi', desc: 'Berkomitmen melahirkan prestasi serta mendatangkan kegunaan konkret bagi dusun.' },
  { emoji: '🤝', title: 'Sinergitas', desc: 'Melangkah beriringan bersama masyarakat, pengurus RT, serta sesepuh dusun.' }
]
</script>

<template>
  <section id="about" class="scroll-mt-24 relative overflow-hidden bg-gradient-to-b from-white via-emerald-50/20 to-white">
    <div class="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.06),transparent_40%)]"></div>
    <div class="absolute -top-16 -left-16 w-64 h-64 sm:w-80 sm:h-80 bg-emerald-100/30 blur-[100px] rounded-full -z-10"></div>
    <div class="absolute bottom-0 right-0 w-64 h-64 bg-teal-100/20 blur-[80px] rounded-full -z-10"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">

      <div class="text-center max-w-3xl mx-auto mb-12 sm:mb-16 lg:mb-20 space-y-4">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 border border-emerald-200/60 rounded-full mb-2">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span class="text-[10px] sm:text-xs font-black text-emerald-600 uppercase tracking-[0.2em]">Tentang Kami</span>
        </div>
        <h2 class="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-tight">
          Menyatukan Potensi,<br>
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500">Membangun Ngampon</span>
        </h2>
        <p class="text-slate-500 font-medium text-sm sm:text-base lg:text-lg leading-relaxed">
          FORMULA (Forum Muda Mudi Islam Ngampon) adalah organisasi kepemudaan aktif di bidang sosial, religius, edukasi, dan kreatif untuk melahirkan pemuda yang tangguh dan berakhlak.
        </p>
      </div>

      <div class="grid lg:grid-cols-2 gap-6 lg:gap-10 items-stretch">

        <div class="bg-white border border-slate-100 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl shadow-slate-100/80 flex flex-col gap-6 sm:gap-8 group hover:shadow-2xl hover:shadow-emerald-500/10 hover:border-emerald-200/50 transition-all duration-500">
          <div class="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/><path d="m16.2 7.8-2 2c-.8-.8-2.2-.8-3 0-.8.8-.8 2.2 0 3l2-2"/>
              <path d="M11.3 15.3c-.3.3-.7.4-1 .3-.3-.1-.5-.3-.6-.6-.1-.3 0-.7.3-1l3.5-3.5"/>
            </svg>
          </div>

          <div class="space-y-3">
            <h3 class="text-xl sm:text-2xl font-black text-slate-900">Visi Kami</h3>
            <p class="text-slate-500 font-medium leading-relaxed text-sm sm:text-base">
              {{ aboutData.visi }}
            </p>
          </div>

          <div class="h-px bg-gradient-to-r from-transparent via-emerald-200/60 to-transparent"></div>

          <div class="space-y-4">
            <h4 class="text-base sm:text-lg font-black text-slate-900">Misi Kami</h4>
            <ul class="space-y-3 sm:space-y-4">
              <li v-for="(misi, idx) in aboutData.misi" :key="idx" class="flex items-start gap-3 sm:gap-4">
                <div :class="['w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center flex-shrink-0 font-black text-xs text-white shadow-sm mt-0.5',
                  idx === 0 ? 'bg-emerald-500' : idx === 1 ? 'bg-green-500' : 'bg-teal-500'
                ]">{{ idx + 1 }}</div>
                <p class="text-sm sm:text-base font-medium text-slate-500 leading-relaxed">{{ misi }}</p>
              </li>
            </ul>
          </div>
        </div>

        <div class="flex flex-col gap-4 sm:gap-5">
          <div class="mb-2">
            <span class="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-emerald-600">Nilai Perjuangan</span>
            <h3 class="text-2xl sm:text-3xl font-black text-slate-900 mt-1.5">Semboyan & Jati Diri</h3>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 flex-grow">
            <div
              v-for="v in values"
              :key="v.title"
              class="bg-white border border-slate-100 rounded-2xl p-5 sm:p-6 shadow-lg shadow-slate-100/80 hover:shadow-xl hover:shadow-emerald-500/10 hover:border-emerald-200/50 hover:-translate-y-1 transition-all duration-300 flex flex-col gap-3"
            >
              <span class="text-2xl sm:text-3xl">{{ v.emoji }}</span>
              <div>
                <h4 class="text-base sm:text-lg font-black text-slate-900 mb-1">{{ v.title }}</h4>
                <p class="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed">{{ v.desc }}</p>
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-r from-emerald-600 to-green-600 rounded-2xl p-5 sm:p-6 text-white shadow-xl shadow-emerald-600/20">
            <p class="text-[10px] font-black uppercase tracking-widest text-emerald-200 mb-2">Semboyan FORMULA</p>
            <p class="text-sm sm:text-base font-bold leading-relaxed italic">"Muda, Beriman, Berprestasi — Bersama Membangun Dusun yang Lebih Baik."</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
