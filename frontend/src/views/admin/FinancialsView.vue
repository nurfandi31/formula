<script setup>
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '../../layouts/AdminLayout.vue'
import { useSocialStore } from '../../stores/social'
import Swal from 'sweetalert2'

const socialStore = useSocialStore()

const transactionLabel = ref('')
const transactionNominal = ref(0)
const transactionType = ref('pemasukan')
const transactionIcon = ref('🍱')

const iconOptions = ref([
  { label: '🍱 Konsumsi / Makan', value: '🍱' },
  { label: '👕 Seragam / Atribut', value: '👕' },
  { label: '⚽ Olahraga / Futsal', value: '⚽' },
  { label: '❤️ Sosial / Santunan', value: '❤️' },
  { label: '🔧 Alat / Perlengkapan', value: '🔧' }
])

const typeOptions = ref([
  { label: 'Uang Masuk (Pemasukan)', value: 'pemasukan' },
  { label: 'Uang Keluar (Pengeluaran)', value: 'pengeluaran' }
])

const searchQuery = ref('')
const perPage = ref(10)

const filteredTransactions = computed(() => {
  let list = socialStore.kasData.riwayat
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    list = list.filter(item => item.label.toLowerCase().includes(q) || item.tanggal.toLowerCase().includes(q))
  }
  return list.slice(0, perPage.value)
})

const chartData = ref({})
const chartOptions = ref({})

const updateChart = () => {
  chartData.value = {
    labels: ['Total Pemasukan', 'Total Pengeluaran'],
    datasets: [
      {
        data: [socialStore.kasData.pemasukan, socialStore.kasData.pengeluaran],
        backgroundColor: ['rgba(16, 185, 129, 0.2)', 'rgba(244, 63, 94, 0.2)'],
        borderColor: ['#10b981', '#f43f5e'],
        borderWidth: 1
      }
    ]
  }
  chartOptions.value = {
    plugins: {
      legend: {
        labels: {
          color: '#94a3b8',
          font: { weight: 'bold' }
        }
      }
    }
  }
}
const addTransaction = async () => {
  if (!transactionLabel.value.trim() || !transactionNominal.value) {
    Swal.fire({ icon: 'warning', title: 'Data Belum Lengkap', text: 'Silakan isi keterangan dan nominal transaksi!', confirmButtonColor: '#10b981' })
    return
  }

  const now = new Date()
  const dateStr = `${now.getDate()} ${now.toLocaleString('id-ID', { month: 'short' })} ${now.getFullYear()}`

  const res = await socialStore.addKasTransaction(
    transactionLabel.value.trim(),
    transactionNominal.value,
    transactionType.value,
    transactionIcon.value,
    dateStr
  )

  if (res.success) {
    transactionLabel.value = ''
    transactionNominal.value = 0
    updateChart()
    Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Transaksi berhasil diinput!', timer: 1500, showConfirmButton: false })
  } else {
    Swal.fire({ icon: 'error', title: 'Gagal', text: 'Gagal menyimpan transaksi ke database!', confirmButtonColor: '#10b981' })
  }
}

const deleteTransaction = (index) => {
  const item = socialStore.kasData.riwayat[index]
  if (!item.id) {
    if (item.type === 'pemasukan') {
      socialStore.kasData.pemasukan -= item.nominal
      socialStore.kasData.saldo -= item.nominal
    } else {
      socialStore.kasData.pengeluaran -= item.nominal
      socialStore.kasData.saldo += item.nominal
    }
    socialStore.kasData.riwayat.splice(index, 1)
    updateChart()
    return
  }

  Swal.fire({
    title: 'Apakah Anda yakin?',
    text: 'Aksi ini akan menghapus catatan transaksi ini!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#f43f5e',
    cancelButtonColor: '#475569',
    confirmButtonText: 'Ya, Hapus!',
    cancelButtonText: 'Batal'
  }).then(async (result) => {
    if (result.isConfirmed) {
      const res = await socialStore.deleteKasTransaction(item.id)
      if (res.success) {
        updateChart()
        Swal.fire({ icon: 'success', title: 'Terhapus', text: 'Transaksi telah berhasil dihapus.', timer: 1500, showConfirmButton: false })
      } else {
        Swal.fire({ icon: 'error', title: 'Gagal', text: 'Gagal menghapus transaksi dari database!', confirmButtonColor: '#10b981' })
      }
    }
  })
}

const formatRupiah = (val) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val)
}

const printReport = () => {
  window.print()
}

onMounted(() => {
  updateChart()
})
</script>

<template>
  <AdminLayout>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 print:hidden">
      <div class="bg-slate-900/60 border border-slate-900 rounded-lg p-6 lg:col-span-2">
        <h3 class="text-xs font-black uppercase tracking-widest text-white mb-4">Input Dana Kas Baru</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Keterangan Transaksi</label>
            <input v-model="transactionLabel" type="text" placeholder="Contoh: Konsumsi Rapat Bulanan" class="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500">
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Jenis Transaksi</label>
              <Select v-model="transactionType" :options="typeOptions" optionLabel="label" optionValue="value" placeholder="Pilih Jenis" class="w-full text-xs" />
            </div>
            <div>
              <label class="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Nominal (Rupiah)</label>
              <InputNumber v-model="transactionNominal" class="w-full text-xs" mode="currency" currency="IDR" locale="id-ID" placeholder="Rp 0" />
            </div>
          </div>
          <div>
            <label class="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Icon Kategori</label>
            <Select v-model="transactionIcon" :options="iconOptions" optionLabel="label" optionValue="value" placeholder="Pilih Kategori" class="w-full text-xs" />
          </div>
          <button @click="addTransaction" class="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer">
            <font-awesome-icon icon="plus" class="mr-2" /> Input Transaksi
          </button>
        </div>
      </div>

      <div class="bg-slate-900/60 border border-slate-900 rounded-lg p-6 flex flex-col justify-between">
        <div>
          <h3 class="text-xs font-black uppercase tracking-widest text-white mb-4">Struktur Kas</h3>
          <div class="w-full flex items-center justify-center">
            <Chart type="doughnut" :data="chartData" :options="chartOptions" class="w-48 h-48" />
          </div>
        </div>
        <div class="mt-6 border-t border-slate-800/60 pt-4 space-y-2">
          <div class="flex justify-between text-xs">
            <span class="text-slate-500">Total Pemasukan:</span>
            <span class="text-emerald-400 font-bold">{{ formatRupiah(socialStore.kasData.pemasukan) }}</span>
          </div>
          <div class="flex justify-between text-xs">
            <span class="text-slate-500">Total Pengeluaran:</span>
            <span class="text-rose-400 font-bold">{{ formatRupiah(socialStore.kasData.pengeluaran) }}</span>
          </div>
          <div class="flex justify-between text-xs border-t border-slate-800/40 pt-2 font-bold">
            <span class="text-slate-300">Saldo Akhir:</span>
            <span class="text-white">{{ formatRupiah(socialStore.kasData.saldo) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-8 bg-slate-900/60 border border-slate-900 rounded-lg overflow-hidden print:border-0 print:bg-transparent print:m-0">
      <div class="p-6 border-b border-slate-800/60 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-slate-900/40 print:hidden">
        <h3 class="text-xs font-black uppercase tracking-widest text-white">Riwayat Arus Kas</h3>
        <div class="flex flex-wrap gap-3 w-full sm:w-auto items-center">
          <div class="flex items-center gap-2">
            <span class="text-[10px] font-black uppercase tracking-wider text-slate-500">Tampilkan</span>
            <Select v-model="perPage" :options="[5, 10, 25, 50, 100]" class="w-20 text-xs" />
          </div>
          <input v-model="searchQuery" type="text" placeholder="Cari keterangan..." class="px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 w-full sm:w-48">
          <button @click="printReport" class="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-2">
            <font-awesome-icon icon="print" /> Cetak Laporan
          </button>
        </div>
      </div>

      <div class="hidden print:block text-slate-950 p-6 text-center border-b border-slate-300">
        <h2 class="text-xl font-bold uppercase tracking-wide text-slate-900">Laporan Keuangan Kas FORMULA</h2>
        <p class="text-sm mt-1">Dusun Ngampon, Desa Ngampon</p>
        <div class="grid grid-cols-3 gap-4 mt-6 text-left border border-slate-300 p-4 rounded-xl">
          <div>
            <span class="text-xs font-bold text-slate-600 block">TOTAL MASUK:</span>
            <span class="text-sm font-black">{{ formatRupiah(socialStore.kasData.pemasukan) }}</span>
          </div>
          <div>
            <span class="text-xs font-bold text-slate-600 block">TOTAL KELUAR:</span>
            <span class="text-sm font-black">{{ formatRupiah(socialStore.kasData.pengeluaran) }}</span>
          </div>
          <div>
            <span class="text-xs font-bold text-slate-600 block">SALDO SAAT INI:</span>
            <span class="text-sm font-black">{{ formatRupiah(socialStore.kasData.saldo) }}</span>
          </div>
        </div>
      </div>

      <div class="p-2 print:p-0 overflow-x-auto">
        <table class="w-full text-left text-xs border-collapse min-w-[600px] md:min-w-0">
          <thead>
            <tr class="text-slate-500 uppercase font-black text-[9px] tracking-widest border-b border-slate-800/40 print:text-slate-700 print:border-slate-300">
              <th class="p-4 print:py-2">No</th>
              <th class="p-4 print:py-2">Keterangan</th>
              <th class="p-4 print:py-2">Tanggal</th>
              <th class="p-4 print:py-2 text-right">Nominal</th>
              <th class="p-4 print:py-2 text-right print:hidden">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-800/40 print:divide-slate-300 print:text-slate-900">
            <tr v-for="(item, index) in filteredTransactions" :key="index" class="hover:bg-slate-800/10 transition-colors">
              <td class="p-4 print:py-2">{{ index + 1 }}</td>
              <td class="p-4 print:py-2">
                <span class="mr-2">{{ item.icon }}</span>
                <span class="font-bold text-slate-200 print:text-slate-950">{{ item.label }}</span>
              </td>
              <td class="p-4 print:py-2 text-slate-400 print:text-slate-700">{{ item.tanggal }}</td>
              <td class="p-4 print:py-2 text-right font-black" :class="item.type === 'pemasukan' ? 'text-emerald-400 print:text-emerald-700' : 'text-rose-400 print:text-rose-700'">
                {{ item.type === 'pemasukan' ? '+' : '-' }}{{ formatRupiah(item.nominal) }}
              </td>
              <td class="p-4 print:py-2 text-right print:hidden">
                <button @click="deleteTransaction(index)" class="p-2 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 hover:bg-rose-500 hover:text-white transition-all cursor-pointer">
                  <font-awesome-icon icon="trash" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </AdminLayout>
</template>

<style>
@media print {
  body {
    background: white !important;
    color: black !important;
  }
}
</style>
