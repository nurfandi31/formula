<script setup>
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '../../layouts/AdminLayout.vue'
import { useSocialStore } from '../../stores/social'
import Swal from 'sweetalert2'

const socialStore = useSocialStore()

const transactionLabel = ref('')
const transactionNominal = ref(0)
const transactionType = ref('pemasukan')
const transactionDate = ref(new Date())


const typeOptions = ref([
  { label: 'Uang Masuk (Pemasukan)', value: 'pemasukan' },
  { label: 'Uang Keluar (Pengeluaran)', value: 'pengeluaran' }
])

const searchQuery = ref('')
const perPage = ref(10)
const isHistoryModalOpen = ref(false)
const selectedTransactions = ref([])

const openHistoryModal = () => {
  isHistoryModalOpen.value = true
}

const closeHistoryModal = () => {
  isHistoryModalOpen.value = false
  selectedTransactions.value = [] // Reset selection on close
}

const toggleSelectAll = () => {
  if (selectedTransactions.value.length === filteredTransactions.value.length) {
    selectedTransactions.value = []
  } else {
    selectedTransactions.value = filteredTransactions.value.map((item, idx) => item.id || idx)
  }
}

const printSingleTransaction = (item) => {
  const printWindow = window.open('', '_blank')
  printWindow.document.write(`
    <html>
      <head>
        <title>Kuitansi Transaksi - ${item.label}</title>
        <style>
          body { font-family: 'Helvetica Neue', sans-serif; color: #1e293b; padding: 40px; line-height: 1.5; }
          .receipt-card { border: 2px dashed #cbd5e1; border-radius: 16px; padding: 30px; max-width: 500px; margin: 0 auto; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); }
          .header { text-align: center; border-bottom: 2px dashed #cbd5e1; padding-bottom: 20px; margin-bottom: 20px; }
          .logo { font-size: 24px; font-weight: 800; color: #059669; letter-spacing: 1px; }
          .subtitle { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: bold; margin-top: 4px; }
          .title { font-size: 18px; font-weight: 800; text-transform: uppercase; margin: 15px 0 5px 0; }
          .row { display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 13px; }
          .label { color: #64748b; font-weight: 500; }
          .value { font-weight: 700; color: #0f172a; }
          .nominal { font-size: 22px; font-weight: 900; color: ${item.type === 'pemasukan' ? '#059669' : '#e11d48'}; border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; padding: 12px 0; text-align: center; margin: 20px 0; }
          .footer { text-align: center; font-size: 10px; color: #94a3b8; font-weight: bold; text-transform: uppercase; margin-top: 30px; letter-spacing: 0.5px; }
        </style>
      </head>
      <body>
        <div class="receipt-card">
          <div class="header">
            <div class="logo">FORMULA</div>
            <div class="subtitle">Bukti Kas Resmi Organisasi</div>
            <div class="title">KUITANSI KAS</div>
          </div>
          <div class="row">
            <span class="label">Keterangan:</span>
            <span class="value">${item.label}</span>
          </div>
          <div class="row">
            <span class="label">Tanggal:</span>
            <span class="value">${item.tanggal}</span>
          </div>
          <div class="row">
            <span class="label">Status:</span>
            <span class="value">${item.type === 'pemasukan' ? 'Pemasukan (Uang Masuk)' : 'Pengeluaran (Uang Keluar)'}</span>
          </div>
          <div class="nominal">
            ${item.type === 'pemasukan' ? '+' : '-'}${formatRupiah(item.nominal)}
          </div>
          <div class="footer">
            Dicetak secara resmi oleh sistem kas FORMULA
          </div>
        </div>
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 500);
          }
        <\/script>
      </body>
    </html>
  `)
  printWindow.document.close()
}

const printSelectedTransactions = () => {
  if (selectedTransactions.value.length === 0) {
    Swal.fire({
      icon: 'warning',
      title: 'Centang Terlebih Dahulu',
      text: 'Silakan pilih minimal satu transaksi di sebelah kiri dengan mencentang kotaknya!',
      confirmButtonColor: '#10b981'
    })
    return
  }

  // Find all selected transactions
  const itemsToPrint = filteredTransactions.value.filter((item, idx) => 
    selectedTransactions.value.includes(item.id || idx)
  )

  const printWindow = window.open('', '_blank')
  let receiptContent = '<div class="receipts-page">'

  itemsToPrint.forEach((item, index) => {
    // If it's a multiple of 6 (and not the first one), break to a new page!
    if (index > 0 && index % 6 === 0) {
      receiptContent += '</div><div class="receipts-page page-break">'
    }

    const isPemasukan = item.type === 'pemasukan'
    const nominalClass = isPemasukan ? 'nominal-pemasukan' : 'nominal-pengeluaran'
    const nominalSign = isPemasukan ? '+' : '-'

    receiptContent += `
      <div class="receipt-card">
        <div class="header">
          <div class="logo">FORMULA</div>
          <div class="subtitle">Bukti Kas Resmi Organisasi</div>
          <div class="title">KUITANSI KAS</div>
        </div>
        <div class="body-info">
          <div class="row">
            <span class="label">Keterangan</span>
            <span class="value">: ${item.label}</span>
          </div>
          <div class="row">
            <span class="label">Tanggal</span>
            <span class="value">: ${item.tanggal}</span>
          </div>
          <div class="row">
            <span class="label">Aliran Dana</span>
            <span class="value">: ${isPemasukan ? 'Pemasukan' : 'Pengeluaran'}</span>
          </div>
        </div>
        <div class="nominal ${nominalClass}">
          ${nominalSign}${formatRupiah(item.nominal)}
        </div>
        <div class="footer">
          FORMULA DUSUN NGAMPON • DESA NGAMPON
        </div>
      </div>
    `
  })

  receiptContent += '</div>'

  printWindow.document.write(`
    <html>
      <head>
        <title>Cetak Kuitansi Massal</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');
          
          @media print {
            body { margin: 0; padding: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .page-break { page-break-before: always; }
          }
          
          body {
            font-family: 'Inter', sans-serif;
            color: #1e293b;
            margin: 0;
            padding: 8mm;
            box-sizing: border-box;
            background: #fff;
          }
          
          .receipts-page {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            grid-template-rows: repeat(3, 1fr);
            gap: 8mm;
            width: 100%;
            height: 275mm;
            box-sizing: border-box;
            page-break-inside: avoid;
          }
          
          .receipt-card {
            border: 2px dashed #cbd5e1;
            border-radius: 12px;
            padding: 14px 18px;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 100%;
            background: #fff;
          }
          
          .header {
            text-align: center;
            border-bottom: 1.5px dashed #cbd5e1;
            padding-bottom: 6px;
            margin-bottom: 6px;
          }
          
          .logo {
            font-size: 15px;
            font-weight: 900;
            color: #059669;
            letter-spacing: 0.5px;
          }
          
          .subtitle {
            font-size: 8px;
            text-transform: uppercase;
            color: #64748b;
            font-weight: 700;
            margin-top: 1px;
            letter-spacing: 0.3px;
          }
          
          .title {
            font-size: 10px;
            font-weight: 800;
            text-transform: uppercase;
            margin-top: 3px;
            color: #0f172a;
            letter-spacing: 0.5px;
          }
          
          .body-info {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: 6px;
            margin: 6px 0;
          }
          
          .row {
            display: flex;
            align-items: center;
            font-size: 10px;
          }
          
          .label {
            color: #64748b;
            font-weight: 600;
            width: 65px;
            flex-shrink: 0;
          }
          
          .value {
            font-weight: 700;
            color: #0f172a;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          
          .nominal {
            font-size: 13px;
            font-weight: 900;
            border-top: 1px dashed #f1f5f9;
            border-bottom: 1px dashed #f1f5f9;
            padding: 5px 0;
            text-align: center;
            margin: 6px 0;
            letter-spacing: 0.3px;
          }
          
          .nominal-pemasukan {
            color: #059669;
            background: #ecfdf5;
            border-color: #a7f3d0;
          }
          
          .nominal-pengeluaran {
            color: #e11d48;
            background: #fff1f2;
            border-color: #fecdd3;
          }
          
          .footer {
            text-align: center;
            font-size: 7px;
            color: #94a3b8;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-top: auto;
          }
        </style>
      </head>
      <body>
        ${receiptContent}
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 500);
          }
        <\/script>
      </body>
    </html>
  `)
  printWindow.document.close()
}

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
    labels: ['Pemasukan', 'Pengeluaran'],
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
        position: 'right',
        labels: {
          color: '#64748b',
          font: { 
            family: 'Inter, sans-serif',
            weight: 'bold',
            size: 10
          },
          boxWidth: 12,
          padding: 10
        }
      }
    },
    maintainAspectRatio: false
  }
}
const addTransaction = async () => {
  if (!transactionLabel.value.trim() || !transactionNominal.value) {
    Swal.fire({ icon: 'warning', title: 'Data Belum Lengkap', text: 'Silakan isi keterangan dan nominal transaksi!', confirmButtonColor: '#10b981' })
    return
  }

  const selectedDate = transactionDate.value || new Date()
  const dateStr = `${selectedDate.getDate()} ${selectedDate.toLocaleString('id-ID', { month: 'short' })} ${selectedDate.getFullYear()}`

  const res = await socialStore.addKasTransaction(
    transactionLabel.value.trim(),
    transactionNominal.value,
    transactionType.value,
    dateStr
  )

  if (res.success) {
    transactionLabel.value = ''
    transactionNominal.value = 0
    transactionDate.value = new Date() // Reset to today
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
      <div class="bg-white border border-slate-200/70 rounded-lg p-6 lg:col-span-2 shadow-xs">
        <h3 class="text-xs font-black uppercase tracking-widest text-slate-800 mb-4">Input Dana Kas Baru</h3>
        <div class="space-y-4">

          
          <!-- 2. Tanggal Transaksi (Kiri) & Jenis Transaksi (Kanan) -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Tanggal Transaksi</label>
              <DatePicker v-model="transactionDate" dateFormat="dd M yy" placeholder="Pilih Tanggal" class="w-full rounded-md" inputClass="w-full px-4 py-3 bg-white border border-slate-200 rounded-md text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500" />
            </div>
            <div>
              <label class="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Jenis Transaksi</label>
              <Select v-model="transactionType" :options="typeOptions" optionLabel="label" optionValue="value" placeholder="Pilih Jenis" filter filterPlaceholder="Cari jenis..." class="w-full text-xs rounded-md" />
            </div>
          </div>
          
          <!-- 3. Keterangan Transaksi (At the bottom, above nominal) -->
          <div>
            <label class="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Keterangan Transaksi</label>
            <textarea v-model="transactionLabel" rows="3" placeholder="Contoh: Konsumsi Rapat Bulanan, pembelian ATK, dan keperluan dokumentasi acara..." class="w-full px-4 py-3 bg-white border border-slate-200 rounded-md text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none font-sans"></textarea>
          </div>
          
          <!-- 4. Nominal (Rupiah) -->
          <div>
            <label class="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Nominal (Rupiah)</label>
            <InputNumber v-model="transactionNominal" class="w-full rounded-md" inputClass="w-full px-4 py-3 bg-white border border-slate-200 rounded-md text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500" mode="currency" currency="IDR" locale="id-ID" placeholder="Rp 0" />
          </div>
          
          <button @click="addTransaction" class="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-black text-xs uppercase tracking-widest transition-all cursor-pointer">
            <font-awesome-icon icon="plus" class="mr-2" /> Input Transaksi
          </button>
        </div>
      </div>

      <div class="bg-white border border-slate-200/70 rounded-lg p-6 flex flex-col justify-between shadow-xs">
        <div>
          <h3 class="text-xs font-black uppercase tracking-widest text-slate-800 mb-4">Struktur Kas</h3>
          
          <!-- Doughnut Chart centered, with its legend drawn on the right -->
          <div class="w-full flex items-center justify-center py-2">
            <Chart type="doughnut" :data="chartData" :options="chartOptions" class="w-64 h-36" />
          </div>
        </div>
        
        <!-- Reverted 3 totals labels back to the bottom (like original) -->
        <div class="mt-6 border-t border-slate-150 pt-4 space-y-2">
          <div class="flex justify-between text-xs">
            <span class="text-slate-500">Pemasukan:</span>
            <span class="text-emerald-600 font-bold">{{ formatRupiah(socialStore.kasData.pemasukan) }}</span>
          </div>
          <div class="flex justify-between text-xs">
            <span class="text-slate-500">Pengeluaran:</span>
            <span class="text-rose-600 font-bold">{{ formatRupiah(socialStore.kasData.pengeluaran) }}</span>
          </div>
          <div class="flex justify-between text-xs border-t border-slate-150 pt-2 font-bold">
            <span class="text-slate-650">Saldo Akhir:</span>
            <span class="text-slate-900">{{ formatRupiah(socialStore.kasData.saldo) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Sleek Clickable Card for History -->
    <div 
      @click="openHistoryModal"
      class="mt-8 bg-white border border-slate-200/70 rounded-lg p-5 flex flex-col sm:flex-row justify-between items-center gap-4 hover:border-emerald-500/50 hover:shadow-md transition-all cursor-pointer shadow-xs group"
    >
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 transition-all group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600">
          <font-awesome-icon icon="list" class="text-base" />
        </div>
        <div>
          <h3 class="text-xs font-black uppercase tracking-widest text-slate-800">Riwayat Transaksi</h3>
          <p class="text-[10px] text-slate-500 mt-0.5">Klik untuk melihat detail seluruh riwayat arus kas masuk & keluar</p>
        </div>
      </div>
      
      <!-- Right Side Actions: Prevent event propagation (.stop) so print click doesn't trigger modal -->
      <button 
        @click.stop="printReport" 
        class="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 print:hidden shadow-xs hover:shadow-sm"
      >
        <font-awesome-icon icon="print" /> Cetak Laporan Keuangan
      </button>
    </div>

    <!-- Hidden Print Layout (Activated during browser print) -->
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

      <!-- Print Table -->
      <div class="mt-6">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="text-slate-700 border-b border-slate-300">
              <th class="py-2">No</th>
              <th class="py-2">Keterangan</th>
              <th class="py-2">Tanggal</th>
              <th class="py-2 text-right">Nominal</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-300 text-slate-900">
            <tr v-for="(item, index) in filteredTransactions" :key="index">
              <td class="py-2">{{ index + 1 }}</td>
              <td class="py-2">
                <span>{{ item.label }}</span>
              </td>
              <td class="py-2">{{ item.tanggal }}</td>
              <td class="py-2 text-right font-bold" :class="item.type === 'pemasukan' ? 'text-emerald-700' : 'text-rose-700'">
                {{ item.type === 'pemasukan' ? '+' : '-' }}{{ formatRupiah(item.nominal) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- History Popup Modal -->
    <div 
      v-if="isHistoryModalOpen" 
      class="fixed inset-0 bg-slate-900/30 backdrop-blur-xl flex items-center justify-center z-50 p-4"
      @click.self="closeHistoryModal"
    >
      <div class="bg-white border border-slate-200 rounded-2xl w-full max-w-5xl md:max-w-6xl h-[88vh] max-h-[88vh] flex flex-col shadow-2xl overflow-hidden transform transition-all duration-300 ease-out scale-100">
        
        <!-- Modal Header -->
        <div class="p-6 border-b border-slate-150 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 class="text-xs font-black uppercase tracking-widest text-slate-800">Detail Riwayat Kas</h3>
            <p class="text-[9px] font-black text-emerald-600 uppercase tracking-wider mt-0.5">Semua catatan kas organisasi FORMULA</p>
          </div>
          <button 
            @click="closeHistoryModal" 
            class="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer focus:outline-none"
          >
            <font-awesome-icon icon="times" class="text-xs" />
          </button>
        </div>

        <!-- Modal Controls -->
        <div class="p-5 border-b border-slate-150 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-white">
          <div class="flex items-center gap-2">
            <span class="text-[10px] font-black uppercase tracking-wider text-slate-500">Tampilkan</span>
            <!-- Custom Select -->
            <select v-model="perPage" class="px-2 py-1 bg-white border border-slate-200 rounded-md text-xs font-bold text-slate-700 focus:outline-none cursor-pointer">
              <option :value="5">5</option>
              <option :value="10">10</option>
              <option :value="25">25</option>
              <option :value="50">50</option>
            </select>
          </div>
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Cari keterangan..." 
            class="px-3.5 py-2 bg-white border border-slate-200 rounded-md text-xs text-slate-855 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 w-full sm:w-64"
          >
        </div>

        <!-- Modal Table Body (Scrollable & FULL Table) -->
        <div class="p-4 overflow-y-auto flex-grow">
          <table class="w-full text-left text-xs border-collapse min-w-[500px]">
            <thead>
              <tr class="text-slate-500 uppercase font-black text-[9px] tracking-widest border-b border-slate-200/75 bg-slate-50/20">
                <!-- Checkbox Column -->
                <th class="p-4 text-center w-12">
                  <input 
                    type="checkbox" 
                    :checked="selectedTransactions.length === filteredTransactions.length && filteredTransactions.length > 0"
                    @change="toggleSelectAll"
                    class="w-4 h-4 rounded text-emerald-600 border-slate-350 focus:ring-emerald-500 cursor-pointer"
                  >
                </th>
                <th class="p-4 w-12">No</th>
                <th class="p-4">Keterangan</th>
                <th class="p-4">Tanggal</th>
                <th class="p-4 text-right">Nominal</th>
                <th class="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-150">
              <tr v-for="(item, index) in filteredTransactions" :key="index" class="hover:bg-slate-50 transition-colors">
                <!-- Checkbox Cell -->
                <td class="p-4 text-center">
                  <input 
                    type="checkbox" 
                    v-model="selectedTransactions" 
                    :value="item.id || index"
                    class="w-4 h-4 rounded text-emerald-600 border-slate-350 focus:ring-emerald-500 cursor-pointer"
                  >
                </td>
                <td class="p-4 text-slate-500 font-bold">{{ index + 1 }}</td>
                <td class="p-4">
                  <span class="font-bold text-slate-800">{{ item.label }}</span>
                </td>
                <td class="p-4 text-slate-600 font-medium">{{ item.tanggal }}</td>
                <td class="p-4 text-right font-black whitespace-nowrap" :class="item.type === 'pemasukan' ? 'text-emerald-600' : 'text-rose-600'">
                  {{ item.type === 'pemasukan' ? '+' : '-' }}{{ formatRupiah(item.nominal) }}
                </td>
                <td class="p-4 text-center flex items-center justify-center gap-2">
                  <!-- Print Single Receipt Button -->
                  <button 
                    @click="printSingleTransaction(item)" 
                    class="p-2 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 hover:bg-emerald-600 hover:text-white transition-all cursor-pointer shadow-xs"
                    title="Cetak Kuitansi Transaksi Ini"
                  >
                    <font-awesome-icon icon="print" class="text-xs" />
                  </button>
                  <!-- Delete Transaction Button -->
                  <button 
                    @click="deleteTransaction(index)" 
                    class="p-2 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 hover:bg-rose-600 hover:text-white transition-all cursor-pointer shadow-xs"
                    title="Hapus Catatan"
                  >
                    <font-awesome-icon icon="trash" class="text-xs" />
                  </button>
                </td>
              </tr>
              <tr v-if="filteredTransactions.length === 0">
                <td colspan="6" class="p-12 text-center text-slate-400 font-bold uppercase tracking-wider text-xs">
                  Tidak ada catatan kas ditemukan
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Modal Footer -->
        <div class="p-5 border-t border-slate-150 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-black uppercase tracking-wider text-slate-500">
          <span>Menampilkan {{ filteredTransactions.length }} catatan kas</span>
          <div class="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <!-- Batch Print Button -->
            <button 
              @click="printSelectedTransactions"
              class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-750 text-white rounded-xl transition-all cursor-pointer shadow-xs font-black uppercase tracking-wider flex items-center gap-2 text-[10px]"
            >
              <font-awesome-icon icon="print" /> Cetak Bukti Transaksi ({{ selectedTransactions.length }})
            </button>
            <button 
              @click="closeHistoryModal" 
              class="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl transition-all cursor-pointer shadow-xs font-bold"
            >
              Tutup
            </button>
          </div>
        </div>

      </div>
    </div>
  </AdminLayout>
</template>
