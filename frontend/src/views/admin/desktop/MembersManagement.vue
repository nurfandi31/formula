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
        Swal.fire({ icon: 'success', title: 'Diperbarui', text: 'Data pengurus berhasil diperbarui!', timer: 1500, showConfirmButton: false })
      } else {
        Swal.fire({ icon: 'error', title: 'Gagal', text: 'Gagal memperbarui data pengurus!', confirmButtonColor: '#10b981' })
        return
      }
    }
  } else {
    if (socialStore.users[lowerEmail]) {
      Swal.fire({ icon: 'error', title: 'Gagal', text: 'Email sudah terdaftar!', confirmButtonColor: '#10b981' })
      return
    }

    const res = await socialStore.addMember(name.value.trim(), lowerEmail, title.value.trim())
    if (res.success) {
      Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Pengurus baru berhasil ditambahkan!', timer: 1500, showConfirmButton: false })
    } else {
      Swal.fire({ icon: 'error', title: 'Gagal', text: 'Gagal menyimpan pengurus baru!', confirmButtonColor: '#10b981' })
      return
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
}

const handleDelete = (userEmail) => {
  if (userEmail === 'admin@formula.org' || userEmail === socialStore.currentUser?.email) {
    Swal.fire({ icon: 'error', title: 'Gagal', text: 'Anda tidak dapat menghapus administrator aktif!', confirmButtonColor: '#10b981' })
    return
  }

  const user = socialStore.users[userEmail]
  if (!user || !user.id) {
    delete socialStore.users[userEmail]
    Swal.fire({ icon: 'success', title: 'Terhapus', text: 'Pengurus telah dihapus.', timer: 1500, showConfirmButton: false })
    return
  }

  Swal.fire({
    title: 'Hapus Pengurus?',
    text: 'Data profil dan seluruh history sosialnya akan terhapus!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#f43f5e',
    cancelButtonColor: '#475569',
    confirmButtonText: 'Ya, Hapus!'
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
}
</script>

<template>
  <div class="grid grid-cols-3 gap-8">
    <div class="bg-white border border-slate-200/70 rounded-2xl p-6 shadow-xs h-fit">
      <h3 class="text-xs font-black uppercase tracking-widest text-slate-800 mb-6">
        {{ isEditing ? 'Edit Data Pengurus' : 'Tambah Pengurus Baru' }}
      </h3>
      <div class="space-y-4">
        <div>
          <label class="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Nama Lengkap</label>
          <input v-model="name" type="text" placeholder="Nama Lengkap" class="w-full px-4 py-3 bg-white border border-slate-200 rounded-md text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500">
        </div>
        <div>
          <label class="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Alamat Email</label>
          <input v-model="email" type="email" placeholder="Alamat Email" class="w-full px-4 py-3 bg-white border border-slate-200 rounded-md text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500">
        </div>
        <div>
          <label class="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Jabatan / Divisi</label>
          <input v-model="title" type="text" placeholder="Contoh: Divisi Humas" class="w-full px-4 py-3 bg-white border border-slate-200 rounded-md text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500">
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Umur</label>
            <input v-model="age" type="text" placeholder="22 Tahun" class="w-full px-4 py-3 bg-white border border-slate-200 rounded-md text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500">
          </div>
          <div>
            <label class="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Hobi</label>
            <input v-model="hobby" type="text" placeholder="Hobi" class="w-full px-4 py-3 bg-white border border-slate-200 rounded-md text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500">
          </div>
        </div>
        <div>
          <label class="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Quote Pengurus</label>
          <textarea v-model="quote" placeholder="Quote" rows="3" class="w-full px-4 py-3 bg-white border border-slate-200 rounded-md text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"></textarea>
        </div>
        <div class="flex gap-3">
          <button @click="handleSave" class="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-black text-xs uppercase tracking-widest transition-all cursor-pointer">
            {{ isEditing ? 'Simpan Perubahan' : 'Daftarkan Pengurus' }}
          </button>
          <button v-if="isEditing" @click="cancelEdit" class="px-4 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-655 border border-slate-200 rounded-md font-black text-xs uppercase tracking-widest transition-all cursor-pointer">
            Batal
          </button>
        </div>
      </div>
    </div>

    <div class="bg-white border border-slate-200/70 rounded-2xl p-6 col-span-2 shadow-xs">
      <div class="flex justify-between items-center mb-6 pb-4 border-b border-slate-150">
        <h3 class="text-xs font-black uppercase tracking-widest text-slate-800">Database Pengurus Aktif</h3>
        <input v-model="searchUser" type="text" placeholder="Cari pengurus..." class="px-4 py-2 bg-white border border-slate-200 rounded-md text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500">
      </div>

      <div class="space-y-3 max-h-[500px] overflow-y-auto pr-1">
        <div v-for="user in filteredMembers" :key="user.email" class="p-4 bg-slate-50/50 border border-slate-200/60 rounded-xl flex justify-between items-center gap-4 hover:border-slate-300 transition-colors">
          <div class="flex items-center gap-4 w-full">
            <img :src="user.avatar" class="w-10 h-10 rounded-xl object-cover border border-slate-200 flex-shrink-0">
            <div class="truncate">
              <h4 class="text-xs font-black text-slate-800 leading-tight uppercase truncate">{{ user.name }}</h4>
              <p class="text-[9px] font-black text-emerald-600 mt-1 uppercase tracking-wider">{{ user.title }}</p>
              <p class="text-[9px] text-slate-500 mt-0.5 truncate">{{ user.email }}</p>
            </div>
          </div>
          <div class="flex gap-2">
            <button @click="handleEdit(user)" class="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl hover:bg-emerald-600 hover:text-white transition-all cursor-pointer flex items-center justify-center">
              <font-awesome-icon icon="edit" />
            </button>
            <button @click="handleDelete(user.email)" class="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl hover:bg-rose-600 hover:text-white transition-all cursor-pointer flex items-center justify-center">
              <font-awesome-icon icon="trash" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
