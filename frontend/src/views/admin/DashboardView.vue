<script setup>
import { computed } from 'vue'
import AdminLayout from '../../layouts/AdminLayout.vue'
import { useSocialStore } from '../../stores/social'

const socialStore = useSocialStore()

const totalUsers = computed(() => Object.keys(socialStore.users).length)
const totalBalance = computed(() => socialStore.kasData.saldo)
const totalAgendas = computed(() => socialStore.agendaKegiatan.length)

const formatRupiah = (val) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val)
}
</script>

<template>
  <AdminLayout>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white border border-slate-200/70 rounded-lg p-6 shadow-xs">
        <h3 class="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">Total Pengurus</h3>
        <p class="text-3xl font-black text-slate-900 leading-none">{{ totalUsers }}</p>
        <div class="mt-4 text-[10px] text-emerald-600 font-black uppercase tracking-wider">↑ Aktif & Terverifikasi</div>
      </div>
      <div class="bg-white border border-slate-200/70 rounded-lg p-6 shadow-xs">
        <h3 class="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">Kas Organisasi</h3>
        <p class="text-3xl font-black text-emerald-600 leading-none">{{ formatRupiah(totalBalance) }}</p>
        <div class="mt-4 text-[10px] text-slate-500 font-black uppercase tracking-wider">Saldo saat ini</div>
      </div>
      <div class="bg-white border border-slate-200/70 rounded-lg p-6 shadow-xs">
        <h3 class="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">Agenda & Rapat</h3>
        <p class="text-3xl font-black text-slate-900 leading-none">{{ totalAgendas }}</p>
        <div class="mt-4 text-[10px] text-teal-600 font-black uppercase tracking-wider">Telah dipublikasi</div>
      </div>
    </div>

    <div class="mt-8 bg-white border border-slate-200/70 rounded-lg overflow-hidden shadow-xs">
      <div class="p-6 border-b border-slate-150 flex justify-between items-center bg-slate-50/50">
        <h3 class="text-xs font-black uppercase tracking-widest text-slate-800">Log Aktivitas Terbaru</h3>
        <span class="text-[9px] font-black text-slate-500 uppercase tracking-widest">Sistem Harian</span>
      </div>
      <div class="divide-y divide-slate-150">
        <div class="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500">
               <font-awesome-icon icon="users" class="text-emerald-600 text-sm" />
            </div>
            <div>
              <p class="text-xs font-black text-slate-800 uppercase tracking-wider">Sistem Berjalan Stabil</p>
              <p class="text-[10px] text-slate-500 mt-1">Data sinkronisasi Pinia tersimpan otomatis</p>
            </div>
          </div>
          <span class="px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[9px] font-black uppercase tracking-wider rounded-lg">Aktif</span>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>
