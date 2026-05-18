<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import AdminLayout from '../../layouts/AdminLayout.vue'
import { useSocialStore } from '../../stores/social'
import Select from 'primevue/select'
import Swal from 'sweetalert2'

const socialStore = useSocialStore()

// Parse agenda and rapat into options list
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

// Paginated & Filtered Member List for visual table
const filteredMembersList = computed(() => {
  let list = Object.values(socialStore.users).filter(u => u.role === 'anggota')
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    list = list.filter(u => u.name.toLowerCase().includes(q) || u.title.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
  }
  return list.slice(0, perPage.value)
})

// Real-time computed attendance statistics based on complete member base
const stats = computed(() => {
  const counts = { Hadir: 0, Sakit: 0, Izin: 0, Alfa: 0 }
  const list = Object.values(socialStore.users).filter(u => u.role === 'anggota')
  list.forEach(m => {
    const status = getStatus(m.email)
    if (counts[status] !== undefined) {
      counts[status]++
    } else {
      counts['Alfa']++ // default status
    }
  })
  return counts
})

// Dynamic details about the currently selected activity
const selectedActivityDetails = computed(() => {
  if (!currentActivity.value) return null
  
  // Try to find in agenda
  const agenda = socialStore.agendaKegiatan?.find(a => a.judul === currentActivity.value)
  if (agenda) {
    return {
      type: 'agenda',
      title: agenda.judul,
      date: agenda.tanggal,
      info: `Lokasi: ${agenda.lokasi} | Jam: ${agenda.jam}`
    }
  }

  // Try to find in rapat
  const rapat = socialStore.hasilRapat?.find(r => r.judul === currentActivity.value)
  if (rapat) {
    return {
      type: 'rapat',
      title: rapat.judul,
      date: rapat.tanggal,
      info: `Rapat Keputusan Musyawarah | Total Kehadiran Rapat: ${rapat.peserta_count || 0} orang`
    }
  }

  return {
    type: 'kegiatan',
    title: currentActivity.value,
    date: '',
    info: 'Presensi Kehadiran FORMULA Dusun Ngampon'
  }
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

// Save complete attendance list securely
const saveAttendance = async () => {
  if (!currentActivity.value) {
    Swal.fire({ icon: 'warning', title: 'Perhatian', text: 'Tidak ada kegiatan yang aktif!' })
    return
  }
  
  const current = currentActivity.value
  const map = {}
  
  // Save ALL members' statuses (instead of just current paginated list) to prevent data overrides!
  const allMembers = Object.values(socialStore.users).filter(u => u.role === 'anggota')
  allMembers.forEach(m => {
    map[m.email] = getStatus(m.email)
  })
  
  const res = await socialStore.saveAttendance(current, map)
  if (res.success) {
    Swal.fire({ icon: 'success', title: 'Berhasil Disimpan', text: `Presensi untuk ${current} berhasil disimpan ke database!`, timer: 1500, showConfirmButton: false })
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
    <div class="bg-white border border-slate-200/70 rounded-lg p-6 print:border-0 print:bg-transparent print:p-0 shadow-xs">
      
      <!-- 1. Header & Controls Controls (Print Hidden) - Single Row -->
      <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 pb-6 border-b border-slate-150 print:hidden">
        <div>
          <h3 class="text-xs font-black uppercase tracking-widest text-slate-800">Sistem Presensi Kehadiran</h3>
          <p class="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">Catat & kelola absensi pengurus FORMULA secara tertib</p>
        </div>
        <div class="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          <!-- Activity Selection (Filter Searchable) -->
          <Select 
            v-model="currentActivity" 
            :options="activityOptions" 
            optionLabel="label" 
            optionValue="value" 
            placeholder="Pilih Kegiatan" 
            filter 
            filterPlaceholder="Cari kegiatan..." 
            class="w-full sm:w-64 lg:w-72 text-xs rounded-md" 
          />

          <!-- Print button -->
          <button 
            @click="printAttendance" 
            class="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 border border-slate-200 rounded-md text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 w-full sm:w-auto active:scale-95 shadow-2xs whitespace-nowrap"
          >
            <font-awesome-icon icon="print" /> Cetak
          </button>
        </div>
      </div>

      <!-- 2. Selected Activity Info Banner (Visual Spotlight) -->
      <div v-if="selectedActivityDetails" class="mb-6 p-4 rounded-md border bg-slate-50/50 border-slate-150 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:bg-white print:border-slate-300">
        <div class="flex items-center gap-4.5">
          <!-- Icon Circular Badge -->
          <div :class="[
            'w-10 h-10 rounded-md flex items-center justify-center border flex-shrink-0',
            selectedActivityDetails.type === 'agenda' 
              ? 'bg-emerald-500 border-emerald-400 text-white shadow-sm shadow-emerald-500/10' 
              : selectedActivityDetails.type === 'rapat'
                ? 'bg-teal-500 border-teal-400 text-white shadow-sm shadow-teal-500/10'
                : 'bg-slate-500 border-slate-400 text-white'
          ]">
            <font-awesome-icon :icon="selectedActivityDetails.type === 'agenda' ? 'calendar' : 'file-alt'" class="text-sm" />
          </div>
          <div>
            <div class="flex items-center flex-wrap gap-2">
              <span :class="[
                'text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider border leading-none',
                selectedActivityDetails.type === 'agenda' 
                  ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
                  : selectedActivityDetails.type === 'rapat'
                    ? 'bg-teal-50 border-teal-100 text-teal-700'
                    : 'bg-slate-100 border-slate-200 text-slate-700'
              ]">
                {{ selectedActivityDetails.type }}
              </span>
              <span v-if="selectedActivityDetails.date" class="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                {{ selectedActivityDetails.date }}
              </span>
            </div>
            <h4 class="text-xs font-black text-slate-800 uppercase tracking-wide mt-1.5 leading-snug">
              {{ selectedActivityDetails.title }}
            </h4>
          </div>
        </div>
        <div class="text-left md:text-right">
          <span class="text-[10px] font-semibold text-slate-500 block">
            {{ selectedActivityDetails.info }}
          </span>
        </div>
      </div>

      <!-- 3. Dynamic Real-time Attendance Statistics Grid (Premium Dashboard Look) -->
      <div v-if="currentActivity" class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 print:hidden">
        
        <!-- Hadir Stat -->
        <div class="bg-emerald-50/20 border border-emerald-100 rounded-md p-3.5 flex justify-between items-center transition-all hover:shadow-2xs">
          <div>
            <span class="text-[9px] font-black uppercase tracking-wider text-slate-450 block">Hadir</span>
            <span class="text-base font-black text-emerald-600 mt-1 block">{{ stats.Hadir }} <span class="text-[10px] font-medium text-slate-400">orang</span></span>
          </div>
          <div class="w-8 h-8 rounded-full bg-emerald-55 border border-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
        </div>

        <!-- Sakit Stat -->
        <div class="bg-amber-50/20 border border-amber-100 rounded-md p-3.5 flex justify-between items-center transition-all hover:shadow-2xs">
          <div>
            <span class="text-[9px] font-black uppercase tracking-wider text-slate-450 block">Sakit</span>
            <span class="text-base font-black text-amber-600 mt-1 block">{{ stats.Sakit }} <span class="text-[10px] font-medium text-slate-400">orang</span></span>
          </div>
          <div class="w-8 h-8 rounded-full bg-amber-55 border border-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0">
            <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          </div>
        </div>

        <!-- Izin Stat -->
        <div class="bg-blue-50/20 border border-blue-100 rounded-md p-3.5 flex justify-between items-center transition-all hover:shadow-2xs">
          <div>
            <span class="text-[9px] font-black uppercase tracking-wider text-slate-450 block">Izin</span>
            <span class="text-base font-black text-blue-600 mt-1 block">{{ stats.Izin }} <span class="text-[10px] font-medium text-slate-400">orang</span></span>
          </div>
          <div class="w-8 h-8 rounded-full bg-blue-55 border border-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
            <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
          </div>
        </div>

        <!-- Alfa Stat -->
        <div class="bg-rose-50/20 border border-rose-100 rounded-md p-3.5 flex justify-between items-center transition-all hover:shadow-2xs">
          <div>
            <span class="text-[9px] font-black uppercase tracking-wider text-slate-450 block">Alfa</span>
            <span class="text-base font-black text-rose-600 mt-1 block">{{ stats.Alfa }} <span class="text-[10px] font-medium text-slate-400">orang</span></span>
          </div>
          <div class="w-8 h-8 rounded-full bg-rose-55 border border-rose-100 flex items-center justify-center text-rose-600 flex-shrink-0">
            <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
          </div>
        </div>

      </div>

      <!-- Print Only Header -->
      <div class="hidden print:block text-slate-950 p-6 text-center border-b border-slate-300 mb-6">
        <h2 class="text-xl font-bold uppercase tracking-wide text-slate-900">Rekapitulasi Kehadiran Pengurus</h2>
        <p class="text-sm mt-1">Kegiatan: {{ currentActivity }} | FORMULA Dusun Ngampon</p>
      </div>

      <!-- Entries & Search Bar Row exactly above the table/cards (Screen only) -->
      <div v-if="currentActivity" class="mb-5 print:hidden flex flex-row justify-between items-center gap-4">
        <!-- Left: Simple native numeric select ("langsung angka aja") -->
        <select 
          v-model="perPage" 
          class="px-2.5 py-2.5 bg-white border border-slate-200 rounded-md text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
        >
          <option :value="5">5</option>
          <option :value="10">10</option>
          <option :value="25">25</option>
          <option :value="50">50</option>
          <option :value="100">100</option>
        </select>

        <!-- Right: Search Query (Search Anggota) -->
        <div class="relative w-full sm:w-64">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Cari nama anggota..." 
            class="px-4.5 py-2.5 pr-10 bg-white border border-slate-200 rounded-md text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 w-full shadow-2xs"
          >
          <span class="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none">
            <font-awesome-icon icon="search" />
          </span>
        </div>
      </div>

      <!-- 4. Mobile Layout: Member Attendance Cards (Print Hidden) -->
      <div class="grid grid-cols-1 gap-4 md:hidden print:hidden mb-6">
        <div 
          v-for="(member, index) in filteredMembersList" 
          :key="member.email" 
          class="bg-white border border-slate-200/80 rounded-md p-5 space-y-4 shadow-2xs hover:border-slate-300 transition-colors"
        >
          <!-- Member Info -->
          <div class="flex items-center gap-3">
            <img :src="member.avatar" class="w-9 h-9 rounded-full object-cover border border-slate-200 flex-shrink-0">
            <div class="min-w-0">
              <span class="font-black text-xs text-slate-800 block truncate uppercase leading-tight">{{ member.name }}</span>
              <span class="text-[9px] text-slate-400 block truncate mt-0.5">{{ member.email }}</span>
              <span class="inline-block px-2 py-0.5 mt-1.5 bg-slate-50 border border-slate-200 text-slate-600 rounded text-[8px] font-black uppercase tracking-wider leading-none">{{ member.title }}</span>
            </div>
            <span class="ml-auto text-[10px] font-black text-slate-350">#{{ index + 1 }}</span>
          </div>

          <!-- Interactive Status Options -->
          <div class="grid grid-cols-4 gap-1.5 pt-3 border-t border-slate-150">
            <button 
              v-for="status in ['Hadir', 'Sakit', 'Izin', 'Alfa']" 
              :key="status" 
              @click="setStatus(member.email, status)"
              :class="[
                'py-2.5 rounded-md text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer text-center border', 
                getStatus(member.email) === status 
                  ? (status === 'Hadir' 
                      ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm shadow-emerald-500/10 font-bold' 
                      : status === 'Alfa' 
                        ? 'bg-rose-500 text-white border-rose-500 shadow-sm shadow-rose-500/10 font-bold' 
                        : status === 'Sakit'
                          ? 'bg-amber-500 text-white border-amber-500 shadow-sm shadow-amber-500/10'
                          : 'bg-blue-500 text-white border-blue-500 shadow-sm shadow-blue-500/10') 
                  : 'bg-slate-50 text-slate-400 border-slate-200/60 hover:text-slate-700 hover:bg-slate-100'
              ]"
            >
              {{ status }}
            </button>
          </div>
        </div>
      </div>

      <!-- 5. Desktop & Print Layout: Member Attendance Table -->
      <div class="p-2 print:p-0 overflow-x-auto hidden md:block print:block">
        <table class="w-full text-left text-xs border-collapse min-w-[600px] md:min-w-0">
          <thead>
            <tr class="text-slate-500 uppercase font-black text-[9px] tracking-widest border-b border-slate-200/75 print:text-slate-700 print:border-slate-300">
              <th class="p-4 w-14 text-center print:py-2">No</th>
              <th class="p-4 print:py-2">Nama Pengurus</th>
              <th class="p-4 print:py-2">Jabatan</th>
              <th class="p-4 print:py-2 text-center w-80">Status Kehadiran</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-150 print:divide-slate-300 print:text-slate-900">
            <tr v-for="(member, index) in filteredMembersList" :key="member.email" class="hover:bg-slate-50/50 transition-colors">
              <td class="p-4 text-center font-bold text-slate-400 print:py-2">{{ index + 1 }}</td>
              <td class="p-4 print:py-2 flex items-center gap-3">
                <img :src="member.avatar" class="w-8 h-8 rounded-full object-cover border border-slate-200 flex-shrink-0 print:hidden">
                <div>
                  <span class="font-black text-slate-800 uppercase tracking-wide print:text-slate-950">{{ member.name }}</span>
                  <span class="text-[9px] text-slate-400 block mt-0.5 print:text-slate-700">{{ member.email }}</span>
                </div>
              </td>
              <td class="p-4 print:py-2">
                <span class="inline-block px-2.5 py-0.5 bg-slate-50 border border-slate-200 text-slate-600 rounded text-[9px] font-black uppercase tracking-wider">{{ member.title }}</span>
              </td>
              <td class="p-4 print:py-2 text-center">
                
                <!-- Interactive Button Selection for Screen -->
                <div class="flex justify-center gap-1.5 print:hidden">
                  <button 
                    v-for="status in ['Hadir', 'Sakit', 'Izin', 'Alfa']" 
                    :key="status" 
                    @click="setStatus(member.email, status)"
                    :class="[
                      'px-3.5 py-1.5 rounded-md text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer border', 
                      getStatus(member.email) === status 
                        ? (status === 'Hadir' 
                            ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm shadow-emerald-500/10' 
                            : status === 'Alfa' 
                              ? 'bg-rose-500 text-white border-rose-500 shadow-sm shadow-rose-500/10' 
                              : status === 'Sakit'
                                ? 'bg-amber-500 text-white border-amber-500 shadow-sm shadow-amber-500/10'
                                : 'bg-blue-500 text-white border-blue-500 shadow-sm shadow-blue-500/10') 
                        : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                    ]"
                  >
                    {{ status }}
                  </button>
                </div>

                <!-- Text-only Indicator for Print -->
                <span class="hidden print:inline-block font-black uppercase tracking-widest text-xs">
                  {{ getStatus(member.email) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 6. Bottom Submit Action (Print Hidden) -->
      <div class="mt-8 flex justify-end border-t border-slate-150 pt-6 print:hidden">
        <button 
          @click="saveAttendance" 
          class="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-black text-xs uppercase tracking-widest transition-all cursor-pointer w-full sm:w-auto text-center flex items-center justify-center gap-2 shadow-md shadow-emerald-600/10 active:scale-95"
        >
          <font-awesome-icon icon="save" /> Simpan Presensi Kehadiran
        </button>
      </div>

    </div>
  </AdminLayout>
</template>
