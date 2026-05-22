<script setup>
import { ref } from 'vue'
import { useSocialStore } from '../../../stores/social'
import DatePicker from 'primevue/datepicker'
import Select from 'primevue/select'
import Swal from 'sweetalert2'
import { useToast } from '../../../composables/useToast'

const socialStore = useSocialStore()
const { showToast } = useToast()
const activeTab = ref('agenda')

const agendaJudul = ref('')
const agendaTanggal = ref(null)
const agendaJam = ref('')
const agendaLokasi = ref('')
const agendaKategori = ref('Rapat')
const agendaWarna = ref('emerald')

const kategoriOptions = ref([
  { label: 'Rapat', value: 'Rapat' },
  { label: 'Sosial', value: 'Sosial' },
  { label: 'Olahraga', value: 'Olahraga' },
  { label: 'Keagamaan', value: 'Keagamaan' }
])

const warnaOptions = ref([
  { label: 'Emerald (Hijau)', value: 'emerald' },
  { label: 'Teal (Biru Langit)', value: 'teal' },
  { label: 'Indigo (Biru Tua)', value: 'indigo' },
  { label: 'Amber (Kuning)', value: 'amber' }
])

const rapatJudul = ref('')
const rapatTanggal = ref(null)
const rapatPesertaCount = ref(15)
const rapatKeputusanList = ref([''])

const addKeputusanInput = () => {
  rapatKeputusanList.value.push('')
}

const removeKeputusanInput = (index) => {
  if (rapatKeputusanList.value.length > 1) {
    rapatKeputusanList.value.splice(index, 1)
  }
}

const addAgenda = async () => {
  if (!agendaJudul.value.trim() || !agendaTanggal.value || !agendaJam.value.trim() || !agendaLokasi.value.trim()) {
    showToast('Silakan isi seluruh formulir agenda!', 'warning')
    return
  }

  const rawDate = new Date(agendaTanggal.value)
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
  const dateStr = `${days[rawDate.getDay()]}, ${rawDate.getDate()} ${rawDate.toLocaleString('id-ID', { month: 'short' })} ${rawDate.getFullYear()}`

  const res = await socialStore.addActivity(
    agendaJudul.value.trim(),
    dateStr,
    'agenda'
  )

  if (res.success) {
    agendaJudul.value = ''
    agendaTanggal.value = null
    agendaJam.value = ''
    agendaLokasi.value = ''
    showToast('Agenda kegiatan berhasil diterbitkan! 📅', 'success')
  } else {
    showToast('Gagal menyimpan agenda ke database!', 'error')
  }
}

const publishRapat = async () => {
  const filteredKeputusan = rapatKeputusanList.value.filter(k => k.trim() !== '')

  if (!rapatJudul.value.trim() || !rapatTanggal.value || filteredKeputusan.length === 0) {
    showToast('Isi judul, tanggal, dan minimal satu keputusan rapat!', 'warning')
    return
  }

  const rawDate = new Date(rapatTanggal.value)
  const dateStr = `${rawDate.getDate()} ${rawDate.toLocaleString('id-ID', { month: 'short' })}`

  const res = await socialStore.addActivity(
    rapatJudul.value.trim(),
    dateStr,
    'rapat',
    filteredKeputusan
  )

  if (res.success) {
    rapatJudul.value = ''
    rapatTanggal.value = null
    rapatPesertaCount.value = 15
    rapatKeputusanList.value = ['']
    showToast('Hasil keputusan rapat berhasil dipublikasi! 📋', 'success')
  } else {
    showToast('Gagal menyimpan hasil rapat ke database!', 'error')
  }
}

const deleteAgenda = (id) => {
  Swal.fire({
    title: 'Hapus Agenda?',
    text: 'Aksi ini tidak bisa dibatalkan!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#f43f5e',
    cancelButtonColor: '#475569',
    confirmButtonText: 'Ya, Hapus!',
    cancelButtonText: 'Batal'
  }).then(async (result) => {
    if (result.isConfirmed) {
      const res = await socialStore.deleteActivity(id)
      if (res.success) {
        showToast('Agenda berhasil dihapus.', 'success')
      } else {
        showToast('Gagal menghapus agenda!', 'error')
      }
    }
  })
}

const deleteRapat = (id) => {
  Swal.fire({
    title: 'Hapus Rapat?',
    text: 'Aksi ini tidak bisa dibatalkan!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#f43f5e',
    cancelButtonColor: '#475569',
    confirmButtonText: 'Ya, Hapus!',
    cancelButtonText: 'Batal'
  }).then(async (result) => {
    if (result.isConfirmed) {
      const res = await socialStore.deleteActivity(id)
      if (res.success) {
        showToast('Hasil rapat berhasil dihapus.', 'success')
      } else {
        showToast('Gagal menghapus hasil rapat!', 'error')
      }
    }
  })
}
</script>

<template>
  <div>
    <div class="bg-white border border-slate-200/70 rounded-2xl shadow-xs mb-6 grid grid-cols-2 divide-x divide-slate-250 overflow-hidden">
      <button 
        @click="activeTab = 'agenda'" 
        :class="[
          'flex items-center gap-4 p-5 text-left cursor-pointer transition-all duration-300 outline-none border-b-2',
          activeTab === 'agenda' 
            ? 'bg-emerald-50/15 border-b-emerald-500 font-black' 
            : 'bg-white border-b-transparent hover:bg-slate-50/50'
        ]"
      >
        <div :class="[
          'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border transition-all duration-300',
          activeTab === 'agenda' 
            ? 'bg-emerald-500 border-emerald-400 text-white shadow-sm shadow-emerald-500/10' 
            : 'bg-slate-50 border-slate-200 text-slate-500'
        ]">
          <font-awesome-icon icon="calendar" class="text-sm" />
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h4 class="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              Agenda Kegiatan
              <span v-if="activeTab === 'agenda'" class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </h4>
            <span v-if="socialStore.agendaKegiatan?.length > 0" :class="[
              'text-[9px] font-black px-2 py-0.5 rounded-full transition-all duration-300',
              activeTab === 'agenda' ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'
            ]">{{ socialStore.agendaKegiatan.length }}</span>
          </div>
          <p class="text-[10px] text-slate-500 mt-1 font-semibold leading-normal">Kelola jadwal, koordinasi kerja bakti, olahraga, dan agenda dusun.</p>
        </div>
      </button>

      <button 
        @click="activeTab = 'rapat'" 
        :class="[
          'flex items-center gap-4 p-5 text-left cursor-pointer transition-all duration-300 outline-none border-b-2',
          activeTab === 'rapat' 
            ? 'bg-teal-50/15 border-b-teal-500 font-black' 
            : 'bg-white border-b-transparent hover:bg-slate-50/50'
        ]"
      >
        <div :class="[
          'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border transition-all duration-300',
          activeTab === 'rapat' 
            ? 'bg-teal-500 border-teal-400 text-white shadow-sm shadow-teal-500/10' 
            : 'bg-slate-50 border-slate-200 text-slate-500'
        ]">
          <font-awesome-icon icon="file-alt" class="text-sm" />
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h4 class="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              Hasil Keputusan Rapat
              <span v-if="activeTab === 'rapat'" class="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></span>
            </h4>
            <span v-if="socialStore.hasilRapat?.length > 0" :class="[
              'text-[9px] font-black px-2 py-0.5 rounded-full transition-all duration-300',
              activeTab === 'rapat' ? 'bg-teal-500 text-white' : 'bg-slate-200 text-slate-650'
            ]">{{ socialStore.hasilRapat.length }}</span>
          </div>
          <p class="text-[10px] text-slate-500 mt-1 font-semibold leading-normal">Publikasikan keputusan, notulen musyawarah, dan jumlah kehadiran rapat.</p>
        </div>
      </button>
    </div>

    <div v-if="activeTab === 'agenda'" class="grid grid-cols-12 gap-8">
      <div class="col-span-5 bg-white border border-slate-200/70 rounded-2xl p-6 shadow-xs h-fit">
        <h3 class="text-xs font-black uppercase tracking-widest text-slate-800 mb-6 flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-emerald-500"></span> Tambah Agenda Kegiatan Baru
        </h3>
        <div class="space-y-4">
          <div>
            <label class="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Judul Kegiatan</label>
            <input v-model="agendaJudul" type="text" placeholder="Contoh: Bakti Sosial Kebersihan Dusun" class="w-full px-4 py-3 bg-white border border-slate-200 rounded-md text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500">
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Tanggal Kegiatan</label>
              <DatePicker v-model="agendaTanggal" dateFormat="dd/mm/yy" placeholder="Pilih Tanggal" class="w-full rounded-md" inputClass="w-full px-4 py-3 bg-white border border-slate-200 rounded-md text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
            </div>
            <div>
              <label class="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Waktu / Jam</label>
              <input v-model="agendaJam" type="text" placeholder="Contoh: 08:00 - Selesai" class="w-full px-4 py-3 bg-white border border-slate-200 rounded-md text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500">
            </div>
          </div>
          <div>
            <label class="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Lokasi Kegiatan</label>
            <input v-model="agendaLokasi" type="text" placeholder="Contoh: Balai Dusun Ngampon" class="w-full px-4 py-3 bg-white border border-slate-200 rounded-md text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500">
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Kategori</label>
              <Select v-model="agendaKategori" :options="kategoriOptions" optionLabel="label" optionValue="value" placeholder="Pilih Kategori" class="w-full text-xs rounded-md" />
            </div>
            <div>
              <label class="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Warna Aksen</label>
              <Select v-model="agendaWarna" :options="warnaOptions" optionLabel="label" optionValue="value" placeholder="Pilih Warna" class="w-full text-xs rounded-md" />
            </div>
          </div>
          <button @click="addAgenda" class="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-black text-xs uppercase tracking-widest transition-all cursor-pointer">
            <font-awesome-icon icon="plus" class="mr-2" /> Terbitkan Agenda
          </button>
        </div>
      </div>

      <div class="col-span-7 bg-white border border-slate-200/70 rounded-2xl p-6 shadow-xs h-fit">
        <h3 class="text-xs font-black uppercase tracking-widest text-slate-800 mb-4 flex items-center gap-2">
          <font-awesome-icon icon="calendar" class="text-emerald-500 text-sm" /> Agenda Terpublikasi
        </h3>
        <div class="space-y-1">
          <div v-if="!socialStore.agendaKegiatan || socialStore.agendaKegiatan.length === 0" class="text-center py-8 text-xs text-slate-400 font-bold uppercase tracking-wider">
            Belum ada agenda terpublikasi
          </div>
          <div v-else v-for="agenda in socialStore.agendaKegiatan" :key="agenda.id" class="py-4 flex items-center justify-between gap-4 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 px-2 rounded-lg transition-colors">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 shadow-sm border border-emerald-100">
                <font-awesome-icon icon="calendar" class="text-sm" />
              </div>
              <div>
                <h4 class="text-xs font-black text-slate-800 leading-tight uppercase">{{ agenda.judul }}</h4>
                <div class="flex items-center gap-x-3 gap-y-1.5 mt-2 text-[10px] text-slate-500 font-medium">
                  <span class="bg-slate-100 border border-slate-200 text-slate-600 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider">{{ agenda.kategori || 'Umum' }}</span>
                  <span class="flex items-center gap-1">📅 {{ agenda.tanggal }}</span>
                  <span class="w-1 h-1 rounded-full bg-slate-300"></span>
                  <span class="flex items-center gap-1">🕐 {{ agenda.jam || '08:00 - Selesai' }}</span>
                </div>
              </div>
            </div>
            <button @click="deleteAgenda(agenda.id)" class="p-2.5 bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-600 hover:text-white rounded-md transition-colors cursor-pointer flex-shrink-0 shadow-2xs">
              <font-awesome-icon icon="trash" class="text-xs" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'rapat'" class="grid grid-cols-12 gap-8">
      <div class="col-span-5 bg-white border border-slate-200/70 rounded-2xl p-6 shadow-xs h-fit">
        <h3 class="text-xs font-black uppercase tracking-widest text-slate-800 mb-6 flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-teal-500"></span> Input Hasil Rapat Pengurus
        </h3>
        <div class="space-y-4">
          <div>
            <label class="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Judul Rapat</label>
            <input v-model="rapatJudul" type="text" placeholder="Contoh: Rapat Persiapan Baksos Tahunan" class="w-full px-4 py-3 bg-white border border-slate-200 rounded-md text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500">
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Tanggal Rapat</label>
              <DatePicker v-model="rapatTanggal" dateFormat="dd/mm/yy" placeholder="Pilih Tanggal" class="w-full rounded-md" inputClass="w-full px-4 py-3 bg-white border border-slate-200 rounded-md text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
            </div>
            <div>
              <label class="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Jumlah Kehadiran</label>
              <input v-model.number="rapatPesertaCount" type="number" placeholder="15" class="w-full px-4 py-3 bg-white border border-slate-200 rounded-md text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500">
            </div>
          </div>
          <div>
            <label class="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Butir Keputusan Rapat</label>
            <div class="space-y-2 max-h-48 overflow-y-auto pr-1">
              <div v-for="(keputusan, index) in rapatKeputusanList" :key="index" class="flex gap-2 items-center">
                <input v-model="rapatKeputusanList[index]" type="text" :placeholder="'Keputusan ' + (index + 1)" class="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-md text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500">
                <button @click="removeKeputusanInput(index)" class="p-3.5 bg-rose-50 border border-rose-250 text-rose-700 rounded-md hover:bg-rose-600 hover:text-white transition-all cursor-pointer flex items-center justify-center w-[42px] h-[42px] flex-shrink-0">
                  <font-awesome-icon icon="trash" class="text-xs" />
                </button>
              </div>
            </div>
            <button @click="addKeputusanInput" class="mt-2 text-[10px] font-black uppercase tracking-wider text-emerald-600 hover:text-emerald-700 transition-colors cursor-pointer flex items-center gap-1">
              <font-awesome-icon icon="plus" /> Tambah Keputusan
            </button>
          </div>
          <button @click="publishRapat" class="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white rounded-md font-black text-xs uppercase tracking-widest transition-all cursor-pointer">
            <font-awesome-icon icon="plus" class="mr-2" /> Publikasikan Hasil Rapat
          </button>
        </div>
      </div>

      <div class="col-span-7 bg-white border border-slate-200/70 rounded-2xl p-6 shadow-xs h-fit">
        <h3 class="text-xs font-black uppercase tracking-widest text-slate-800 mb-4 flex items-center gap-2">
          <font-awesome-icon icon="file-alt" class="text-teal-500 text-sm" /> Hasil Rapat Terpublikasi
        </h3>
        <div class="space-y-1">
          <div v-if="!socialStore.hasilRapat || socialStore.hasilRapat.length === 0" class="text-center py-8 text-xs text-slate-400 font-bold uppercase tracking-wider">
            Belum ada hasil rapat terpublikasi
          </div>
          <div v-else v-for="rapat in socialStore.hasilRapat" :key="rapat.id" class="py-4 flex items-start justify-between gap-4 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 px-2 rounded-lg transition-colors">
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center flex-shrink-0 shadow-sm border border-teal-100 mt-0.5">
                <font-awesome-icon icon="file-alt" class="text-sm" />
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="text-xs font-black text-slate-800 leading-tight uppercase">{{ rapat.judul }}</h4>
                <div class="flex items-center gap-x-3 gap-y-1.5 mt-2 text-[10px] text-slate-500 font-medium">
                  <span class="bg-teal-50 border border-teal-100 text-teal-700 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider">Keputusan</span>
                  <span class="flex items-center gap-1">📅 {{ rapat.tanggal }}</span>
                  <span class="w-1 h-1 rounded-full bg-slate-300"></span>
                  <span class="flex items-center gap-1">👥 {{ rapat.peserta || 15 }} Peserta</span>
                </div>
                <ul class="mt-3.5 space-y-2 text-[11px] text-slate-600 font-semibold list-inside pl-1">
                  <li v-for="(kep, kIdx) in rapat.keputusan" :key="kIdx" class="flex items-start gap-2">
                    <span class="text-emerald-500 font-black flex-shrink-0">•</span>
                    <span>{{ kep }}</span>
                  </li>
                </ul>
              </div>
            </div>
            <button @click="deleteRapat(rapat.id)" class="p-2.5 bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-600 hover:text-white rounded-md transition-colors cursor-pointer flex-shrink-0 shadow-2xs mt-0.5">
              <font-awesome-icon icon="trash" class="text-xs" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
