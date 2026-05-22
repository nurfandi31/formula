import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useActivitiesStore = defineStore('activities', () => {
  const defaultHasilRapat = []

  const defaultAgendaKegiatan = []

  const hasilRapat = ref(JSON.parse(localStorage.getItem('formula_hasil_rapat')) || defaultHasilRapat)
  const agendaKegiatan = ref(JSON.parse(localStorage.getItem('formula_agenda_kegiatan')) || defaultAgendaKegiatan)

  watch(hasilRapat, (val) => {
    localStorage.setItem('formula_hasil_rapat', JSON.stringify(val))
  }, { deep: true })

  watch(agendaKegiatan, (val) => {
    localStorage.setItem('formula_agenda_kegiatan', JSON.stringify(val))
  }, { deep: true })

  const API_BASE = 'http://localhost:8000/api'

  const fetchActivities = async () => {
    try {
      const res = await fetch(`${API_BASE}/activities`)
      if (res.ok) {
        const data = await res.json()
        hasilRapat.value = data.filter(a => a.type === 'rapat').map(a => ({
          id: a.id,
          judul: a.title,
          tanggal: a.date,
          keputusan: a.decisions || []
        }))
        agendaKegiatan.value = data.filter(a => a.type === 'agenda').map(a => ({
          id: a.id,
          judul: a.title,
          tanggal: a.date,
          jam: '08:00 - Selesai',
          lokasi: 'Balai Dusun Ngampon',
          kategori: 'Umum',
          warna: 'emerald'
        }))
      }
    } catch (e) {}
  }

  const addActivity = async (title, date, type, decisions = null) => {
    try {
      const res = await fetch(`${API_BASE}/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, date, type, decisions })
      })
      if (res.ok) {
        await fetchActivities()
        return { success: true }
      }
    } catch (e) {}
    return { success: false }
  }

  const deleteActivity = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/activities/${id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        await fetchActivities()
        return { success: true }
      }
    } catch (e) {}
    return { success: false }
  }

  return {
    hasilRapat,
    agendaKegiatan,
    fetchActivities,
    addActivity,
    deleteActivity
  }
})
