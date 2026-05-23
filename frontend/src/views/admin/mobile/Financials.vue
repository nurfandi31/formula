<script setup>
import { ref, computed, onMounted } from 'vue'
import { useSocialStore } from '../../../stores/social'
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
const perPage = ref(5)
const isHistoryModalOpen = ref(false)
const selectedTransactions = ref([])
const isAddModalOpen = ref(false)

const openHistoryModal = () => {
  isHistoryModalOpen.value = true
}

const closeHistoryModal = () => {
  isHistoryModalOpen.value = false
  selectedTransactions.value = []
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

const filteredTransactions = computed(() => {
  let list = socialStore.kasData.riwayat
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim()
    list = list.filter(item => item.label.toLowerCase().includes(q) || item.tanggal.toLowerCase().includes(q))
  }
  return list.slice(0, perPage.value)
})

const isSavingBalance = ref(false)

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
    transactionDate.value = new Date()
    isAddModalOpen.value = false
    Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Transaksi berhasil diinput!', timer: 1500, showConfirmButton: false })
  } else {
    Swal.fire({ icon: 'error', title: 'Gagal', text: 'Gagal menyimpan transaksi!', confirmButtonColor: '#10b981' })
  }
}

const deleteTransaction = (index) => {
  const item = socialStore.kasData.riwayat[index]
  Swal.fire({
    title: 'Hapus transaksi?',
    text: 'Aksi ini akan menghapus catatan transaksi!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#f43f5e',
    cancelButtonColor: '#475569',
    confirmButtonText: 'Hapus',
    cancelButtonText: 'Batal'
  }).then(async (result) => {
    if (result.isConfirmed) {
      const res = await socialStore.deleteKasTransaction(item.id)
      if (res.success) {
        Swal.fire({ icon: 'success', title: 'Terhapus', text: 'Transaksi telah berhasil dihapus.', timer: 1500, showConfirmButton: false })
      }
    }
  })
}

const formatRupiah = (val) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val)
}

const rekapSaldo = async () => {
  isSavingBalance.value = true
  
  const labelTx = `Rekapitulasi Saldo Kas (Otomatis)`
  const nominalAdjust = 0
  const typeTx = 'pemasukan'
  
  const now = new Date()
  const dateStr = `${now.getDate()} ${now.toLocaleString('id-ID', { month: 'short' })} ${now.getFullYear()}`

  setTimeout(async () => {
    const res = await socialStore.addKasTransaction(
      labelTx,
      nominalAdjust,
      typeTx,
      dateStr
    )

    isSavingBalance.value = false

    if (res.success) {
      Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Rekapitulasi saldo kas berhasil di-generate! 💰', timer: 2000, showConfirmButton: false })
    } else {
      Swal.fire({ icon: 'error', title: 'Gagal', text: 'Gagal melakukan rekapitulasi saldo!', confirmButtonColor: '#10b981' })
    }
  }, 1000)
}

onMounted(async () => {
  await socialStore.fetchKasData()
})
</script>

<template>
  <div class="space-y-6">
    <div class="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-6 border border-slate-800 shadow-xl space-y-6 relative overflow-hidden">
      <div class="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none"></div>
      
      <div>
        <span class="text-[9px] font-black uppercase tracking-widest text-slate-400">Total Saldo Kas</span>
        <h2 class="text-3xl font-black mt-1 text-emerald-400">{{ formatRupiah(socialStore.kasData.saldo) }}</h2>
      </div>

      <div class="pt-4 border-t border-slate-800/80 flex items-center justify-between">
        <div class="grid grid-cols-2 gap-4 flex-grow">
          <div>
            <span class="text-[8px] font-black uppercase tracking-wider text-slate-500 block">Pemasukan</span>
            <span class="text-sm font-black text-emerald-500 mt-1 block">{{ formatRupiah(socialStore.kasData.pemasukan) }}</span>
          </div>
          <div>
            <span class="text-[8px] font-black uppercase tracking-wider text-slate-500 block">Pengeluaran</span>
            <span class="text-sm font-black text-rose-500 mt-1 block">{{ formatRupiah(socialStore.kasData.pengeluaran) }}</span>
          </div>
        </div>
        <button @click="rekapSaldo" class="ml-4 py-2 px-3 bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-white border border-white/15 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 cursor-pointer">
          <font-awesome-icon icon="save" /> Rekap
        </button>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-3">
      <button @click="isAddModalOpen = true" class="py-4 bg-emerald-600 active:bg-emerald-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2">
        <font-awesome-icon icon="plus" /> Transaksi Baru
      </button>
      <button @click="openHistoryModal" class="py-4 bg-white border border-slate-200 text-slate-800 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xs active:bg-slate-50 transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2">
        <font-awesome-icon icon="list" /> Riwayat Kas
      </button>
    </div>

    <div class="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-4 shadow-xs">
      <div class="flex justify-between items-center">
        <h3 class="text-xs font-black uppercase tracking-wider text-slate-800">Mutasi Terakhir</h3>
        <span class="text-[8px] font-black text-slate-400 uppercase tracking-widest">Otomatis</span>
      </div>

      <div class="space-y-3">
        <div 
          v-for="(item, idx) in socialStore.kasData.riwayat.slice(0, 5)" 
          :key="idx"
          class="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-150 rounded-xl transition-all"
        >
          <div class="flex items-center gap-3">
            <div :class="['w-8 h-8 rounded-full flex items-center justify-center text-xs', item.type === 'pemasukan' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600']">
              <font-awesome-icon :icon="item.type === 'pemasukan' ? 'arrow-down' : 'arrow-up'" />
            </div>
            <div>
              <h4 class="text-xs font-black text-slate-800 leading-tight">{{ item.label }}</h4>
              <p class="text-[8px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{{ item.tanggal }}</p>
            </div>
          </div>
          <div class="text-right">
            <span :class="['text-xs font-black leading-tight', item.type === 'pemasukan' ? 'text-emerald-600' : 'text-rose-600']">
              {{ item.type === 'pemasukan' ? '+' : '-' }}{{ formatRupiah(item.nominal) }}
            </span>
          </div>
        </div>

        <div v-if="socialStore.kasData.riwayat.length === 0" class="p-6 text-center text-slate-400 font-bold text-xs uppercase tracking-wide">
          Belum ada catatan mutasi
        </div>
      </div>
    </div>

    <div v-if="isAddModalOpen" class="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-end justify-center">
      <div class="fixed inset-0" @click="isAddModalOpen = false"></div>
      
      <div class="bg-white w-full rounded-t-3xl p-6 space-y-4 relative z-10 shadow-2xl border-t border-slate-100 animate-in slide-in-from-bottom duration-300">
        <div class="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-2"></div>
        
        <div class="flex justify-between items-center pb-2 border-b border-slate-100">
          <h3 class="text-xs font-black uppercase tracking-widest text-slate-800">Input Transaksi Kas</h3>
          <button @click="isAddModalOpen = false" class="text-slate-400 hover:text-slate-600 font-bold text-sm">✕</button>
        </div>

        <div class="space-y-4 py-2">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-[8px] font-black uppercase tracking-wider text-slate-500 mb-1">Tanggal</label>
              <DatePicker v-model="transactionDate" dateFormat="dd M yy" class="w-full rounded-xl" inputClass="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800" />
            </div>
            <div>
              <label class="block text-[8px] font-black uppercase tracking-wider text-slate-500 mb-1">Jenis</label>
              <Select v-model="transactionType" :options="typeOptions" optionLabel="label" optionValue="value" class="w-full text-xs rounded-xl" />
            </div>
          </div>

          <div>
            <label class="block text-[8px] font-black uppercase tracking-wider text-slate-500 mb-1">Keterangan</label>
            <textarea v-model="transactionLabel" rows="2" placeholder="Contoh: ATK, fotokopi..." class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 resize-none font-sans"></textarea>
          </div>

          <div>
            <label class="block text-[8px] font-black uppercase tracking-wider text-slate-500 mb-1">Nominal (Rupiah)</label>
            <InputNumber v-model="transactionNominal" class="w-full rounded-xl" inputClass="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800" mode="currency" currency="IDR" locale="id-ID" placeholder="Rp 0" />
          </div>

          <button @click="addTransaction" class="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer">
            Simpan Transaksi
          </button>
        </div>
      </div>
    </div>

    <div v-if="isHistoryModalOpen" class="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-end justify-center">
      <div class="fixed inset-0" @click="closeHistoryModal"></div>
      
      <div class="bg-white w-full h-[90vh] rounded-t-3xl relative z-10 shadow-2xl border-t border-slate-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
        <div class="w-12 h-1 bg-slate-200 rounded-full mx-auto my-3 flex-shrink-0"></div>
        
        <div class="px-6 pb-4 border-b border-slate-100 flex justify-between items-center">
          <div>
            <h3 class="text-xs font-black uppercase tracking-widest text-slate-800">Riwayat Kas Lengkap</h3>
            <p class="text-[8px] text-slate-400 uppercase tracking-wider">Mutasi Kas Organisasi</p>
          </div>
          <button @click="closeHistoryModal" class="text-slate-400 hover:text-slate-600 font-bold text-sm">✕</button>
        </div>

        <div class="p-4 border-b border-slate-100 flex gap-2">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Cari keterangan..." 
            class="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
          >
          <select v-model="perPage" class="px-2 py-1 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700">
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="25">25</option>
          </select>
        </div>

        <div class="flex-grow overflow-y-auto p-4 space-y-3">
          <div 
            v-for="(item, idx) in filteredTransactions" 
            :key="idx" 
            class="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-150 rounded-xl"
          >
            <div class="flex items-center gap-3">
              <div :class="['w-7 h-7 rounded-full flex items-center justify-center text-[10px]', item.type === 'pemasukan' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600']">
                <font-awesome-icon :icon="item.type === 'pemasukan' ? 'arrow-down' : 'arrow-up'" />
              </div>
              <div>
                <h4 class="text-xs font-black text-slate-800 leading-tight">{{ item.label }}</h4>
                <p class="text-[8px] text-slate-400 font-bold mt-0.5">{{ item.tanggal }}</p>
              </div>
            </div>
            <div class="text-right flex items-center gap-3">
              <span :class="['text-xs font-black', item.type === 'pemasukan' ? 'text-emerald-600' : 'text-rose-600']">
                {{ item.type === 'pemasukan' ? '+' : '-' }}{{ formatRupiah(item.nominal) }}
              </span>
              <button 
                @click="printSingleTransaction(item)" 
                class="w-6 h-6 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-750 flex items-center justify-center text-[9px]"
              >
                <font-awesome-icon icon="print" />
              </button>
            </div>
          </div>

          <div v-if="filteredTransactions.length === 0" class="p-12 text-center text-slate-400 font-bold uppercase tracking-wider text-xs">
            Tidak ada transaksi
          </div>
        </div>

        <div class="p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-[8px] font-black uppercase text-slate-500">
          <span>{{ filteredTransactions.length }} Catatan</span>
          <button @click="closeHistoryModal" class="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl font-bold">Tutup</button>
        </div>
      </div>
    </div>
    
    <!-- Fullscreen Blurred Loading Overlay for Rekap Saldo (Notification Style) -->
    <div v-if="isSavingBalance" class="fixed inset-0 bg-slate-950/30 backdrop-blur-md z-50 flex items-center justify-center p-5 animate-in fade-in duration-300">
      <div class="bg-white/95 border border-slate-200/60 rounded-3xl p-6 max-w-[280px] w-full shadow-2xl flex flex-col items-center text-center space-y-4 backdrop-blur-xl animate-in zoom-in-95 duration-300">
        <div class="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-inner">
          <div class="animate-spin rounded-full h-6 w-6 border-2 border-emerald-500 border-t-transparent"></div>
        </div>
        <div class="space-y-1.5">
          <h3 class="text-xs font-black uppercase tracking-wider text-slate-800">Rekapitulasi Saldo</h3>
          <p class="text-[9px] text-slate-500 leading-relaxed">
            Menyinkronkan seluruh riwayat kas, menghitung ulang mutasi dana masuk & keluar, serta memperbarui akumulasi laporan tahunan agar balance.
          </p>
        </div>
        <div class="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
          <div class="bg-emerald-500 h-full w-2/3 animate-[pulse_1.5s_infinite] rounded-full"></div>
        </div>
      </div>
    </div>
  </div>
</template>
