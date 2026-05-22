<script setup>
import { ref, computed } from 'vue'
import { useSocialStore } from '../../../stores/social'
import Swal from 'sweetalert2'

const socialStore = useSocialStore()

const searchUser = ref('')
const name = ref('')
const email = ref('')
const title = ref('Anggota FORMULA')
const age = ref('22 Tahun')
const hobby = ref('Organisasi')
const quote = ref('Bersama FORMULA, berkontribusi aktif.')
const isEditing = ref(false)
const editingEmail = ref('')
const isFormModalOpen = ref(false)

const filteredMembers = computed(() => {
  const list = Object.values(socialStore.users)
  if (!searchUser.value.trim()) return list
  return list.filter(u => u.name.toLowerCase().includes(searchUser.value.toLowerCase()) || u.email.toLowerCase().includes(searchUser.value.toLowerCase()))
})

const handleSave = async () => {
  if (!name.value.trim() || !email.value.trim()) {
    Swal.fire({ icon: 'warning', title: 'Data Belum Lengkap', text: 'Nama dan email wajib diisi!', confirmButtonColor: '#10b981' })
    return
  }

  const lowerEmail = email.value.toLowerCase().trim()

  if (isEditing.value) {
    const user = socialStore.users[editingEmail.value]
    if (user) {
      const res = await socialStore.updateMember(user.id, name.value.trim(), lowerEmail, title.value.trim())
      if (res.success) {
        isEditing.value = false
        editingEmail.value = ''
        isFormModalOpen.value = false
        Swal.fire({ icon: 'success', title: 'Diperbarui', text: 'Data pengurus berhasil diperbarui!', timer: 1500, showConfirmButton: false })
      }
    }
  } else {
    if (socialStore.users[lowerEmail]) {
      Swal.fire({ icon: 'error', title: 'Gagal', text: 'Email sudah terdaftar!', confirmButtonColor: '#10b981' })
      return
    }

    const res = await socialStore.addMember(name.value.trim(), lowerEmail, title.value.trim())
    if (res.success) {
      isFormModalOpen.value = false
      Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Pengurus baru berhasil ditambahkan!', timer: 1500, showConfirmButton: false })
    }
  }

  name.value = ''
  email.value = ''
  title.value = 'Anggota FORMULA'
  age.value = '22 Tahun'
  hobby.value = 'Organisasi'
  quote.value = 'Bersama FORMULA, berkontribusi aktif.'
}

const handleEdit = (user) => {
  name.value = user.name
  email.value = user.email
  title.value = user.title
  age.value = user.age
  hobby.value = user.hobby
  quote.value = user.quote
  isEditing.value = true
  editingEmail.value = user.email
  isFormModalOpen.value = true
}

const handleDelete = (userEmail) => {
  if (userEmail === 'admin@formula.org' || userEmail === socialStore.currentUser?.email) {
    Swal.fire({ icon: 'error', title: 'Gagal', text: 'Anda tidak dapat menghapus administrator aktif!', confirmButtonColor: '#10b981' })
    return
  }

  const user = socialStore.users[userEmail]
  Swal.fire({
    title: 'Hapus Pengurus?',
    text: 'Data profil akan terhapus!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#f43f5e',
    cancelButtonColor: '#475569',
    confirmButtonText: 'Hapus'
  }).then(async (result) => {
    if (result.isConfirmed) {
      const res = await socialStore.deleteMember(user.id)
      if (res.success) {
        Swal.fire({ icon: 'success', title: 'Terhapus', text: 'Pengurus telah dihapus.', timer: 1500, showConfirmButton: false })
      }
    }
  })
}

const cancelEdit = () => {
  name.value = ''
  email.value = ''
  title.value = 'Anggota FORMULA'
  age.value = '22 Tahun'
  hobby.value = 'Organisasi'
  quote.value = 'Bersama FORMULA, berkontribusi aktif.'
  isEditing.value = false
  editingEmail.value = ''
  isFormModalOpen.value = false
}

const openCreateModal = () => {
  isEditing.value = false
  name.value = ''
  email.value = ''
  title.value = 'Anggota FORMULA'
  isFormModalOpen.value = true
}
</script>

<template>
  <div class="space-y-6">
    <button @click="openCreateModal" class="w-full py-4 bg-emerald-600 active:bg-emerald-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-md flex items-center justify-center gap-2">
      <font-awesome-icon icon="plus" /> Daftarkan Pengurus Baru
    </button>

    <div class="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-4 shadow-xs">
      <div class="flex justify-between items-center pb-2 border-b border-slate-100">
        <h3 class="text-xs font-black uppercase tracking-wider text-slate-800">Database Pengurus ({{ filteredMembers.length }})</h3>
      </div>

      <input 
        v-model="searchUser" 
        type="text" 
        placeholder="Cari pengurus..." 
        class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
      >

      <div class="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
        <div 
          v-for="user in filteredMembers" 
          :key="user.email" 
          class="p-4 bg-slate-50 border border-slate-150 rounded-xl flex items-center justify-between gap-3"
        >
          <div class="flex items-center gap-3 min-w-0">
            <img :src="user.avatar" class="w-9 h-9 rounded-xl object-cover border border-slate-200 flex-shrink-0">
            <div class="min-w-0">
              <h4 class="text-xs font-black text-slate-800 leading-snug uppercase truncate">{{ user.name }}</h4>
              <p class="text-[8px] font-black text-emerald-600 uppercase mt-0.5">{{ user.title }}</p>
              <p class="text-[8px] text-slate-400 truncate mt-0.5">{{ user.email }}</p>
            </div>
          </div>
          <div class="flex gap-2 flex-shrink-0">
            <button @click="handleEdit(user)" class="w-7 h-7 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
              <font-awesome-icon icon="edit" class="text-[10px]" />
            </button>
            <button @click="handleDelete(user.email)" class="w-7 h-7 bg-rose-50 text-rose-600 rounded-lg flex items-center justify-center">
              <font-awesome-icon icon="trash" class="text-[10px]" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isFormModalOpen" class="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-end justify-center">
      <div class="fixed inset-0" @click="cancelEdit"></div>
      
      <div class="bg-white w-full rounded-t-3xl p-6 space-y-4 relative z-10 shadow-2xl border-t border-slate-100 animate-in slide-in-from-bottom duration-300">
        <div class="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-2"></div>
        
        <div class="flex justify-between items-center pb-2 border-b border-slate-100">
          <h3 class="text-xs font-black uppercase tracking-widest text-slate-800">{{ isEditing ? 'Edit Pengurus' : 'Daftar Pengurus Baru' }}</h3>
          <button @click="cancelEdit" class="text-slate-400 hover:text-slate-600 font-bold text-sm">✕</button>
        </div>

        <div class="space-y-4 py-2 max-h-[70vh] overflow-y-auto pr-1">
          <div>
            <label class="block text-[8px] font-black uppercase tracking-wider text-slate-500 mb-1">Nama Lengkap</label>
            <input v-model="name" type="text" placeholder="Nama Lengkap" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800">
          </div>

          <div>
            <label class="block text-[8px] font-black uppercase tracking-wider text-slate-500 mb-1">Alamat Email</label>
            <input v-model="email" type="email" placeholder="Email" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800">
          </div>

          <div>
            <label class="block text-[8px] font-black uppercase tracking-wider text-slate-500 mb-1">Jabatan / Divisi</label>
            <input v-model="title" type="text" placeholder="Contoh: Divisi Humas" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800">
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-[8px] font-black uppercase tracking-wider text-slate-500 mb-1">Umur</label>
              <input v-model="age" type="text" placeholder="22 Tahun" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800">
            </div>
            <div>
              <label class="block text-[8px] font-black uppercase tracking-wider text-slate-500 mb-1">Hobi</label>
              <input v-model="hobby" type="text" placeholder="Hobi" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800">
            </div>
          </div>

          <div>
            <label class="block text-[8px] font-black uppercase tracking-wider text-slate-500 mb-1">Quote</label>
            <textarea v-model="quote" rows="2" placeholder="Quote..." class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 resize-none font-sans"></textarea>
          </div>

          <div class="flex gap-2 pt-2">
            <button @click="handleSave" class="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer">
              {{ isEditing ? 'Simpan Perubahan' : 'Simpan Pengurus' }}
            </button>
            <button @click="cancelEdit" class="px-5 py-3.5 bg-slate-100 hover:bg-slate-250 text-slate-600 rounded-xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer border border-slate-200">
              Batal
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
