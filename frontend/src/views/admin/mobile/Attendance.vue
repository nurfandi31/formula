<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useSocialStore } from '../../../stores/social'
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
const perPage = ref(5)

const filteredMembersList = computed(() => {
  let list = Object.values(socialStore.users).filter(u => u.role === 'anggota')
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    list = list.filter(u => u.name.toLowerCase().includes(q) || u.title.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
  }
  return list.slice(0, perPage.value)
})

const stats = computed(() => {
  const counts = { Hadir: 0, Sakit: 0, Izin: 0, Alfa: 0 }
  const list = Object.values(socialStore.users).filter(u => u.role === 'anggota')
  list.forEach(m => {
    const status = getStatus(m.email)
    if (counts[status] !== undefined) {
      counts[status]++
    } else {
      counts['Alfa']++
    }
  })
  return counts
})

const selectedActivityDetails = computed(() => {
  if (!currentActivity.value) return null
  const agenda = socialStore.agendaKegiatan?.find(a => a.judul === currentActivity.value)
  if (agenda) {
    return {
      type: 'agenda',
      title: agenda.judul,
      date: agenda.tanggal,
      info: `Lokasi: ${agenda.lokasi}`
    }
  }
  const rapat = socialStore.hasilRapat?.find(r => r.judul === currentActivity.value)
  if (rapat) {
    return {
      type: 'rapat',
      title: rapat.judul,
      date: rapat.tanggal,
      info: `Rapat Musyawarah`
    }
  }
  return {
    type: 'kegiatan',
    title: currentActivity.value,
    date: '',
    info: 'Presensi FORMULA'
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

const saveAttendance = async () => {
  if (!currentActivity.value) return
  const current = currentActivity.value
  const map = {}
  const allMembers = Object.values(socialStore.users).filter(u => u.role === 'anggota')
  allMembers.forEach(m => {
    map[m.email] = getStatus(m.email)
  })
  const res = await socialStore.saveAttendance(current, map)
  if (res.success) {
    Swal.fire({ icon: 'success', title: 'Berhasil', text: `Presensi disimpan!`, timer: 1500, showConfirmButton: false })
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs space-y-4">
      <div>
        <label class="block text-[8px] font-black uppercase tracking-wider text-slate-400 mb-1">Pilih Kegiatan Aktif</label>
        <Select 
          v-model="currentActivity" 
          :options="activityOptions" 
          optionLabel="label" 
          optionValue="value" 
          class="w-full text-xs rounded-xl" 
        />
      </div>

      <div v-if="selectedActivityDetails" class="p-3 bg-slate-50 rounded-xl border border-slate-150 flex items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <div :class="['w-8 h-8 rounded-lg flex items-center justify-center text-xs flex-shrink-0 text-white', selectedActivityDetails.type === 'agenda' ? 'bg-emerald-500' : 'bg-teal-500']">
            <font-awesome-icon :icon="selectedActivityDetails.type === 'agenda' ? 'calendar' : 'file-alt'" />
          </div>
          <div>
            <h4 class="text-[11px] font-black text-slate-800 uppercase leading-snug">{{ selectedActivityDetails.title }}</h4>
            <p class="text-[8px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{{ selectedActivityDetails.date }} • {{ selectedActivityDetails.info }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="currentActivity" class="grid grid-cols-4 gap-2">
      <div class="bg-emerald-50/30 border border-emerald-100/50 rounded-xl p-2.5 text-center">
        <span class="text-[8px] font-black uppercase text-emerald-600 block">Hadir</span>
        <span class="text-xs font-black text-emerald-700 mt-0.5 block">{{ stats.Hadir }}</span>
      </div>
      <div class="bg-amber-50/30 border border-amber-100/50 rounded-xl p-2.5 text-center">
        <span class="text-[8px] font-black uppercase text-amber-600 block">Sakit</span>
        <span class="text-xs font-black text-amber-700 mt-0.5 block">{{ stats.Sakit }}</span>
      </div>
      <div class="bg-blue-50/30 border border-blue-100/50 rounded-xl p-2.5 text-center">
        <span class="text-[8px] font-black uppercase text-blue-600 block">Izin</span>
        <span class="text-xs font-black text-blue-700 mt-0.5 block">{{ stats.Izin }}</span>
      </div>
      <div class="bg-rose-50/30 border border-rose-100/50 rounded-xl p-2.5 text-center">
        <span class="text-[8px] font-black uppercase text-rose-600 block">Alfa</span>
        <span class="text-xs font-black text-rose-700 mt-0.5 block">{{ stats.Alfa }}</span>
      </div>
    </div>

    <div v-if="currentActivity" class="space-y-4">
      <div class="flex gap-2">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Cari nama anggota..." 
          class="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400"
        >
        <select v-model="perPage" class="px-2 py-1 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700">
          <option :value="5">5</option>
          <option :value="10">10</option>
          <option :value="25">25</option>
        </select>
      </div>

      <div class="space-y-3">
        <div 
          v-for="member in filteredMembersList" 
          :key="member.email" 
          class="bg-white border border-slate-200/80 rounded-2xl p-4 space-y-3 shadow-xs"
        >
          <div class="flex items-center gap-3">
            <img :src="member.avatar" class="w-8 h-8 rounded-full object-cover border border-slate-250 flex-shrink-0">
            <div class="min-w-0">
              <span class="font-black text-xs text-slate-800 block truncate uppercase leading-tight">{{ member.name }}</span>
              <span class="text-[8px] text-slate-400 block truncate mt-0.5">{{ member.title }}</span>
            </div>
          </div>

          <div class="grid grid-cols-4 gap-1.5 pt-3 border-t border-slate-100">
            <button 
              v-for="status in ['Hadir', 'Sakit', 'Izin', 'Alfa']" 
              :key="status" 
              @click="setStatus(member.email, status)"
              :class="[
                'py-2 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all text-center border', 
                getStatus(member.email) === status 
                  ? (status === 'Hadir' 
                      ? 'bg-emerald-600 text-white border-emerald-600 font-bold' 
                      : status === 'Alfa' 
                        ? 'bg-rose-600 text-white border-rose-600 font-bold' 
                        : status === 'Sakit'
                          ? 'bg-amber-500 text-white border-amber-500'
                          : 'bg-blue-500 text-white border-blue-500') 
                  : 'bg-slate-50 text-slate-400 border-slate-250/50 hover:bg-slate-100'
              ]"
            >
              {{ status }}
            </button>
          </div>
        </div>
      </div>

      <button @click="saveAttendance" class="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-md flex items-center justify-center gap-2">
        <font-awesome-icon icon="save" /> Simpan Presensi
      </button>
    </div>
  </div>
</template>
