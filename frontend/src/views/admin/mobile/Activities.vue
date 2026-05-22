<script setup>
import { ref } from 'vue'
import { useSocialStore } from '../../../stores/social'
import DatePicker from 'primevue/datepicker'
import Select from 'primevue/select'
import Swal from 'sweetalert2'

const socialStore = useSocialStore()
const activeTab = ref('agenda')

const agendaJudul = ref('')
const agendaTanggal = ref(null)
const agendaJam = ref('')
const agendaLokasi = ref('')
const agendaKategori = ref('Rapat')

const isAddAgendaOpen = ref(false)
const isAddRapatOpen = ref(false)

const kategoriOptions = ref([
  { label: 'Rapat', value: 'Rapat' },
  { label: 'Sosial', value: 'Sosial' },
  { label: 'Olahraga', value: 'Olahraga' },
  { label: 'Keagamaan', value: 'Keagamaan' }
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
    Swal.fire({ icon: 'warning', title: 'Data Belum Lengkap', text: 'Silakan isi seluruh formulir agenda!', confirmButtonColor: '#10b981' })
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
    isAddAgendaOpen.value = false
    Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Agenda berhasil diterbitkan!', timer: 1500, showConfirmButton: false })
  } else {
    Swal.fire({ icon: 'error', title: 'Gagal', text: 'Gagal menyimpan agenda!', confirmButtonColor: '#10b981' })
  }
}

const publishRapat = async () => {
  const filteredKeputusan = rapatKeputusanList.value.filter(k => k.trim() !== '')

  if (!rapatJudul.value.trim() || !rapatTanggal.value || filteredKeputusan.length === 0) {
    Swal.fire({ icon: 'warning', title: 'Data Belum Lengkap', text: 'Silakan isi judul, tanggal, dan minimal satu keputusan rapat!', confirmButtonColor: '#10b981' })
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
    isAddRapatOpen.value = false
    Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Hasil rapat berhasil dipublikasi!', timer: 1500, showConfirmButton: false })
  } else {
    Swal.fire({ icon: 'error', title: 'Gagal', text: 'Gagal menyimpan hasil rapat!', confirmButtonColor: '#10b981' })
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
    confirmButtonText: 'Hapus'
  }).then(async (result) => {
    if (result.isConfirmed) {
      const res = await socialStore.deleteActivity(id)
      if (res.success) {
        Swal.fire({ icon: 'success', title: 'Terhapus', text: 'Agenda berhasil dihapus.', timer: 1500, showConfirmButton: false })
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
    confirmButtonText: 'Hapus'
  }).then(async (result) => {
    if (result.isConfirmed) {
      const res = await socialStore.deleteActivity(id)
      if (res.success) {
        Swal.fire({ icon: 'success', title: 'Terhapus', text: 'Hasil rapat berhasil dihapus.', timer: 1500, showConfirmButton: false })
      }
    }
  })
}
</script>

<template>
  <div class="space-y-6">
    <div class="p-1 bg-slate-200/60 rounded-2xl flex">
      <button 
        @click="activeTab = 'agenda'"
        :class="['flex-1 py-3 text-center rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer', activeTab === 'agenda' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500']"
      >
        Agenda ({{ socialStore.agendaKegiatan.length }})
      </button>
      <button 
        @click="activeTab = 'rapat'"
        :class="['flex-1 py-3 text-center rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer', activeTab === 'rapat' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500']"
      >
        Hasil Rapat ({{ socialStore.hasilRapat.length }})
      </button>
    </div>

    <div v-if="activeTab === 'agenda'" class="space-y-4">
      <button @click="isAddAgendaOpen = true" class="w-full py-4 bg-emerald-600 active:bg-emerald-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-md flex items-center justify-center gap-2">
        <font-awesome-icon icon="plus" /> Buat Agenda Baru
      </button>

      <div class="space-y-3">
        <div 
          v-for="agenda in socialStore.agendaKegiatan" 
          :key="agenda.id"
          class="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between gap-4 shadow-xs"
        >
          <div class="flex justify-between items-start gap-4">
            <div class="space-y-1">
              <h4 class="text-xs font-black text-slate-800 leading-snug uppercase">{{ agenda.judul }}</h4>
              <p class="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{{ agenda.kategori || 'Umum' }}</p>
            </div>
            <button @click="deleteAgenda(agenda.id)" class="w-7 h-7 bg-rose-50 text-rose-600 rounded-lg flex items-center justify-center">
              <font-awesome-icon icon="trash" class="text-[10px]" />
            </button>
          </div>

          <div class="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-[9px] text-slate-500 font-semibold uppercase tracking-wider">
            <div class="flex items-center gap-1.5">
              <span>📅</span> <span>{{ agenda.tanggal }}</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span>🕐</span> <span>{{ agenda.jam || '08:00' }}</span>
            </div>
          </div>
        </div>

        <div v-if="socialStore.agendaKegiatan.length === 0" class="p-8 text-center text-slate-400 font-bold text-xs uppercase tracking-wide">
          Belum ada agenda
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'rapat'" class="space-y-4">
      <button @click="isAddRapatOpen = true" class="w-full py-4 bg-teal-600 active:bg-teal-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-md flex items-center justify-center gap-2">
        <font-awesome-icon icon="plus" /> Input Hasil Rapat
      </button>

      <div class="space-y-3">
        <div 
          v-for="rapat in socialStore.hasilRapat" 
          :key="rapat.id"
          class="bg-white border border-slate-200/80 rounded-2xl p-5 flex flex-col gap-4 shadow-xs"
        >
          <div class="flex justify-between items-start gap-4">
            <div class="space-y-1">
              <h4 class="text-xs font-black text-slate-800 leading-snug uppercase">{{ rapat.judul }}</h4>
              <div class="flex gap-3 text-[8px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                <span>📅 {{ rapat.tanggal }}</span>
                <span>👥 {{ rapat.peserta || 15 }} Peserta</span>
              </div>
            </div>
            <button @click="deleteRapat(rapat.id)" class="w-7 h-7 bg-rose-50 text-rose-600 rounded-lg flex items-center justify-center mt-0.5">
              <font-awesome-icon icon="trash" class="text-[10px]" />
            </button>
          </div>

          <div class="pt-3 border-t border-slate-100">
            <h5 class="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2">Keputusan Hasil Rapat</h5>
            <ul class="space-y-1.5 text-[10px] text-slate-650 font-semibold pl-0.5">
              <li v-for="(kep, kIdx) in rapat.keputusan" :key="kIdx" class="flex gap-2">
                <span class="text-emerald-500 font-black flex-shrink-0">•</span>
                <span>{{ kep }}</span>
              </li>
            </ul>
          </div>
        </div>

        <div v-if="socialStore.hasilRapat.length === 0" class="p-8 text-center text-slate-400 font-bold text-xs uppercase tracking-wide">
          Belum ada hasil rapat
        </div>
      </div>
    </div>

    <div v-if="isAddAgendaOpen" class="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-end justify-center">
      <div class="fixed inset-0" @click="isAddAgendaOpen = false"></div>
      
      <div class="bg-white w-full rounded-t-3xl p-6 space-y-4 relative z-10 shadow-2xl border-t border-slate-100 animate-in slide-in-from-bottom duration-300">
        <div class="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-2"></div>
        
        <div class="flex justify-between items-center pb-2 border-b border-slate-100">
          <h3 class="text-xs font-black uppercase tracking-widest text-slate-800">Buat Agenda Baru</h3>
          <button @click="isAddAgendaOpen = false" class="text-slate-400 hover:text-slate-600 font-bold text-sm">✕</button>
        </div>

        <div class="space-y-4 py-2">
          <div>
            <label class="block text-[8px] font-black uppercase tracking-wider text-slate-500 mb-1">Judul Agenda</label>
            <input v-model="agendaJudul" type="text" placeholder="Contoh: Rapat Koordinasi..." class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800">
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-[8px] font-black uppercase tracking-wider text-slate-500 mb-1">Tanggal</label>
              <DatePicker v-model="agendaTanggal" dateFormat="dd/mm/yy" class="w-full rounded-xl" inputClass="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800" />
            </div>
            <div>
              <label class="block text-[8px] font-black uppercase tracking-wider text-slate-500 mb-1">Waktu</label>
              <input v-model="agendaJam" type="text" placeholder="Contoh: 08:00 - selesai" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800">
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-[8px] font-black uppercase tracking-wider text-slate-500 mb-1">Lokasi</label>
              <input v-model="agendaLokasi" type="text" placeholder="Contoh: Balai Dusun" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800">
            </div>
            <div>
              <label class="block text-[8px] font-black uppercase tracking-wider text-slate-500 mb-1">Kategori</label>
              <Select v-model="agendaKategori" :options="kategoriOptions" optionLabel="label" optionValue="value" class="w-full text-xs rounded-xl" />
            </div>
          </div>

          <button @click="addAgenda" class="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer">
            Terbitkan Agenda
          </button>
        </div>
      </div>
    </div>

    <div v-if="isAddRapatOpen" class="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-end justify-center">
      <div class="fixed inset-0" @click="isAddRapatOpen = false"></div>
      
      <div class="bg-white w-full rounded-t-3xl p-6 space-y-4 relative z-10 shadow-2xl border-t border-slate-100 animate-in slide-in-from-bottom duration-300">
        <div class="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-2"></div>
        
        <div class="flex justify-between items-center pb-2 border-b border-slate-100">
          <h3 class="text-xs font-black uppercase tracking-widest text-slate-800">Input Hasil Rapat</h3>
          <button @click="isAddRapatOpen = false" class="text-slate-400 hover:text-slate-600 font-bold text-sm">✕</button>
        </div>

        <div class="space-y-4 py-2">
          <div>
            <label class="block text-[8px] font-black uppercase tracking-wider text-slate-500 mb-1">Judul Rapat</label>
            <input v-model="rapatJudul" type="text" placeholder="Contoh: Rapat Musyawarah..." class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800">
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-[8px] font-black uppercase tracking-wider text-slate-500 mb-1">Tanggal</label>
              <DatePicker v-model="rapatTanggal" dateFormat="dd/mm/yy" class="w-full rounded-xl" inputClass="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800" />
            </div>
            <div>
              <label class="block text-[8px] font-black uppercase tracking-wider text-slate-500 mb-1">Jumlah Peserta</label>
              <input v-model.number="rapatPesertaCount" type="number" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800">
            </div>
          </div>

          <div>
            <label class="block text-[8px] font-black uppercase tracking-wider text-slate-500 mb-1">Butir Keputusan</label>
            <div class="space-y-2 max-h-36 overflow-y-auto pr-1">
              <div v-for="(keputusan, index) in rapatKeputusanList" :key="index" class="flex gap-2 items-center">
                <input v-model="rapatKeputusanList[index]" type="text" :placeholder="'Keputusan ' + (index + 1)" class="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800">
                <button @click="removeKeputusanInput(index)" class="w-8 h-8 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  ✕
                </button>
              </div>
            </div>
            <button @click="addKeputusanInput" class="mt-2 text-[8px] font-black uppercase tracking-wider text-emerald-600 flex items-center gap-1">
              + Tambah Keputusan
            </button>
          </div>

          <button @click="publishRapat" class="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer">
            Publikasikan Hasil Rapat
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
