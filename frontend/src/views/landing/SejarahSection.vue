<script setup>
import { ref } from 'vue'
import { useSocialStore } from '../../stores/social'

const socialStore = useSocialStore()

const activeGenIndex = ref(9)

const generations = [
  {
    num: 1, year: '2017', leader: 'M. Yusuf Efendi', secretary: 'Dwi Setyawan', treasurer: 'Agustina Rahayu',
    activeMembers: ['Bambang', 'Wawan', 'Lilis', 'Indah', 'Catur', 'Edi', 'Hendra', 'Nurul'],
    story: 'Awal mula berdirinya FORMULA dengan merintis pilar kepemudaan sosial serta pembagian kepanitiaan Ramadhan perdana.'
  },
  {
    num: 2, year: '2018', leader: 'Aris Munandar', secretary: 'Novita Sari', treasurer: 'Fajar Shodiq',
    activeMembers: ['Lukman', 'Fitri', 'Eko', 'Rini', 'Doni', 'Susi', 'Dian', 'Teguh'],
    story: 'Mengembangkan sayap kepemudaan di bidang olahraga dan menginisiasi kegiatan Ngampon Futsal Cup pertama kali.'
  },
  {
    num: 3, year: '2019', leader: 'Tri Utomo', secretary: 'Mega Lestari', treasurer: 'Irfan Hakim',
    activeMembers: ['Angga', 'Rina', 'Bayu', 'Sari', 'Dewi', 'Rudi', 'Gita', 'Agus'],
    story: 'Fokus meluncurkan program bimbingan belajar mingguan "Ngampon Cerdas" untuk memajukan pendidikan adik-adik dusun.'
  },
  {
    num: 4, year: '2020', leader: 'Heri Prasetyo', secretary: 'Alya Rohali', treasurer: 'Hadi Wijaya',
    activeMembers: ['Fandi', 'Mila', 'Rizal', 'Putri', 'Toni', 'Nita', 'Yanto', 'Hana'],
    story: 'Menghadapi tantangan pandemi global dengan fokus penuh pada aksi tanggap darurat, sterilisasi dusun, dan bakti sosial.'
  },
  {
    num: 5, year: '2021', leader: 'Bagus Setyawan', secretary: 'Tri Wahyuni', treasurer: 'Aditya Pratama',
    activeMembers: ['Agung', 'Restu', 'Nanda', 'Dila', 'Sony', 'Rere', 'Dicky', 'Mia'],
    story: 'Membangun kembali program kegiatan Ramadhan secara adaptif dan mulai merintis aset digitalisasi dusun.'
  },
  {
    num: 6, year: '2022', leader: 'Wahyu Nugroho', secretary: 'Intan Permata', treasurer: 'Deny Kurniawan',
    activeMembers: ['Dodo', 'Lina', 'Yoga', 'Eka', 'Arie', 'Beti', 'Ghani', 'Sonia'],
    story: 'Mendorong modernisasi struktur keorganisasian dengan peluncuran wadah kreatifitas seni budaya rebana hadrah.'
  },
  {
    num: 7, year: '2023', leader: 'Rian Hidayat', secretary: 'Dina Marlina', treasurer: 'Slamet Riyadi',
    activeMembers: ['Ivan', 'Ayu', 'Rendi', 'Kiki', 'Hana', 'Dodo', 'Gani', 'Yanti'],
    story: 'Menghidupkan kembali kegiatan takbir keliling akbar pasca-pandemi dan festival lomba anak saleh tingkat kecamatan.'
  },
  {
    num: 8, year: '2024', leader: 'Eko Prasetyo', secretary: 'Nanda Lestari', treasurer: 'Farhan Azis',
    activeMembers: ['Fahri', 'Mila', 'Zidan', 'Novi', 'Ferry', 'Zaskia', 'Wandi', 'Ina'],
    story: 'Sukses besar memperingati milad ke-8 FORMULA dengan menyelenggarakan tabligh akbar mendatangkan mubaligh kondang.'
  },
  {
    num: 9, year: '2025', leader: 'Fajar Ramadhan', secretary: 'Zahra Amelia', treasurer: 'Roni Wijaya',
    activeMembers: ['Umar', 'Aisyah', 'Hamzah', 'Aulia', 'Thariq', 'Rania', 'Faris', 'Nisa'],
    story: 'Memulai digitalisasi sistem donasi kas pemuda serta memperluas relasi bakti sosial mencakup luar lingkungan dusun.'
  },
  {
    num: 10, year: '2026', leader: 'Fandi Ahmad', secretary: 'Aditya Pratama', treasurer: 'Rina Amalia',
    activeMembers: ['Muhammad Yusuf', 'Budi Santoso', 'Sari Puspita', 'Zaki Mubarak', 'Heri Prasetyo', 'Wahyu Nugroho', 'Eko Prasetyo'],
    story: 'Mencapai era puncak sinergitas aktif, meluncurkan portal interaktif FORMULA untuk menyatukan rekam jejak kepemudaan.'
  }
]
</script>

<template>
  <section id="sejarah" class="scroll-mt-24 relative overflow-hidden bg-white">
    <div class="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(217,119,6,0.04),transparent_35%)]"></div>
    <div class="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom_left,rgba(16,185,129,0.05),transparent_40%)]"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">

      <div class="text-center max-w-3xl mx-auto mb-12 sm:mb-16 lg:mb-20 space-y-4">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 border border-emerald-200/60 rounded-full mb-2">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span class="text-[10px] sm:text-xs font-black text-emerald-600 uppercase tracking-[0.2em]">Sejarah & Silsilah</span>
        </div>
        <h2 class="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-tight">
          Rekam Jejak
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500">10 Generasi</span>
          FORMULA
        </h2>
        <p class="text-slate-500 font-medium text-sm sm:text-base lg:text-lg leading-relaxed">
          Menelusuri sejarah emas perjuangan para pendiri, silsilah kepengurusan, serta barisan generasi muda hebat dari masa ke masa.
        </p>
      </div>

      <div class="grid lg:grid-cols-12 gap-6 lg:gap-10 items-start">

        <div class="lg:col-span-5 bg-gradient-to-b from-emerald-50/40 to-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 border border-emerald-100/50 shadow-xl shadow-emerald-500/5 flex flex-col gap-6 sm:gap-8">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-emerald-500/25 flex-shrink-0">
              🕌
            </div>
            <div>
              <h3 class="text-base sm:text-lg font-black text-slate-900 leading-tight">Sejarah Singkat Pendirian</h3>
              <p class="text-[10px] sm:text-xs font-black text-emerald-600 uppercase tracking-widest mt-1">Est. Desember 2016</p>
            </div>
          </div>

          <p class="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
            {{ socialStore.landingConfig.sejarah }}
          </p>

          <div class="h-px bg-gradient-to-r from-transparent via-emerald-200/70 to-transparent"></div>

          <div class="space-y-4">
            <h4 class="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400">Jajaran Pendiri & Pelopor</h4>
            <div class="space-y-3">
              <div v-for="f in [
                { emoji: '👴', name: 'Kiai Haji Hasbullah', role: 'Sesepuh & Penasihat Spiritual' },
                { emoji: '💖', name: 'Ustadz Mansur', role: 'Koordinator Tokoh Agama Dusun' },
                { emoji: '👦', name: 'M. Yusuf Efendi & Pioneer Youth', role: 'Ketua Generasi 1 (Pelopor Pertama)' }
              ]" :key="f.name" class="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-100/80 hover:border-emerald-200/50 transition-colors">
                <span class="text-xl flex-shrink-0 mt-0.5">{{ f.emoji }}</span>
                <div>
                  <p class="text-xs sm:text-sm font-black text-slate-800">{{ f.name }}</p>
                  <p class="text-[10px] text-slate-400 mt-0.5">{{ f.role }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-2xl p-5 sm:p-6 shadow-xl shadow-emerald-600/20">
            <p class="text-[10px] font-black uppercase tracking-widest text-emerald-200 mb-2">Warisan Perjuangan</p>
            <p class="text-xs sm:text-sm font-medium leading-relaxed italic">"Bagi anak-anak baru, silsilah ini adalah bukti dedikasi tanpa pamrih. Lanjutkan api perjuangan demi harumnya nama Dusun Ngampon!"</p>
          </div>
        </div>

        <div class="lg:col-span-7 bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl shadow-slate-100/80 border border-slate-100 flex flex-col gap-6 sm:gap-8">
          <div>
            <h3 class="text-base sm:text-lg font-black text-slate-900">Pilih Generasi Kepengurusan</h3>
            <p class="text-xs sm:text-sm text-slate-400 font-medium mt-1">Tekan tombol generasi untuk melihat silsilah kepengurusan lengkap.</p>
          </div>

          <div class="grid grid-cols-5 sm:grid-cols-10 gap-1.5 sm:gap-2">
            <button
              v-for="(gen, index) in generations"
              :key="gen.num"
              @click="activeGenIndex = index"
              :class="[
                'py-2 sm:py-2.5 rounded-xl font-black text-[10px] sm:text-xs transition-all cursor-pointer text-center',
                activeGenIndex === index
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 scale-105'
                  : 'bg-slate-50 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600'
              ]"
            >
              G-{{ gen.num }}
            </button>
          </div>

          <div class="h-px bg-slate-100"></div>

          <div class="space-y-5 sm:space-y-6">
            <div class="flex items-start justify-between gap-4">
              <div>
                <span class="text-[10px] sm:text-xs font-black text-emerald-600 uppercase tracking-widest">Generasi {{ generations[activeGenIndex].num }}</span>
                <h4 class="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">Tahun Bakti {{ generations[activeGenIndex].year }}</h4>
              </div>
              <div class="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-[10px] sm:text-xs font-black rounded-xl flex-shrink-0">
                AKTIF {{ generations[activeGenIndex].year }}
              </div>
            </div>

            <div class="bg-slate-50 rounded-2xl p-4 sm:p-5 border-l-4 border-emerald-500">
              <p class="text-xs sm:text-sm text-slate-600 font-medium italic leading-relaxed">
                "{{ generations[activeGenIndex].story }}"
              </p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div v-for="(pos, label) in { 'Ketua Generasi': generations[activeGenIndex].leader, 'Sekretaris': generations[activeGenIndex].secretary, 'Bendahara': generations[activeGenIndex].treasurer }"
                :key="label"
                class="p-4 bg-emerald-50/40 rounded-xl border border-emerald-100/30 space-y-1"
              >
                <span class="text-[9px] sm:text-[10px] font-black text-emerald-600 uppercase tracking-wider">{{ label }}</span>
                <p class="text-xs sm:text-sm font-black text-slate-800 leading-snug">{{ pos }}</p>
              </div>
            </div>

            <div class="space-y-2.5">
              <h5 class="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400">Jajaran Anggota Aktif</h5>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="member in generations[activeGenIndex].activeMembers"
                  :key="member"
                  class="px-3 py-1.5 bg-slate-50 text-slate-600 text-[10px] sm:text-xs font-black uppercase tracking-wide rounded-xl border border-slate-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200/50 transition-colors cursor-default"
                >
                  {{ member }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
