<script setup>
import { ref, computed, watch } from 'vue'
import { useSocialStore } from '../../../stores/social'
import { useToast } from '../../../composables/useToast'
import Select from 'primevue/select'
import Swal from 'sweetalert2'

const socialStore = useSocialStore()
const { showToast } = useToast()

const searchQuery = ref('')

// ── Edit Mode ──────────────────────────────────────────
const isEditOpen = ref(false)
const editForm = ref({ id: null, email: '', name: '', role: 'anggota', title: '', age: '', hobby: '', quote: '' })
const isSavingEdit = ref(false)

const roleOptions = [
  { label: 'Admin',       value: 'admin',      title: 'Administrator' },
  { label: 'Bendahara',   value: 'bendahara',  title: 'Bendahara FORMULA' },
  { label: 'Sekretaris',  value: 'sekertaris', title: 'Sekretaris FORMULA' },
  { label: 'Anggota',     value: 'anggota',    title: 'Anggota FORMULA' }
]
const roleBadge = (r) => ({
  admin: 'bg-rose-50 border-rose-100 text-rose-700',
  bendahara: 'bg-amber-50 border-amber-100 text-amber-700',
  sekertaris: 'bg-indigo-50 border-indigo-100 text-indigo-700'
}[r] || 'bg-emerald-50 border-emerald-100 text-emerald-700')

const openEdit = (user) => {
  editForm.value = { id: user.id, email: user.email, name: user.name, role: user.role || 'anggota', title: user.title || '', age: user.age || '', hobby: user.hobby || '', quote: user.quote || '' }
  isEditOpen.value = true
}
const saveEdit = async () => {
  if (!editForm.value.name.trim()) return showToast('Nama wajib diisi!', 'warning')
  isSavingEdit.value = true
  const API = 'http://localhost:8000/api'
  const computedTitle = editForm.value.title || roleOptions.find(r=>r.value===editForm.value.role)?.title || 'Anggota FORMULA'
  try {
    const res = await fetch(`${API}/members/${editForm.value.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editForm.value.name, email: editForm.value.email, role: editForm.value.role, title: computedTitle, age: editForm.value.age, hobby: editForm.value.hobby, quote: editForm.value.quote })
    })
    if (res.ok) { await socialStore.fetchMembers(); showToast('Data anggota diperbarui! ✅', 'success'); isEditOpen.value = false }
    else showToast('Gagal menyimpan!', 'error')
  } catch { showToast('Koneksi error!', 'error') }
  isSavingEdit.value = false
}

// ── Detail Popup ───────────────────────────────────────
const isDetailOpen = ref(false)
const detailUser = ref(null)
const showLoginPanel = ref(false)
const loginForm = ref({ role: 'anggota', password: '' })
const isSavingLogin = ref(false)
const roleSelectOpts = roleOptions.map(r => ({ label: r.label, value: r.value }))

const openDetail = async (user) => {
  detailUser.value = user
  showLoginPanel.value = false
  loginForm.value = { role: user.role || 'anggota', email: user.email, password: '' }
  isDetailOpen.value = true
  for (const actName of allActivityNames.value) {
    await socialStore.fetchAttendance(actName)
  }
}

const allActivityNames = computed(() => {
  const names = []
  socialStore.agendaKegiatan?.forEach(a => names.push(a.judul))
  socialStore.hasilRapat?.forEach(r => names.push(r.judul))
  return names
})

const memberAttendance = computed(() => {
  if (!detailUser.value) return []
  const result = []
  const absensi = socialStore.absensi || {}
  for (const [actName, map] of Object.entries(absensi)) {
    const status = map[detailUser.value.email]
    if (status) result.push({ kegiatan: actName, status })
  }
  return result
})

const hadir = computed(() => memberAttendance.value.filter(a => a.status === 'Hadir').length)
const izin = computed(() => memberAttendance.value.filter(a => a.status === 'Izin' || a.status === 'Sakit').length)
const alfa = computed(() => memberAttendance.value.filter(a => a.status === 'Alfa').length)

const kasRiwayat = computed(() => socialStore.kasData?.riwayat?.slice(0, 5) || [])

const saveLogin = async () => {
  isSavingLogin.value = true
  const API = 'http://localhost:8000/api'
  const payload = { name: detailUser.value.name, email: loginForm.value.email.trim().toLowerCase(), role: loginForm.value.role, title: roleOptions.find(r=>r.value===loginForm.value.role)?.title || 'Anggota FORMULA' }
  if (loginForm.value.password.trim()) {
    if (loginForm.value.password.length < 6) { showToast('Password minimal 6 karakter!', 'warning'); isSavingLogin.value = false; return }
    payload.password = loginForm.value.password.trim()
  }
  try {
    const res = await fetch(`${API}/members/${detailUser.value.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (res.ok) { await socialStore.fetchMembers(); showToast('Akses login diperbarui! 🔐', 'success'); showLoginPanel.value = false }
    else showToast('Gagal memperbarui!', 'error')
  } catch { showToast('Koneksi error!', 'error') }
  isSavingLogin.value = false
}

// ── Table ──────────────────────────────────────────────
const userList = computed(() => {
  const list = Object.values(socialStore.users)
  if (!searchQuery.value.trim()) return list
  const q = searchQuery.value.toLowerCase()
  return list.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || (u.role||'').toLowerCase().includes(q))
})

const handleDelete = (user) => {
  if (user.email === 'admin@formula.org' || user.email === socialStore.currentUser?.email) return showToast('Tidak dapat menghapus administrator aktif!', 'error')
  Swal.fire({ title: 'Hapus Anggota?', text: 'Data anggota ini akan terhapus permanen!', icon: 'warning', showCancelButton: true, confirmButtonColor: '#f43f5e', cancelButtonColor: '#475569', confirmButtonText: 'Hapus!' })
    .then(async r => { if (r.isConfirmed) { const res = await socialStore.deleteMember(user.id); if (res.success) showToast('Anggota dihapus!', 'success'); else showToast('Gagal menghapus!', 'error') } })
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between gap-4">
      <div>
        <h1 class="text-xl font-black text-slate-900 tracking-tight">Daftar Anggota</h1>
        <p class="text-xs text-slate-400 font-semibold mt-0.5">Klik baris anggota untuk melihat detail lengkap</p>
      </div>
      <div class="relative w-64">
        <font-awesome-icon icon="search" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]" />
        <input v-model="searchQuery" placeholder="Cari anggota..." class="w-full pl-8 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-xs">
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-2xl shadow-xs border border-slate-200/70 overflow-hidden">
      <table class="w-full text-xs text-left">
        <thead class="bg-slate-50/80 border-b border-slate-100">
          <tr class="text-[9px] font-black uppercase tracking-widest text-slate-500">
            <th class="px-5 py-3.5 w-10 text-center">No</th>
            <th class="px-5 py-3.5">Anggota</th>
            <th class="px-5 py-3.5">Jabatan</th>
            <th class="px-5 py-3.5">Email</th>
            <th class="px-5 py-3.5">Level</th>
            <th class="px-5 py-3.5 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-50">
          <tr v-for="(user, i) in userList" :key="user.email"
            @click="openDetail(user)"
            class="hover:bg-emerald-50/40 transition-colors cursor-pointer border-b border-slate-50 last:border-0">
            <td class="px-5 py-4 text-center text-slate-400 font-bold">{{ i + 1 }}</td>
            <td class="px-5 py-4">
              <div class="flex items-center gap-3">
                <img :src="user.avatar" class="w-9 h-9 rounded-full object-cover border border-slate-200 flex-shrink-0">
                <div>
                  <p class="font-black text-slate-800 uppercase leading-tight">{{ user.name }}</p>
                  <p v-if="user.id === socialStore.currentUser?.id" class="text-[8px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded mt-0.5 inline-block">Saya</p>
                </div>
              </div>
            </td>
            <td class="px-5 py-4 text-slate-600 font-semibold">{{ user.title || 'Anggota FORMULA' }}</td>
            <td class="px-5 py-4 text-slate-500 font-medium">{{ user.email }}</td>
            <td class="px-5 py-4">
              <span :class="['px-2.5 py-1 rounded text-[8px] font-black uppercase tracking-wider border', roleBadge(user.role)]">{{ user.role || 'anggota' }}</span>
            </td>
            <td class="px-5 py-4">
              <div class="flex items-center justify-center gap-1.5">
                <button @click.stop="openEdit(user)" class="w-8 h-8 bg-emerald-50 border border-emerald-100 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-lg flex items-center justify-center transition-all cursor-pointer" title="Edit Profil">
                  <font-awesome-icon icon="edit" class="text-xs" />
                </button>
                <button @click.stop="handleDelete(user)" class="w-8 h-8 bg-rose-50 border border-rose-100 text-rose-600 hover:bg-rose-600 hover:text-white rounded-lg flex items-center justify-center transition-all cursor-pointer" title="Hapus">
                  <font-awesome-icon icon="trash" class="text-xs" />
                </button>
              </div>
            </td>
          </tr>
          <tr v-if="userList.length === 0">
            <td colspan="6" class="p-14 text-center text-slate-400 font-bold uppercase tracking-wider">Tidak ada anggota ditemukan</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ── EDIT MODAL ──────────────────────────────── -->
    <transition name="fade-modal">
      <div v-if="isEditOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
        <div class="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-md relative">
          <div class="p-5 border-b border-slate-100 flex justify-between items-center">
            <div>
              <h3 class="text-xs font-black uppercase tracking-widest text-slate-800">Edit Profil Anggota</h3>
              <p class="text-[9px] text-slate-400 font-semibold mt-0.5">Ubah data profil {{ editForm.name }}</p>
            </div>
            <button @click="isEditOpen = false" class="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer transition-colors">
              <font-awesome-icon icon="times" class="text-xs" />
            </button>
          </div>
          <div class="p-5 space-y-3 max-h-[65vh] overflow-y-auto">
            <div>
              <label class="block text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Nama Lengkap</label>
              <input v-model="editForm.name" class="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500">
            </div>
            <div>
              <label class="block text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Jabatan</label>
              <input v-model="editForm.title" placeholder="Cth: Divisi Humas" class="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500">
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Umur</label>
                <input v-model="editForm.age" placeholder="22 Tahun" class="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500">
              </div>
              <div>
                <label class="block text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Hobi</label>
                <input v-model="editForm.hobby" placeholder="Hobi" class="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500">
              </div>
            </div>
            <div>
              <label class="block text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">Quote / Motto</label>
              <textarea v-model="editForm.quote" rows="2" class="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"></textarea>
            </div>
          </div>
          <div class="p-5 border-t border-slate-100 flex justify-end gap-2.5">
            <button @click="isEditOpen = false" class="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-wider cursor-pointer hover:bg-slate-50">Batal</button>
            <button @click="saveEdit" :disabled="isSavingEdit" class="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-black uppercase tracking-wider cursor-pointer flex items-center gap-1.5 disabled:opacity-60">
              <span v-if="isSavingEdit" class="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></span>
              {{ isSavingEdit ? 'Menyimpan...' : 'Simpan Profil' }}
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- ── DETAIL POPUP ────────────────────────────── -->
    <transition name="fade-modal">
      <div v-if="isDetailOpen && detailUser" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
        <div class="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-2xl max-h-[90vh] flex flex-col relative">
          
          <!-- Header -->
          <div class="p-5 border-b border-slate-100 flex items-center justify-between gap-4 flex-shrink-0">
            <div class="flex items-center gap-3">
              <img :src="detailUser.avatar" class="w-12 h-12 rounded-full object-cover border-2 border-emerald-100">
              <div>
                <h3 class="text-sm font-black text-slate-800 uppercase leading-tight">{{ detailUser.name }}</h3>
                <p class="text-[9px] text-slate-400 font-semibold mt-0.5">{{ detailUser.title || 'Anggota FORMULA' }}</p>
                <span :class="['px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border inline-block mt-0.5', roleBadge(detailUser.role)]">{{ detailUser.role || 'anggota' }}</span>
              </div>
            </div>
            <button @click="isDetailOpen = false; showLoginPanel = false" class="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer transition-colors flex-shrink-0">
              <font-awesome-icon icon="times" class="text-xs" />
            </button>
          </div>

          <!-- Body -->
          <div class="flex-1 overflow-y-auto p-5 space-y-5">

            <!-- Info Grid -->
            <div class="grid grid-cols-3 gap-3">
              <div class="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <p class="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">Email</p>
                <p class="text-[10px] font-bold text-slate-700 truncate">{{ detailUser.email }}</p>
              </div>
              <div class="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <p class="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">Umur</p>
                <p class="text-[10px] font-bold text-slate-700">{{ detailUser.age || '-' }}</p>
              </div>
              <div class="bg-slate-50 rounded-xl p-3 border border-slate-100">
                <p class="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-1">Hobi</p>
                <p class="text-[10px] font-bold text-slate-700 truncate">{{ detailUser.hobby || '-' }}</p>
              </div>
            </div>

            <div v-if="detailUser.quote" class="bg-emerald-50 border border-emerald-100 rounded-xl p-3">
              <p class="text-[9px] font-black uppercase tracking-widest text-emerald-500 mb-1">Quote</p>
              <p class="text-xs text-slate-700 italic font-medium">"{{ detailUser.quote }}"</p>
            </div>

            <!-- Absensi -->
            <div>
              <div class="flex items-center justify-between mb-3">
                <h4 class="text-[9px] font-black uppercase tracking-widest text-slate-500">Riwayat Absensi</h4>
                <div class="flex gap-2 text-[8px] font-black uppercase">
                  <span class="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded">✅ {{ hadir }} Hadir</span>
                  <span class="bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded">📋 {{ izin }} Izin</span>
                  <span class="bg-rose-50 text-rose-700 border border-rose-100 px-2 py-0.5 rounded">❌ {{ alfa }} Alfa</span>
                </div>
              </div>
              <div class="space-y-1.5 max-h-36 overflow-y-auto">
                <div v-if="memberAttendance.length === 0" class="text-center py-4 text-[10px] text-slate-400 font-bold uppercase">Belum ada data absensi</div>
                <div v-for="(a, i) in memberAttendance" :key="i" class="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-lg border border-slate-100">
                  <p class="text-[10px] font-semibold text-slate-700 truncate flex-1 mr-3">{{ a.kegiatan }}</p>
                  <span :class="['px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wide', a.status === 'Hadir' ? 'bg-emerald-50 text-emerald-700' : a.status === 'Alfa' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700']">{{ a.status }}</span>
                </div>
              </div>
            </div>

            <!-- Kas Terbaru -->
            <div>
              <h4 class="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-3">Riwayat Kas Terbaru</h4>
              <div class="space-y-1.5">
                <div v-if="kasRiwayat.length === 0" class="text-center py-4 text-[10px] text-slate-400 font-bold uppercase">Belum ada data kas</div>
                <div v-for="k in kasRiwayat" :key="k.id" class="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-lg border border-slate-100">
                  <div class="flex-1 min-w-0 mr-3">
                    <p class="text-[10px] font-semibold text-slate-700 truncate">{{ k.label }}</p>
                    <p class="text-[8px] text-slate-400 font-medium mt-0.5">{{ k.tanggal }}</p>
                  </div>
                  <p :class="['text-[10px] font-black whitespace-nowrap', k.type === 'pemasukan' ? 'text-emerald-600' : 'text-rose-600']">
                    {{ k.type === 'pemasukan' ? '+' : '-' }} Rp {{ k.nominal.toLocaleString('id-ID') }}
                  </p>
                </div>
              </div>
            </div>

          </div>

          <!-- Footer -->
          <div class="p-4 border-t border-slate-100 flex items-center justify-between flex-shrink-0 bg-slate-50/50">
            <p class="text-[9px] text-slate-400 font-semibold">ID: #{{ detailUser.id }}</p>
            <button
              @click="showLoginPanel = true"
              class="px-4 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-wider cursor-pointer transition-all flex items-center gap-2 active:scale-95 bg-slate-800 hover:bg-slate-900 text-white"
            >
              <font-awesome-icon icon="key" class="text-xs" />
              Kelola Akses Login
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- ── LOGIN ACCESS POPUP (z-60) ──────────────────── -->
    <transition name="fade-modal">
      <div v-if="showLoginPanel && detailUser" class="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <div class="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-sm">
          <!-- Header -->
          <div class="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div>
              <h3 class="text-xs font-black uppercase tracking-widest text-slate-800">🔐 Akses Login</h3>
              <p class="text-[9px] text-slate-400 font-semibold mt-0.5">{{ detailUser.name }}</p>
            </div>
            <button @click="showLoginPanel = false" class="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer transition-colors">
              <font-awesome-icon icon="times" class="text-xs" />
            </button>
          </div>

          <!-- Fields -->
          <div class="p-5 space-y-4">
            <div>
              <label class="block text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1.5">Email / Username</label>
              <input v-model="loginForm.email" type="email" class="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all">
            </div>
            <div>
              <label class="block text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1.5">Level Hak Akses</label>
              <Select v-model="loginForm.role" :options="roleSelectOpts" optionLabel="label" optionValue="value" class="w-full text-xs rounded-lg" />
            </div>
            <div>
              <label class="block text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1.5">Kata Sandi Baru</label>
              <input v-model="loginForm.password" type="password" placeholder="Kosongkan jika tidak ingin diubah" class="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all">
            </div>
          </div>

          <!-- Footer -->
          <div class="p-5 border-t border-slate-100 flex justify-end gap-2.5">
            <button @click="showLoginPanel = false" class="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-[10px] font-black uppercase tracking-wider cursor-pointer hover:bg-slate-50">Batal</button>
            <button @click="saveLogin" :disabled="isSavingLogin" class="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-black uppercase tracking-wider cursor-pointer flex items-center gap-1.5 disabled:opacity-60">
              <span v-if="isSavingLogin" class="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></span>
              {{ isSavingLogin ? 'Menyimpan...' : 'Simpan Akses' }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.fade-modal-enter-active, .fade-modal-leave-active { transition: opacity 0.2s ease; }
.fade-modal-enter-from, .fade-modal-leave-to { opacity: 0; }
.slide-panel-enter-active, .slide-panel-leave-active { transition: all 0.25s ease; }
.slide-panel-enter-from, .slide-panel-leave-to { opacity: 0; transform: translateY(-8px); }
</style>
