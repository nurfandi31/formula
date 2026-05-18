<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import AdminLayout from '../../layouts/AdminLayout.vue'
import { useSocialStore } from '../../stores/social'
import Select from 'primevue/select'
import Swal from 'sweetalert2'

const socialStore = useSocialStore()

const activityOptions = computed(() => {
  const list = []
  
  if (socialStore.agendaKegiatan && socialStore.agendaKegiatan.length > 0) {
    socialStore.agendaKegiatan.forEach(a => {
      list.push({ label: `[AGENDA] ${a.judul}`, value: a.judul })
    })
  }
  
  if (socialStore.hasilRapat && socialStore.hasilRapat.length > 0) {
    socialStore.hasilRapat.forEach(r => {
      list.push({ label: `[RAPAT] ${r.judul}`, value: r.judul })
    })
  }

  if (list.length === 0) {
    list.push({ label: 'Rapat Kerja FORMULA', value: 'Rapat Kerja FORMULA' })
  }

  return list
})

const currentActivity = ref('')

onMounted(() => {
  if (activityOptions.value.length > 0) {
    currentActivity.value = activityOptions.value[0].value
  }
})

watch(currentActivity, async (newVal) => {
  if (newVal) {
    await socialStore.fetchAttendance(newVal)
  }
}, { immediate: true })

const searchQuery = ref('')
const perPage = ref(10)

const filteredMembersList = computed(() => {
  let list = Object.values(socialStore.users).filter(u => u.role === 'anggota')
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    list = list.filter(u => u.name.toLowerCase().includes(q) || u.title.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
  }
  return list.slice(0, perPage.value)
})

const getStatus = (email) => {
  if (!currentActivity.value) return 'Alfa'
  if (!socialStore.absensi[currentActivity.value]) {
    socialStore.absensi[currentActivity.value] = {}
  }
  return socialStore.absensi[currentActivity.value][email] || 'Alfa'
}

const setStatus = (email, status) => {
  if (!currentActivity.value) return
  if (!socialStore.absensi[currentActivity.value]) {
    socialStore.absensi[currentActivity.value] = {}
  }
  socialStore.absensi[currentActivity.value][email] = status
}

const saveAttendance = async () => {
  if (!currentActivity.value) {
    Swal.fire({ icon: 'warning', title: 'Perhatian', text: 'Tidak ada kegiatan yang aktif!' })
    return
  }
  
  const current = currentActivity.value
  const map = {}
  filteredMembersList.value.forEach(m => {
    map[m.email] = getStatus(m.email)
  })
  
  const res = await socialStore.saveAttendance(current, map)
  if (res.success) {
    Swal.fire({ icon: 'success', title: 'Berhasil Disimpan', text: `Presensi untuk ${current} disimpan ke database!`, timer: 1500, showConfirmButton: false })
  } else {
    Swal.fire({ icon: 'error', title: 'Gagal', text: 'Gagal menyimpan absensi ke database!' })
  }
}

const printAttendance = () => {
  window.print()
}
</script>

<template>
  <AdminLayout>
    <div class="bg-slate-900/60 border border-slate-900 rounded-lg p-6 print:border-0 print:bg-transparent print:p-0">
      <div class="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-6 pb-6 border-b border-slate-800/60 print:hidden">
        <div>
          <h3 class="text-xs font-black uppercase tracking-widest text-white">Sistem Presensi Kehadiran</h3>
          <p class="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">Pilih Kegiatan untuk Mencatat Absensi</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-3 w-full xl:w-auto items-center">
          <div class="flex items-center justify-between sm:justify-start gap-2 bg-slate-950/60 border border-slate-850 px-3 py-2.5 rounded-xl">
            <span class="text-[10px] font-black uppercase tracking-wider text-slate-500">Tampilkan</span>
            <Select v-model="perPage" :options="[5, 10, 25, 50, 100]" class="w-16 text-xs bg-transparent border-none text-slate-300" />
          </div>
          <input v-model="searchQuery" type="text" placeholder="Cari pengurus..." class="px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 w-full lg:w-40">
          <Select v-model="currentActivity" :options="activityOptions" optionLabel="label" optionValue="value" class="w-full lg:w-64 text-xs bg-slate-950 border border-slate-800 rounded-xl" />
          <button @click="printAttendance" class="px-4 py-3.5 bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 w-full lg:w-auto">
            <font-awesome-icon icon="print" /> Cetak Absensi
          </button>
        </div>
      </div>

      <div class="hidden print:block text-slate-950 p-6 text-center border-b border-slate-300">
        <h2 class="text-xl font-bold uppercase tracking-wide text-slate-900">Rekapitulasi Kehadiran Pengurus</h2>
        <p class="text-sm mt-1">Kegiatan: {{ currentActivity }} | FORMULA Dusun Ngampon</p>
      </div>

      <div class="grid grid-cols-1 gap-4 md:hidden print:hidden mb-6">
        <div 
          v-for="(member, index) in filteredMembersList" 
          :key="member.email" 
          class="bg-slate-950/40 border border-slate-850/80 rounded-[2rem] p-5 space-y-4"
        >
          <div class="flex items-center gap-3">
            <img :src="member.avatar" class="w-10 h-10 rounded-full object-cover border border-slate-800 flex-shrink-0">
            <div class="min-w-0">
              <span class="font-black text-xs text-slate-200 block truncate">{{ member.name }}</span>
              <span class="text-[9px] text-slate-500 block truncate">{{ member.email }}</span>
              <span class="inline-block px-2 py-0.5 mt-1 bg-slate-900 border border-slate-850 text-slate-400 rounded-md text-[9px] font-bold uppercase tracking-wider">{{ member.title }}</span>
            </div>
            <span class="ml-auto text-xs font-bold text-slate-600">#{{ index + 1 }}</span>
          </div>

          <div class="grid grid-cols-4 gap-1.5 pt-2 border-t border-slate-900">
            <button 
              v-for="status in ['Hadir', 'Sakit', 'Izin', 'Alfa']" 
              :key="status" 
              @click="setStatus(member.email, status)"
              :class="['py-2.5 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer text-center', getStatus(member.email) === status ? (status === 'Hadir' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : status === 'Alfa' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30') : 'bg-slate-950 text-slate-600 border border-slate-900 hover:text-slate-400']"
            >
              {{ status }}
            </button>
          </div>
        </div>
      </div>

      <div class="p-2 print:p-0 overflow-x-auto hidden md:block print:block">
        <table class="w-full text-left text-xs border-collapse min-w-[600px] md:min-w-0">
          <thead>
            <tr class="text-slate-500 uppercase font-black text-[9px] tracking-widest border-b border-slate-800/40 print:text-slate-700 print:border-slate-300">
              <th class="p-4 print:py-2">No</th>
              <th class="p-4 print:py-2">Nama Pengurus</th>
              <th class="p-4 print:py-2">Jabatan</th>
              <th class="p-4 print:py-2 text-center">Status Kehadiran</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/40 print:divide-slate-300 print:text-slate-900">
            <tr v-for="(member, index) in filteredMembersList" :key="member.email" class="hover:bg-slate-800/10 transition-colors">
              <td class="p-4 print:py-2">{{ index + 1 }}</td>
              <td class="p-4 print:py-2 flex items-center gap-3">
                <img :src="member.avatar" class="w-8 h-8 rounded-full object-cover border border-slate-800 flex-shrink-0 print:hidden">
                <div>
                  <span class="font-bold text-slate-200 print:text-slate-950">{{ member.name }}</span>
                  <span class="text-[10px] text-slate-500 block print:text-slate-700">{{ member.email }}</span>
                </div>
              </td>
              <td class="p-4 print:py-2 text-slate-400 print:text-slate-700">{{ member.title }}</td>
              <td class="p-4 print:py-2 text-center">
                <div class="flex justify-center gap-1.5 print:hidden">
                  <button 
                    v-for="status in ['Hadir', 'Sakit', 'Izin', 'Alfa']" 
                    :key="status" 
                    @click="setStatus(member.email, status)"
                    :class="['px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer', getStatus(member.email) === status ? (status === 'Hadir' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : status === 'Alfa' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30') : 'bg-slate-950 text-slate-600 border border-slate-900 hover:text-slate-400']"
                  >
                    {{ status }}
                  </button>
                </div>
                <span class="hidden print:inline-block font-black uppercase tracking-wider text-xs">
                  {{ getStatus(member.email) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-8 flex justify-end print:hidden">
        <button @click="saveAttendance" class="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer w-full sm:w-auto text-center">
          Simpan Presensi Kehadiran
        </button>
      </div>
    </div>
  </AdminLayout>
</template>
