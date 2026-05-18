import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useActivitiesStore = defineStore('activities', () => {
  const defaultHasilRapat = [
    {
      id: 1,
      judul: 'Rencana Kerja & Pembagian Divisi Humas',
      tanggal: '04 Mei',
      peserta: 18,
      keputusan: [
        'Penyusunan jadwal kegiatan bulanan bakti sosial.',
        'Pembagian penanggung jawab dokumentasi & sosial media.',
        'Penetapan iuran wajib anggota disepakati Rp 10.000 per iuran.'
      ]
    },
    {
      id: 2,
      judul: 'Persiapan Pengadaan Kas & Atribut Anggota',
      tanggal: '27 Apr',
      peserta: 15,
      keputusan: [
        'Pemesanan kaos seragam FORMULA disepakati warna hijau botol.',
        'Pendataan ukuran baju wajib diselesaikan maksimal tanggal 10 Mei.',
        'Alokasi anggaran kas awal disetujui sebesar Rp 500.000.'
      ]
    }
  ]

  const defaultAgendaKegiatan = [
    { id: 1, judul: 'Bakti Sosial & Kerja Bakti Dusun Ngampon', tanggal: 'Sabtu, 10 Mei 2025', jam: '07:30 - Selesai', lokasi: 'Balai Dusun Ngampon', kategori: 'Sosial', warna: 'emerald' },
    { id: 2, judul: 'Rapat Rutin Pengurus Harian FORMULA', tanggal: 'Minggu, 11 Mei 2025', jam: '19:30 - Selesai', lokasi: 'Rumah Ketua Fauzi', kategori: 'Rapat', warna: 'teal' },
    { id: 3, judul: 'Latihan Futsal Bersama Antar RT Dusun', tanggal: 'Selasa, 13 Mei 2025', jam: '16:00 - 18:00', lokasi: 'Ngampon Sport Center', kategori: 'Olahraga', warna: 'emerald' }
  ]

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
