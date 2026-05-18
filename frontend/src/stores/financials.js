import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useFinancialsStore = defineStore('financials', () => {
  const defaultKasData = {
    saldo: 2450000,
    pemasukan: 3500000,
    pengeluaran: 1050000,
    riwayat: [
      { label: 'Konsumsi Rapat Rutin', nominal: 150000, tanggal: '03 Mei 2025' },
      { label: 'Pembelian Atribut Organisasi', nominal: 400000, tanggal: '28 Apr 2025' },
      { label: 'Sewa Lapangan Futsal', nominal: 200000, tanggal: '25 Apr 2025' },
      { label: 'Santunan Warga Sakit', nominal: 300000, tanggal: '20 Apr 2025' }
    ]
  }

  const kasData = ref(JSON.parse(localStorage.getItem('formula_kas_data')) || defaultKasData)

  watch(kasData, (val) => {
    localStorage.setItem('formula_kas_data', JSON.stringify(val))
  }, { deep: true })

  const API_BASE = 'http://localhost:8000/api'

  const fetchKasData = async () => {
    try {
      const res = await fetch(`${API_BASE}/kas`)
      if (res.ok) {
        const data = await res.json()
        kasData.value.pemasukan = Number(data.pemasukan)
        kasData.value.pengeluaran = Number(data.pengeluaran)
        kasData.value.saldo = Number(data.saldo)
        kasData.value.riwayat = data.riwayat.map(item => ({
          id: item.id,
          label: item.label,
          nominal: Number(item.nominal),
          type: item.type,
          tanggal: item.tanggal
        }))
      }
    } catch (e) {}
  }

  const addKasTransaction = async (label, nominal, type, tanggal) => {
    try {
      const res = await fetch(`${API_BASE}/kas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label, nominal, type, tanggal })
      })
      if (res.ok) {
        await fetchKasData()
        return { success: true }
      }
    } catch (e) {}
    return { success: false }
  }

  const deleteKasTransaction = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/kas/${id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        await fetchKasData()
        return { success: true }
      }
    } catch (e) {}
    return { success: false }
  }

  return {
    kasData,
    fetchKasData,
    addKasTransaction,
    deleteKasTransaction
  }
})
