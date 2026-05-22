<script setup>
import { ref, computed } from 'vue'
import { useSocialStore } from '../../../stores/social'
import { useToast } from '../../../composables/useToast'
import Select from 'primevue/select'

const socialStore = useSocialStore()
const { showToast } = useToast()

const searchQuery = ref('')
const isModalOpen = ref(false)
const isLoading = ref(false)

// Data form edit
const editForm = ref({
  id: null,
  name: '',
  email: '',
  role: 'anggota',
  password: ''
})

const roleOptions = ref([
  { label: 'Admin', value: 'admin' },
  { label: 'Bendahara', value: 'bendahara' },
  { label: 'Sekretaris', value: 'sekertaris' },
  { label: 'Anggota', value: 'anggota' }
])

// Ambil list user dari store
const userList = computed(() => {
  const list = Object.values(socialStore.users)
  if (!searchQuery.value.trim()) return list
  const query = searchQuery.value.toLowerCase().trim()
  return list.filter(u => 
    u.name.toLowerCase().includes(query) || 
    u.email.toLowerCase().includes(query) || 
    u.role.toLowerCase().includes(query)
  )
})

// Buka Modal Edit
const openEditModal = (user) => {
  editForm.value = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    password: '' // Kosongkan password saat buka modal
  }
  isModalOpen.value = true
}

// Tutup Modal
const closeModal = () => {
  isModalOpen.value = false
}

// Simpan data login (Update Member)
const saveLoginAccess = async () => {
  if (!editForm.value.name.trim()) {
    showToast('Nama lengkap tidak boleh kosong!', 'warning')
    return
  }
  if (!editForm.value.email.trim()) {
    showToast('Email tidak boleh kosong!', 'warning')
    return
  }

  isLoading.value = true
  try {
    let computedTitle = 'Anggota FORMULA'
    if (editForm.value.role === 'admin') computedTitle = 'Administrator'
    else if (editForm.value.role === 'bendahara') computedTitle = 'Bendahara FORMULA'
    else if (editForm.value.role === 'sekertaris') computedTitle = 'Sekretaris FORMULA'

    const payload = {
      name: editForm.value.name.trim(),
      email: editForm.value.email.toLowerCase().trim(),
      role: editForm.value.role,
      title: computedTitle
    }

    if (editForm.value.password.trim()) {
      if (editForm.value.password.trim().length < 6) {
        showToast('Password minimal 6 karakter!', 'warning')
        isLoading.value = false
        return
      }
      payload.password = editForm.value.password.trim()
    }

    const API_BASE = 'http://localhost:8000/api'
    const res = await fetch(`${API_BASE}/members/${editForm.value.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    if (res.ok) {
      await socialStore.fetchMembers()
      showToast('Akses login pengguna berhasil diperbarui! 🔐', 'success')
      closeModal()
    } else {
      const err = await res.json().catch(() => ({}))
      showToast(err.message || 'Gagal memperbarui akses login.', 'error')
    }
  } catch (e) {
    showToast('Terjadi kesalahan koneksi ke server.', 'error')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-xl font-black text-slate-900 tracking-tight">Kelola Akses Login</h1>
        <p class="text-xs text-slate-400 font-semibold mt-0.5">Kelola kredensial akun, username/email, password, dan level hak akses user</p>
      </div>
      <div class="flex items-center gap-3">
        <div class="relative w-full sm:w-64">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Cari nama atau email..." 
            class="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all shadow-xs"
          >
        </div>
      </div>
    </div>

    <!-- Main Table Card -->
    <div class="bg-white rounded-xl shadow-md overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="text-slate-500 uppercase font-black text-[9px] tracking-widest border-b border-slate-100 bg-slate-50/50">
              <th class="p-4 w-12 text-center">No</th>
              <th class="p-4">Nama Pengguna</th>
              <th class="p-4">Alamat Email / Username</th>
              <th class="p-4">Kata Sandi</th>
              <th class="p-4 text-center">Level Akses</th>
              <th class="p-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="(user, index) in userList" :key="user.email" class="hover:bg-slate-50/50 transition-colors">
              <td class="p-4 text-center text-slate-400 font-bold">{{ index + 1 }}</td>
              <td class="p-4">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg overflow-hidden border border-slate-200 bg-slate-50 flex-shrink-0">
                    <img :src="user.avatar" class="w-full h-full object-cover" alt="avatar">
                  </div>
                  <div>
                    <span class="font-black text-slate-800 uppercase tracking-wide">{{ user.name }}</span>
                    <span v-if="user.id === socialStore.currentUser?.id" class="ml-2 px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[8px] font-black rounded uppercase">Saya</span>
                  </div>
                </div>
              </td>
              <td class="p-4">
                <span class="font-semibold text-slate-600">{{ user.email }}</span>
              </td>
              <td class="p-4">
                <span class="inline-flex items-center gap-1.5 px-2 py-1 bg-slate-100 text-slate-500 rounded text-[10px] font-bold">
                  <font-awesome-icon icon="lock" class="text-[8px]" />
                  <span>••••••••</span>
                </span>
              </td>
              <td class="p-4 text-center">
                <span :class="[
                  'px-2.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border leading-none inline-block',
                  user.role === 'admin' 
                    ? 'bg-rose-50 border-rose-100 text-rose-700' 
                    : user.role === 'bendahara'
                      ? 'bg-amber-50 border-amber-100 text-amber-700'
                      : user.role === 'sekertaris'
                        ? 'bg-indigo-50 border-indigo-100 text-indigo-700'
                        : 'bg-emerald-50 border-emerald-100 text-emerald-700'
                ]">
                  {{ user.role }}
                </span>
              </td>
              <td class="p-4 text-center">
                <button 
                  @click="openEditModal(user)" 
                  class="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-600 border border-emerald-200 text-emerald-700 hover:text-white rounded-lg transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-2xs text-[10px] font-black uppercase tracking-wider active:scale-95"
                >
                  <font-awesome-icon icon="edit" />
                  <span>Edit Akses</span>
                </button>
              </td>
            </tr>
            <tr v-if="userList.length === 0">
              <td colspan="6" class="p-12 text-center text-slate-400 font-bold uppercase tracking-wider text-xs">
                Tidak ada data login ditemukan
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Edit Pop-up Modal -->
    <transition name="modal-fade">
      <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" @click="closeModal"></div>

        <!-- Modal Content -->
        <div class="bg-white rounded-xl shadow-2xl border border-slate-100 w-full max-w-md overflow-hidden transform transition-all duration-300 relative z-10">
          <div class="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div>
              <h3 class="text-xs font-black uppercase tracking-widest text-slate-800">Edit Akses Login</h3>
              <p class="text-[9px] font-semibold text-slate-400 mt-0.5">Ubah kredensial & level akses untuk pengguna ini</p>
            </div>
            <button 
              @click="closeModal" 
              class="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer text-xs"
            >
              ✕
            </button>
          </div>

          <div class="p-6 space-y-4">
            <!-- Nama -->
            <div class="space-y-1.5">
              <label class="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Nama Lengkap</label>
              <input 
                v-model="editForm.name" 
                type="text" 
                class="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              >
            </div>

            <!-- Email -->
            <div class="space-y-1.5">
              <label class="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Email / Username</label>
              <input 
                v-model="editForm.email" 
                type="email" 
                class="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              >
            </div>

            <!-- Role / Hak Akses -->
            <div class="space-y-1.5">
              <label class="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Level Hak Akses</label>
              <Select 
                v-model="editForm.role" 
                :options="roleOptions" 
                optionLabel="label" 
                optionValue="value" 
                class="w-full text-xs rounded-lg" 
              />
            </div>

            <!-- Password -->
            <div class="space-y-1.5">
              <label class="text-[9px] font-black text-slate-500 uppercase tracking-widest block">Kata Sandi Baru</label>
              <input 
                v-model="editForm.password" 
                type="password" 
                placeholder="Kosongkan jika tidak ingin mengubah kata sandi" 
                class="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              >
            </div>
          </div>

          <div class="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-2.5">
            <button 
              @click="closeModal" 
              class="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button 
              @click="saveLoginAccess" 
              :disabled="isLoading"
              class="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-60"
            >
              <span v-if="isLoading" class="w-3 h-3 rounded-full border border-white border-t-transparent animate-spin"></span>
              <span>{{ isLoading ? 'Menyimpan...' : 'Simpan Akses' }}</span>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .bg-white {
  animation: modal-zoom-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.modal-fade-leave-active .bg-white {
  animation: modal-zoom-out 0.2s ease-in;
}

@keyframes modal-zoom-in {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes modal-zoom-out {
  from {
    transform: scale(1);
    opacity: 1;
  }
  to {
    transform: scale(0.95);
    opacity: 0;
  }
}
</style>
