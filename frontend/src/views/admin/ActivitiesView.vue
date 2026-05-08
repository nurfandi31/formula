<script setup>
import { ref } from 'vue'
import AdminLayout from '../../layouts/AdminLayout.vue'
import { useSocialStore } from '../../stores/social'
import DatePicker from 'primevue/datepicker'
import Select from 'primevue/select'
import Swal from 'sweetalert2'

const socialStore = useSocialStore()

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
    Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Agenda kegiatan berhasil diterbitkan!', timer: 1500, showConfirmButton: false })
  } else {
    Swal.fire({ icon: 'error', title: 'Gagal', text: 'Gagal menyimpan agenda ke database!', confirmButtonColor: '#10b981' })
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
    Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Hasil keputusan rapat berhasil dipublikasi!', timer: 1500, showConfirmButton: false })
  } else {
    Swal.fire({ icon: 'error', title: 'Gagal', text: 'Gagal menyimpan hasil rapat ke database!', confirmButtonColor: '#10b981' })
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
        Swal.fire({ icon: 'success', title: 'Terhapus', text: 'Agenda berhasil dihapus.', timer: 1500, showConfirmButton: false })
      } else {
        Swal.fire({ icon: 'error', title: 'Gagal', text: 'Gagal menghapus agenda dari database!', confirmButtonColor: '#10b981' })
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
        Swal.fire({ icon: 'success', title: 'Terhapus', text: 'Hasil rapat berhasil dihapus.', timer: 1500, showConfirmButton: false })
      } else {
        Swal.fire({ icon: 'error', title: 'Gagal', text: 'Gagal menghapus hasil rapat dari database!', confirmButtonColor: '#10b981' })
      }
    }
  })
}
</script>

<template>
  <AdminLayout>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div class="bg-slate-900/60 border border-slate-900 rounded-lg p-6">
        <h3 class="text-xs font-black uppercase tracking-widest text-white mb-6">Tambah Agenda Kegiatan Baru</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Judul Kegiatan</label>
            <input v-model="agendaJudul" type="text" placeholder="Contoh: Bakti Sosial Kebersihan Dusun" class="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500">
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Tanggal Kegiatan</label>
              <DatePicker v-model="agendaTanggal" class="w-full text-xs" dateFormat="dd/mm/yy" placeholder="Pilih Tanggal" />
            </div>
            <div>
              <label class="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Waktu / Jam</label>
              <input v-model="agendaJam" type="text" placeholder="Contoh: 08:00 - Selesai" class="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500">
            </div>
          </div>
          <div>
            <label class="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Lokasi Kegiatan</label>
            <input v-model="agendaLokasi" type="text" placeholder="Contoh: Balai Dusun Ngampon" class="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500">
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Kategori</label>
              <Select v-model="agendaKategori" :options="kategoriOptions" optionLabel="label" optionValue="value" placeholder="Pilih Kategori" class="w-full text-xs" />
            </div>
            <div>
              <label class="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Warna Aksen</label>
              <Select v-model="agendaWarna" :options="warnaOptions" optionLabel="label" optionValue="value" placeholder="Pilih Warna" class="w-full text-xs" />
            </div>
          </div>
          <button @click="addAgenda" class="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer">
            <font-awesome-icon icon="plus" class="mr-2" /> Terbitkan Agenda
          </button>
        </div>
      </div>

      <div class="bg-slate-900/60 border border-slate-900 rounded-lg p-6">
        <h3 class="text-xs font-black uppercase tracking-widest text-white mb-6">Input Hasil Rapat Pengurus</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Judul Rapat</label>
            <input v-model="rapatJudul" type="text" placeholder="Contoh: Rapat Persiapan Baksos Tahunan" class="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500">
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Tanggal Rapat</label>
              <DatePicker v-model="rapatTanggal" class="w-full text-xs" dateFormat="dd/mm/yy" placeholder="Pilih Tanggal" />
            </div>
            <div>
              <label class="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Jumlah Kehadiran</label>
              <input v-model.number="rapatPesertaCount" type="number" placeholder="15" class="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500">
            </div>
          </div>
          <div>
            <label class="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Butir Keputusan Rapat</label>
            <div class="space-y-2 max-h-48 overflow-y-auto pr-1">
              <div v-for="(keputusan, index) in rapatKeputusanList" :key="index" class="flex gap-2">
                <input v-model="rapatKeputusanList[index]" type="text" :placeholder="'Keputusan ' + (index + 1)" class="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500">
                <button @click="removeKeputusanInput(index)" class="p-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl hover:bg-rose-500 hover:text-white transition-all cursor-pointer">
                  <font-awesome-icon icon="trash" />
                </button>
              </div>
            </div>
            <button @click="addKeputusanInput" class="mt-2 text-[10px] font-black uppercase tracking-wider text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer">
              + Tambah Keputusan
            </button>
          </div>
          <button @click="publishRapat" class="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer">
            <font-awesome-icon icon="plus" class="mr-2" /> Publikasikan Hasil Rapat
          </button>
        </div>
      </div>
    </div>

    <div class="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div class="bg-slate-900/60 border border-slate-900 rounded-lg p-6">
        <h3 class="text-xs font-black uppercase tracking-widest text-white mb-4">Agenda Terpublikasi</h3>
        <div class="divide-y divide-slate-800/40">
          <div v-for="agenda in socialStore.agendaKegiatan" :key="agenda.id" class="py-3 flex justify-between items-center">
            <div>
              <p class="text-xs font-black text-white leading-tight uppercase">{{ agenda.judul }}</p>
              <p class="text-[10px] text-slate-500 mt-1">📅 {{ agenda.tanggal }} | 🕐 {{ agenda.jam }}</p>
            </div>
            <button @click="deleteAgenda(agenda.id)" class="p-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white rounded-xl transition-all cursor-pointer">
              <font-awesome-icon icon="trash" />
            </button>
          </div>
        </div>
      </div>

      <div class="bg-slate-900/60 border border-slate-900 rounded-lg p-6">
        <h3 class="text-xs font-black uppercase tracking-widest text-white mb-4">Hasil Rapat Terpublikasi</h3>
        <div class="divide-y divide-slate-800/40">
          <div v-for="rapat in socialStore.hasilRapat" :key="rapat.id" class="py-3 flex justify-between items-center">
            <div>
              <p class="text-xs font-black text-white leading-tight uppercase">{{ rapat.judul }}</p>
              <p class="text-[10px] text-slate-500 mt-1">📅 Rapat {{ rapat.tanggal }} | 👥 {{ rapat.peserta }} Peserta</p>
            </div>
            <button @click="deleteRapat(rapat.id)" class="p-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white rounded-xl transition-all cursor-pointer">
              <font-awesome-icon icon="trash" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>
