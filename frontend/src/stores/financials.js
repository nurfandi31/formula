import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useFinancialsStore = defineStore('financials', () => {
  const defaultKasData = {
    saldo: 0,
    pemasukan: 0,
    pengeluaran: 0,
    riwayat: []
  }

  const kasData = ref(defaultKasData)
  const yearlyReports = ref([])

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
        // Automatically sync yearly reports in tandem
        await fetchYearlyReports()
      }
    } catch (e) {}
  }

  const fetchYearlyReports = async () => {
    try {
      const res = await fetch(`${API_BASE}/kas/yearly`)
      if (res.ok) {
        yearlyReports.value = await res.json()
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
    yearlyReports,
    fetchKasData,
    fetchYearlyReports,
    addKasTransaction,
    deleteKasTransaction
  }
})
