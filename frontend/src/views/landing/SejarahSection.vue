<script setup>
import { ref } from 'vue'
import { useSocialStore } from '../../stores/social'

const socialStore = useSocialStore()

const activeGenIndex = ref(9)

const generations = [
  {
    num: 1,
    year: '2017',
    leader: 'M. Yusuf Efendi',
    secretary: 'Dwi Setyawan',
    treasurer: 'Agustina Rahayu',
    activeMembers: ['Bambang', 'Wawan', 'Lilis', 'Indah', 'Catur', 'Edi', 'Hendra', 'Nurul'],
    story: 'Awal mula berdirinya FORMULA dengan merintis pilar kepemudaan sosial serta pembagian kepanitiaan Ramadhan perdana.'
  },
  {
    num: 2,
    year: '2018',
    leader: 'Aris Munandar',
    secretary: 'Novita Sari',
    treasurer: 'Fajar Shodiq',
    activeMembers: ['Lukman', 'Fitri', 'Eko', 'Rini', 'Doni', 'Susi', 'Dian', 'Teguh'],
    story: 'Mengembangkan sayap kepemudaan di bidang olahraga dan menginisiasi kegiatan Ngampon Futsal Cup pertama kali.'
  },
  {
    num: 3,
    year: '2019',
    leader: 'Tri Utomo',
    secretary: 'Mega Lestari',
    treasurer: 'Irfan Hakim',
    activeMembers: ['Angga', 'Rina', 'Bayu', 'Sari', 'Dewi', 'Rudi', 'Gita', 'Agus'],
    story: 'Fokus meluncurkan program bimbingan belajar mingguan "Ngampon Cerdas" untuk memajukan pendidikan adik-adik dusun.'
  },
  {
    num: 4,
    year: '2020',
    leader: 'Heri Prasetyo',
    secretary: 'Alya Rohali',
    treasurer: 'Hadi Wijaya',
    activeMembers: ['Fandi', 'Mila', 'Rizal', 'Putri', 'Toni', 'Nita', 'Yanto', 'Hana'],
    story: 'Menghadapi tantangan pandemi global dengan berfokus penuh pada aksi tanggap darurat, sterilisasi dusun, dan bakti sosial.'
  },
  {
    num: 5,
    year: '2021',
    leader: 'Bagus Setyawan',
    secretary: 'Tri Wahyuni',
    treasurer: 'Aditya Pratama',
    activeMembers: ['Agung', 'Restu', 'Nanda', 'Dila', 'Sony', 'Rere', 'Dicky', 'Mia'],
    story: 'Membangun kembali program kegiatan Ramadhan secara adaptif and mulai merintis aset digitalisasi dusun.'
  },
  {
    num: 6,
    year: '2022',
    leader: 'Wahyu Nugroho',
    secretary: 'Intan Permata',
    treasurer: 'Deny Kurniawan',
    activeMembers: ['Dodo', 'Lina', 'Yoga', 'Eka', 'Arie', 'Beti', 'Ghani', 'Sonia'],
    story: 'Mendorong modernisasi struktur keorganisasian dengan peluncuran wadah kreatifitas seni budaya rebana hadrah.'
  },
  {
    num: 7,
    year: '2023',
    leader: 'Rian Hidayat',
    secretary: 'Dina Marlina',
    treasurer: 'Slamet Riyadi',
    activeMembers: ['Ivan', 'Ayu', 'Rendi', 'Kiki', 'Hana', 'Dodo', 'Gani', 'Yanti'],
    story: 'Menghidupkan kembali kegiatan takbir keliling akbar pasca-pandemi dan festival lomba anak saleh tingkat kecamatan.'
  },
  {
    num: 8,
    year: '2024',
    leader: 'Eko Prasetyo',
    secretary: 'Nanda Lestari',
    treasurer: 'Farhan Azis',
    activeMembers: ['Fahri', 'Mila', 'Zidan', 'Novi', 'Ferry', 'Zaskia', 'Wandi', 'Ina'],
    story: 'Sukses besar memperingati milad ke-8 FORMULA dengan menyelenggarakan tabligh akbar mendatangkan mubaligh kondang.'
  },
  {
    num: 9,
    year: '2025',
    leader: 'Fajar Ramadhan',
    secretary: 'Zahra Amelia',
    treasurer: 'Roni Wijaya',
    activeMembers: ['Umar', 'Aisyah', 'Hamzah', 'Aulia', 'Thariq', 'Rania', 'Faris', 'Nisa'],
    story: 'Memulai digitalisasi sistem donasi kas pemuda serta memperluas relasi bakti sosial mencakup luar lingkungan dusun.'
  },
  {
    num: 10,
    year: '2026',
    leader: 'Ahmad Fauzi',
    secretary: 'Siti Aminah',
    treasurer: 'Andi Pratama',
    activeMembers: ['Laila Sari', 'Rizky Ramadhan', 'Budi', 'Sari', 'Zaki', 'Putri', 'Hidayat', 'Indah'],
    story: 'Mencapai era puncak sinergitas aktif, meluncurkan portal interaktif FORMULA untuk menyatukan rekam jejak kepemudaan.'
  }
]
</script>

<template>
  <section id="sejarah" class="scroll-mt-28 relative overflow-hidden bg-white">
    <div class="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(217,119,6,0.03),transparent_35%)]"></div>
    <div class="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_bottom_left,rgba(16,185,129,0.04),transparent_40%)]"></div>
    <div class="absolute top-1/4 right-10 w-80 h-80 bg-amber-100/10 blur-[120px] rounded-full -z-10"></div>
    <div class="max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-24">
      <div class="text-center max-w-3xl mx-auto mb-12 sm:mb-20 space-y-4">
        <span class="text-xs font-black uppercase tracking-[0.25em] text-emerald-600">Sejarah & Silsilah</span>
        <h2 class="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-tight">
          Rekam Jejak <span class="text-transparent bg-clip-text bg-linear-to-r from-emerald-600 via-green-600 to-teal-500">10 Generasi</span> FORMULA
        </h2>
        <p class="text-slate-500 font-medium text-base sm:text-lg leading-relaxed">
          Menelusuri sejarah emas perjuangan para pendiri, silsilah kepengurusan, serta barisan generasi muda hebat dari masa ke masa.
        </p>
      </div>

      <div class="grid lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
        <div class="lg:col-span-5 bg-linear-to-b from-emerald-50/20 to-white rounded-[2rem] p-6 sm:p-10 border border-emerald-100/30 flex flex-col justify-between shadow-xl shadow-emerald-500/5">
          <div class="space-y-6 sm:space-y-8">
            <div class="flex items-center gap-4">
              <span class="text-3xl">🕌</span>
              <div>
                <h3 class="text-lg sm:text-xl font-black text-slate-900 leading-tight">Sejarah Singkat Pendirian</h3>
                <p class="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-0.5">Est. Desember 2016</p>
              </div>
            </div>
            <p class="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
              {{ socialStore.landingConfig.sejarah }}
            </p>
            
            <div class="h-px bg-emerald-100/50"></div>
            
            <div class="space-y-4">
              <h4 class="text-xs font-black uppercase tracking-widest text-slate-400">Jajaran Pendiri & Pelopor</h4>
              <div class="space-y-3 font-medium text-xs sm:text-sm text-slate-600">
                <div class="flex items-start gap-3">
                  <span class="text-emerald-500">👴</span>
                  <div>
                    <strong class="text-slate-800 font-black">Kiai Haji Hasbullah</strong>
                    <p class="text-[10px] text-slate-400">Sesepuh & Penasihat Spiritual</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <span class="text-emerald-500">💖</span>
                  <div>
                    <strong class="text-slate-800 font-black">Ustadz Mansur</strong>
                    <p class="text-[10px] text-slate-400">Koordinator Tokoh Agama Dusun</p>
                  </div>
                </div>
                <div class="flex items-start gap-3">
                  <span class="text-emerald-500">👦</span>
                  <div>
                    <strong class="text-slate-800 font-black">M. Yusuf Efendi & Pioneer Youth</strong>
                    <p class="text-[10px] text-slate-400">Ketua Generasi 1 (Pelopor Pertama)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-8 pt-6 border-t border-emerald-100/50 bg-emerald-600 text-white rounded-2xl p-5 shadow-xl shadow-emerald-500/10">
            <p class="text-[10px] font-black uppercase tracking-widest text-emerald-200">Warisan Perjuangan</p>
            <p class="text-xs font-medium leading-relaxed mt-1">"Bagi anak-anak baru, silsilah ini adalah bukti dedikasi tanpa pamrih. Lanjutkan api perjuangan demi harumnya nama Dusun Ngampon!"</p>
          </div>
        </div>

        <div class="lg:col-span-7 bg-white rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 shadow-2xl shadow-emerald-500/15 border border-slate-50 flex flex-col justify-between">
          <div class="space-y-6 sm:space-y-8">
            <div class="space-y-2">
              <h3 class="text-lg sm:text-xl font-black text-slate-900 leading-tight">Pilih Generasi Kepengurusan</h3>
              <p class="text-xs text-slate-400 font-bold">Tekan tombol generasi di bawah untuk melihat silsilah kepengurusan lengkap.</p>
            </div>

            <div class="grid grid-cols-5 sm:grid-cols-10 gap-1.5 sm:gap-2">
              <button v-for="(gen, index) in generations" :key="gen.num"
                      @click="activeGenIndex = index"
                      :class="['py-2.5 sm:py-3 rounded-xl font-black text-[10px] sm:text-xs transition-all uppercase tracking-wider cursor-pointer text-center', activeGenIndex === index ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 scale-105' : 'bg-slate-50 text-slate-500 hover:bg-emerald-50/50']">
                G-{{ gen.num }}
              </button>
            </div>

            <div class="h-px bg-slate-100"></div>

            <div class="space-y-6 animate-in fade-in duration-300">
              <div class="flex items-center justify-between">
                <div>
                  <span class="text-xs font-black text-emerald-600 uppercase tracking-widest">Generasi {{ generations[activeGenIndex].num }}</span>
                  <h4 class="text-xl font-black text-slate-900 mt-0.5">Tahun Bakti {{ generations[activeGenIndex].year }}</h4>
                </div>
                <div class="px-4 py-1.5 bg-emerald-50 text-emerald-700 text-[10px] font-black rounded-lg">
                  AKTIF {{ generations[activeGenIndex].year }}
                </div>
              </div>

              <p class="text-xs sm:text-sm text-slate-500 font-medium italic bg-slate-50 px-4 py-3 rounded-xl leading-relaxed border-l-4 border-emerald-500">
                "{{ generations[activeGenIndex].story }}"
              </p>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div class="p-4 bg-emerald-50/30 rounded-2xl border border-emerald-100/20 space-y-1">
                  <span class="text-[9px] font-black text-emerald-600 uppercase tracking-wider">Ketua Generasi</span>
                  <p class="text-xs font-black text-slate-800">{{ generations[activeGenIndex].leader }}</p>
                </div>
                <div class="p-4 bg-emerald-50/30 rounded-2xl border border-emerald-100/20 space-y-1">
                  <span class="text-[9px] font-black text-emerald-600 uppercase tracking-wider">Sekretaris</span>
                  <p class="text-xs font-black text-slate-800">{{ generations[activeGenIndex].secretary }}</p>
                </div>
                <div class="p-4 bg-emerald-50/30 rounded-2xl border border-emerald-100/20 space-y-1">
                  <span class="text-[9px] font-black text-emerald-600 uppercase tracking-wider">Bendahara</span>
                  <p class="text-xs font-black text-slate-800">{{ generations[activeGenIndex].treasurer }}</p>
                </div>
              </div>

              <div class="space-y-2">
                <h5 class="text-[10px] font-black uppercase tracking-widest text-slate-400">Jajaran Pengurus & Anak-Anak Anggota</h5>
                <div class="flex flex-wrap gap-2">
                  <span v-for="member in generations[activeGenIndex].activeMembers" :key="member" class="px-3 py-1.5 bg-slate-50 text-slate-600 text-xs font-black uppercase tracking-wider rounded-lg border border-slate-100/50 hover:bg-emerald-50 hover:text-emerald-700 transition-colors cursor-default">
                    {{ member }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
