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
</script>

<template>
  <section id="about" class="scroll-mt-28 relative overflow-hidden bg-linear-to-b from-white via-emerald-50/15 to-white">
    <div class="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.05),transparent_40%)]"></div>
    <div class="absolute -top-10 -left-10 w-72 h-72 bg-emerald-100/30 blur-[100px] rounded-full -z-10"></div>
    <div class="max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-24">
      <div class="text-center max-w-3xl mx-auto mb-12 sm:mb-20 space-y-4">
        <span class="text-xs font-black uppercase tracking-[0.25em] text-emerald-600">Tentang Kami</span>
        <h2 class="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-tight">
          Menyatukan Potensi, <span class="text-transparent bg-clip-text bg-linear-to-r from-emerald-600 via-green-600 to-teal-500">Membangun Dusun Ngampon</span>
        </h2>
        <p class="text-slate-500 font-medium text-base sm:text-lg leading-relaxed">
          FORMULA (Forum Muda Mudi Islam Ngampon) is a youth organization active in social, religious, educational, and creative fields to produce tough and religious youth.
        </p>
      </div>

      <div class="grid lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
        <div class="bg-white border border-slate-100/80 rounded-lg p-6 sm:p-10 md:p-12 shadow-xl shadow-slate-100 flex flex-col justify-between group hover:scale-[1.01] hover:border-emerald-500/20 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300">
          <div class="space-y-6 sm:space-y-8">
            <div class="w-12 h-12 sm:w-14 sm:h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m16.2 7.8-2 2c-.8-.8-2.2-.8-3 0-.8.8-.8 2.2 0 3l2-2"/><path d="M11.3 15.3c-.3.3-.7.4-1 .3-.3-.1-.5-.3-.6-.6-.1-.3 0-.7.3-1l3.5-3.5"/></svg>
            </div>
            <div class="space-y-3 sm:space-y-4">
              <h3 class="text-xl sm:text-2xl font-black text-slate-900">Visi Kami</h3>
              <p class="text-slate-500 font-medium leading-relaxed text-sm sm:text-base">
                {{ aboutData.visi }}
              </p>
            </div>
            <div class="space-y-3 sm:space-y-4">
              <h4 class="text-lg sm:text-xl font-black text-slate-900">Misi Kami</h4>
              <ul class="space-y-3 sm:space-y-4 font-medium text-slate-500 text-sm sm:text-base">
                <li v-for="(misi, idx) in aboutData.misi" :key="idx" class="flex items-start gap-3">
                  <span :class="['w-2.5 h-2.5 rounded-full mt-2 flex-shrink-0', idx === 0 ? 'bg-emerald-500' : idx === 1 ? 'bg-green-500' : 'bg-teal-500']"></span>
                  <span>{{ misi }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div class="p-2 sm:p-6 flex flex-col justify-between">
          <div class="space-y-6 sm:space-y-8">
            <div>
              <span class="text-xs font-black uppercase tracking-[0.2em] text-emerald-600">Nilai Perjuangan</span>
              <h3 class="text-2xl sm:text-3xl font-black text-slate-900 mt-1 sm:mt-2">Semboyan & Jati Diri</h3>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div class="p-5 sm:p-6 rounded-lg border border-slate-100/80 bg-white shadow-xl shadow-slate-100 space-y-3 hover:shadow-2xl hover:shadow-emerald-500/10 hover:border-emerald-500/20 transition-all duration-300 hover:-translate-y-1">
                <span class="text-2xl">🌱</span>
                <h4 class="text-lg font-black text-slate-900">Muda</h4>
                <p class="text-xs text-slate-500 font-medium leading-relaxed">Menjiwai karakter bersemangat, energik, berani mengambil langkah kreatif, serta tangguh menghadapi tantangan.</p>
              </div>
              
              <div class="p-5 sm:p-6 rounded-lg border border-slate-100/80 bg-white shadow-xl shadow-slate-100 space-y-3 hover:shadow-2xl hover:shadow-emerald-500/10 hover:border-emerald-500/20 transition-all duration-300 hover:-translate-y-1">
                <span class="text-2xl">🕌</span>
                <h4 class="text-lg font-black text-slate-900">Beriman</h4>
                <p class="text-xs text-slate-500 font-medium leading-relaxed">Senantiasa mendasarkan segala ucapan, perbuatan, serta rancangan kegiatan pada ajaran suci agama Islam.</p>
              </div>

              <div class="p-5 sm:p-6 rounded-lg border border-slate-100/80 bg-white shadow-xl shadow-slate-100 space-y-3 hover:shadow-2xl hover:shadow-emerald-500/10 hover:border-emerald-500/20 transition-all duration-300 hover:-translate-y-1">
                <span class="text-2xl">🏆</span>
                <h4 class="text-lg font-black text-slate-900">Berprestasi</h4>
                <p class="text-xs text-slate-500 font-medium leading-relaxed">Berkomitmen melahirkan prestasi, berpendidikan yang andal, serta mendatangkan kegunaan konkret bagi dusun.</p>
              </div>

              <div class="p-5 sm:p-6 rounded-lg border border-slate-100/80 bg-white shadow-xl shadow-slate-100 space-y-3 hover:shadow-2xl hover:shadow-emerald-500/10 hover:border-emerald-500/20 transition-all duration-300 hover:-translate-y-1">
                <span class="text-2xl">🤝</span>
                <h4 class="text-lg font-black text-slate-900">Sinergitas</h4>
                <p class="text-xs text-slate-500 font-medium leading-relaxed">Melangkah beriringan bersama seluruh lapisan masyarakat, pengurus RT, serta jajaran sesepuh dusun.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
