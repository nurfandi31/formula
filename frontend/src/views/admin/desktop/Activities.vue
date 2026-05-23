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

const selectedActivityForQr = ref(null)
const isQrModalOpen = ref(false)

const openQrModal = (activity) => {
  selectedActivityForQr.value = activity
  isQrModalOpen.value = true
}

const closeQrModal = () => {
  isQrModalOpen.value = false
  selectedActivityForQr.value = null
}

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
    <div class="bg-white border border-slate-200/70 rounded-2xl shadow-xs mb-5 grid grid-cols-2 divide-x divide-slate-250 overflow-hidden">
      <button 
        @click="activeTab = 'agenda'" 
        :class="[
          'flex items-center gap-3.5 py-3 px-4 text-left cursor-pointer transition-all duration-300 outline-none border-b-2',
          activeTab === 'agenda' 
            ? 'bg-emerald-50/15 border-b-emerald-500 font-black' 
            : 'bg-white border-b-transparent hover:bg-slate-50/50'
        ]"
      >
        <div :class="[
          'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border transition-all duration-300',
          activeTab === 'agenda' 
            ? 'bg-emerald-500 border-emerald-400 text-white shadow-sm shadow-emerald-500/10' 
            : 'bg-slate-50 border-slate-200 text-slate-500'
        ]">
          <font-awesome-icon icon="calendar" class="text-xs" />
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
          <p class="text-[9px] text-slate-500 mt-0.5 font-semibold leading-snug">Kelola jadwal, koordinasi kerja bakti, olahraga, dan agenda dusun.</p>
        </div>
      </button>

      <button 
        @click="activeTab = 'rapat'" 
        :class="[
          'flex items-center gap-3.5 py-3 px-4 text-left cursor-pointer transition-all duration-300 outline-none border-b-2',
          activeTab === 'rapat' 
            ? 'bg-teal-50/15 border-b-teal-500 font-black' 
            : 'bg-white border-b-transparent hover:bg-slate-50/50'
        ]"
      >
        <div :class="[
          'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border transition-all duration-300',
          activeTab === 'rapat' 
            ? 'bg-teal-500 border-teal-400 text-white shadow-sm shadow-teal-500/10' 
            : 'bg-slate-50 border-slate-200 text-slate-500'
        ]">
          <font-awesome-icon icon="file-alt" class="text-xs" />
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
          <p class="text-[9px] text-slate-500 mt-0.5 font-semibold leading-snug">Publikasikan keputusan, notulen musyawarah, dan jumlah kehadiran rapat.</p>
        </div>
      </button>
    </div>

    <div v-if="activeTab === 'agenda'" class="grid grid-cols-12 gap-8">
      <div class="col-span-5 bg-white border border-slate-200/70 rounded-2xl p-5 shadow-xs h-fit">
        <h3 class="text-xs font-black uppercase tracking-widest text-slate-800 mb-4 flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-emerald-500"></span> Tambah Agenda Kegiatan Baru
        </h3>
        <div class="space-y-3">
          <div>
            <label class="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">Judul Kegiatan</label>
            <input v-model="agendaJudul" type="text" placeholder="Contoh: Bakti Sosial Kebersihan Dusun" class="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-md text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500">
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">Tanggal Kegiatan</label>
              <DatePicker v-model="agendaTanggal" dateFormat="dd/mm/yy" placeholder="Pilih Tanggal" class="w-full rounded-md" inputClass="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-md text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
            </div>
            <div>
              <label class="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">Waktu / Jam</label>
              <input v-model="agendaJam" type="text" placeholder="Contoh: 08:00 - Selesai" class="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-md text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500">
            </div>
          </div>
          <div>
            <label class="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">Lokasi Kegiatan</label>
            <input v-model="agendaLokasi" type="text" placeholder="Contoh: Balai Dusun Ngampon" class="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-md text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500">
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">Kategori</label>
              <Select v-model="agendaKategori" :options="kategoriOptions" optionLabel="label" optionValue="value" placeholder="Pilih Kategori" class="w-full text-xs rounded-md" />
            </div>
            <div>
              <label class="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">Warna Aksen</label>
              <Select v-model="agendaWarna" :options="warnaOptions" optionLabel="label" optionValue="value" placeholder="Pilih Warna" class="w-full text-xs rounded-md" />
            </div>
          </div>
          <button @click="addAgenda" class="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-black text-xs uppercase tracking-widest transition-all cursor-pointer">
            <font-awesome-icon icon="plus" class="mr-2" /> Terbitkan Agenda
          </button>
        </div>
      </div>

      <div class="col-span-7 bg-white border border-slate-200/70 rounded-2xl p-5 shadow-xs h-fit">
        <h3 class="text-xs font-black uppercase tracking-widest text-slate-800 mb-4 flex items-center gap-2">
          <font-awesome-icon icon="calendar" class="text-emerald-500 text-sm" /> Agenda Terpublikasi
        </h3>
        <div class="space-y-1">
          <div v-if="!socialStore.agendaKegiatan || socialStore.agendaKegiatan.length === 0" class="text-center py-8 text-xs text-slate-400 font-bold uppercase tracking-wider">
            Belum ada agenda terpublikasi
          </div>
          <div v-else v-for="agenda in socialStore.agendaKegiatan" :key="agenda.id" class="py-3 flex items-center justify-between gap-4 px-3 rounded-xl transition-all hover:bg-slate-50 hover:shadow-sm">
            <div class="flex items-center gap-3 flex-1 min-w-0">
              <div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 shadow-sm border border-emerald-100">
                <font-awesome-icon icon="calendar" class="text-xs" />
              </div>
              <div class="flex-1 min-w-0">
                <!-- Row 1: Judul + tanggal + jam -->
                <div class="flex items-center gap-3 flex-wrap">
                  <h4 class="text-xs font-black text-slate-800 uppercase leading-tight">{{ agenda.judul }}</h4>
                  <div class="flex items-center gap-2 text-[9px] text-slate-400 font-semibold whitespace-nowrap">
                    <span>📅 {{ agenda.tanggal }}</span>
                    <span class="w-1 h-1 rounded-full bg-slate-300 flex-shrink-0"></span>
                    <span>🕐 {{ agenda.jam || '08:00 - Selesai' }}</span>
                  </div>
                </div>
                <!-- Row 2: badge + PIN -->
                <div class="flex items-center gap-2 mt-1">
                  <span class="bg-slate-100 border border-slate-200 text-slate-600 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider">{{ agenda.kategori || 'Umum' }}</span>
                  <span class="text-[9px] text-slate-500 font-medium flex items-center gap-1">🔑 PIN: <strong class="text-slate-800 font-black font-mono bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200">{{ agenda.passcode || '1234' }}</strong></span>
                </div>
              </div>
            </div>
            <div class="flex items-center gap-1.5 flex-shrink-0">
              <button @click="openQrModal(agenda)" class="w-8 h-8 bg-emerald-50 border border-emerald-100 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-md transition-colors cursor-pointer shadow-2xs flex items-center justify-center">
                <font-awesome-icon icon="qrcode" class="text-xs" />
              </button>
              <button @click="deleteAgenda(agenda.id)" class="w-8 h-8 bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-600 hover:text-white rounded-md transition-colors cursor-pointer shadow-2xs flex items-center justify-center">
                <font-awesome-icon icon="trash" class="text-xs" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'rapat'" class="grid grid-cols-12 gap-8">
      <div class="col-span-5 bg-white border border-slate-200/70 rounded-2xl p-5 shadow-xs h-fit">
        <h3 class="text-xs font-black uppercase tracking-widest text-slate-800 mb-4 flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-teal-500"></span> Input Hasil Rapat Pengurus
        </h3>
        <div class="space-y-3">
          <div>
            <label class="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">Judul Rapat</label>
            <input v-model="rapatJudul" type="text" placeholder="Contoh: Rapat Persiapan Baksos Tahunan" class="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-md text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500">
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">Tanggal Rapat</label>
              <DatePicker v-model="rapatTanggal" dateFormat="dd/mm/yy" placeholder="Pilih Tanggal" class="w-full rounded-md" inputClass="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-md text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
            </div>
            <div>
              <label class="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">Jumlah Kehadiran</label>
              <input v-model.number="rapatPesertaCount" type="number" placeholder="15" class="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-md text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500">
            </div>
          </div>
          <div>
            <label class="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1">Butir Keputusan Rapat</label>
            <div class="space-y-2 max-h-36 overflow-y-auto pr-1">
              <div v-for="(keputusan, index) in rapatKeputusanList" :key="index" class="flex gap-2 items-center">
                <input v-model="rapatKeputusanList[index]" type="text" :placeholder="'Keputusan ' + (index + 1)" class="flex-1 px-3 py-2.5 bg-white border border-slate-200 rounded-md text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500">
                <button @click="removeKeputusanInput(index)" class="p-2 bg-rose-50 border border-rose-250 text-rose-700 rounded-lg hover:bg-rose-600 hover:text-white transition-all cursor-pointer flex items-center justify-center w-8 h-8 flex-shrink-0">
                  <font-awesome-icon icon="trash" class="text-xs" />
                </button>
              </div>
            </div>
            <button @click="addKeputusanInput" class="mt-2 text-[10px] font-black uppercase tracking-wider text-emerald-600 hover:text-emerald-700 transition-colors cursor-pointer flex items-center gap-1">
              <font-awesome-icon icon="plus" /> Tambah Keputusan
            </button>
          </div>
          <button @click="publishRapat" class="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-md font-black text-xs uppercase tracking-widest transition-all cursor-pointer">
            <font-awesome-icon icon="plus" class="mr-2" /> Publikasikan Hasil Rapat
          </button>
        </div>
      </div>

      <div class="col-span-7 bg-white border border-slate-200/70 rounded-2xl p-5 shadow-xs h-fit">
        <h3 class="text-xs font-black uppercase tracking-widest text-slate-800 mb-4 flex items-center gap-2">
          <font-awesome-icon icon="file-alt" class="text-teal-500 text-sm" /> Hasil Rapat Terpublikasi
        </h3>
        <div class="space-y-1">
          <div v-if="!socialStore.hasilRapat || socialStore.hasilRapat.length === 0" class="text-center py-8 text-xs text-slate-400 font-bold uppercase tracking-wider">
            Belum ada hasil rapat terpublikasi
          </div>
          <div v-else v-for="rapat in socialStore.hasilRapat" :key="rapat.id" class="py-3 flex items-start justify-between gap-4 px-3 rounded-xl transition-all hover:bg-slate-50 hover:shadow-sm">
            <div class="flex items-start gap-3 flex-1 min-w-0">
              <div class="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center flex-shrink-0 shadow-sm border border-teal-100 mt-0.5">
                <font-awesome-icon icon="file-alt" class="text-xs" />
              </div>
              <div class="flex-1 min-w-0">
                <!-- Row 1: Judul + tanggal + peserta -->
                <div class="flex items-center gap-3 flex-wrap">
                  <h4 class="text-xs font-black text-slate-800 uppercase leading-tight">{{ rapat.judul }}</h4>
                  <div class="flex items-center gap-2 text-[9px] text-slate-400 font-semibold whitespace-nowrap">
                    <span>📅 {{ rapat.tanggal }}</span>
                    <span class="w-1 h-1 rounded-full bg-slate-300 flex-shrink-0"></span>
                    <span>👥 {{ rapat.peserta || 15 }} Peserta</span>
                  </div>
                </div>
                <!-- Row 2: badge + PIN -->
                <div class="flex items-center gap-2 mt-1">
                  <span class="bg-teal-50 border border-teal-100 text-teal-700 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider">Keputusan</span>
                  <span class="text-[9px] text-slate-500 font-medium flex items-center gap-1">🔑 PIN: <strong class="font-black font-mono bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded border border-teal-200">{{ rapat.passcode || '1234' }}</strong></span>
                </div>
                <!-- Keputusan list -->
                <ul class="mt-2 space-y-1 text-[11px] text-slate-600 font-semibold pl-1">
                  <li v-for="(kep, kIdx) in rapat.keputusan" :key="kIdx" class="flex items-start gap-2">
                    <span class="text-emerald-500 font-black flex-shrink-0">•</span>
                    <span>{{ kep }}</span>
                  </li>
                </ul>
              </div>
            </div>
            <div class="flex items-center gap-1.5 flex-shrink-0 mt-0.5">
              <button @click="openQrModal(rapat)" class="w-8 h-8 bg-teal-50 border border-teal-100 text-teal-600 hover:bg-teal-600 hover:text-white rounded-md transition-colors cursor-pointer shadow-2xs flex items-center justify-center">
                <font-awesome-icon icon="qrcode" class="text-xs" />
              </button>
              <button @click="deleteRapat(rapat.id)" class="w-8 h-8 bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-600 hover:text-white rounded-md transition-colors cursor-pointer shadow-2xs flex items-center justify-center">
                <font-awesome-icon icon="trash" class="text-xs" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal QR Code -->
  <div v-if="isQrModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
    <div class="bg-white border border-slate-200/80 rounded-2xl p-6 max-w-sm w-full shadow-2xl relative flex flex-col items-center">
      <button @click="closeQrModal" class="absolute top-4 right-4 text-slate-400 hover:text-slate-650 cursor-pointer">
        <font-awesome-icon icon="times" />
      </button>
      
      <div class="text-center w-full mb-4">
        <h4 class="text-xs font-black text-slate-800 uppercase tracking-widest leading-tight">QR Code Absensi Mandiri</h4>
        <p class="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1">{{ selectedActivityForQr?.judul }}</p>
      </div>

      <!-- QR Code Image -->
      <div class="bg-slate-50 p-4 border border-slate-100 rounded-xl flex items-center justify-center shadow-inner mb-4">
        <img 
          :src="`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=FORMULA_ABSENSI:${selectedActivityForQr?.judul}:${selectedActivityForQr?.passcode || '1234'}`" 
          alt="QR Code Absensi" 
          class="w-48 h-48"
        />
      </div>

      <div class="text-center bg-slate-100 border border-slate-200 rounded-xl px-4 py-2 w-full mb-5">
        <span class="text-[10px] text-slate-500 font-black uppercase tracking-wider block">PIN Kegiatan</span>
        <strong class="text-lg font-mono font-black text-emerald-600 tracking-widest">{{ selectedActivityForQr?.passcode || '1234' }}</strong>
      </div>

      <button @click="closeQrModal" class="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest cursor-pointer transition-all active:scale-95">
        Tutup
      </button>
    </div>
  </div>
</template>
