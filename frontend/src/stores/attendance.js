import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useAttendanceStore = defineStore('attendance', () => {
  const defaultAbsensi = {
    'Rapat Kerja 04 Mei': {
      'ahmad@formula.org': 'Hadir',
      'siti@formula.org': 'Hadir',
      'andi@formula.org': 'Izin',
      'laila@formula.org': 'Hadir'
    }
  }

  const absensi = ref(JSON.parse(localStorage.getItem('formula_absensi')) || defaultAbsensi)

  watch(absensi, (val) => {
    localStorage.setItem('formula_absensi', JSON.stringify(val))
  }, { deep: true })

  const API_BASE = 'http://localhost:8000/api'

  const fetchAttendance = async (activityName) => {
    try {
      const res = await fetch(`${API_BASE}/attendance/${encodeURIComponent(activityName)}`)
      if (res.ok) {
        const data = await res.json()
        absensi.value[activityName] = data
        return data
      }
    } catch (e) {}
    return {}
  }

  const saveAttendance = async (activityName, attendanceMap) => {
    try {
      const res = await fetch(`${API_BASE}/attendance/${encodeURIComponent(activityName)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attendance: attendanceMap })
      })
      if (res.ok) {
        if (!absensi.value[activityName]) {
          absensi.value[activityName] = {}
        }
        absensi.value[activityName] = { ...attendanceMap }
        return { success: true }
      }
    } catch (e) {}
    return { success: false }
  }

  return {
    absensi,
    fetchAttendance,
    saveAttendance
  }
})
