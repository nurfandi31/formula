<script setup>
import { ref, computed } from 'vue'
import { useSocialStore } from '../../../stores/social'
import { useToast } from '../../../composables/useToast'

const socialStore = useSocialStore()
const { showToast } = useToast()

const name = ref('')
const email = ref('')
const role = ref('anggota')
const age = ref('')
const hobby = ref('')
const quote = ref('')
const isEditing = ref(false)
const editingEmail = ref('')

// Avatar image upload
const avatarPreview = ref('')
const avatarFile = ref(null)
const fileInputRef = ref(null)

const roleOptions = [
  { label: 'Admin', value: 'admin', badge: 'bg-rose-50 border-rose-200 text-rose-700', title: 'Administrator' },
  { label: 'Bendahara', value: 'bendahara', badge: 'bg-amber-50 border-amber-200 text-amber-700', title: 'Bendahara FORMULA' },
  { label: 'Sekretaris', value: 'sekertaris', badge: 'bg-indigo-50 border-indigo-200 text-indigo-700', title: 'Sekretaris FORMULA' },
  { label: 'Anggota', value: 'anggota', badge: 'bg-emerald-50 border-emerald-200 text-emerald-700', title: 'Anggota FORMULA' }
]

const selectedRole = computed(() => roleOptions.find(r => r.value === role.value) || roleOptions[3])

const computedTitle = computed(() => selectedRole.value.title)

const onFileChange = (e) => {
  const file = e.target.files[0]
  if (!file) return
  if (!file.type.startsWith('image/')) {
    showToast('File harus berupa gambar!', 'warning')
    return
  }
  avatarFile.value = file
  avatarPreview.value = URL.createObjectURL(file)
}

const triggerFileInput = () => {
  fileInputRef.value?.click()
}

const removeAvatar = () => {
  avatarPreview.value = ''
  avatarFile.value = null
  if (fileInputRef.value) fileInputRef.value.value = ''
}

const handleSave = async () => {
  if (!name.value.trim() || !email.value.trim()) {
    showToast('Nama dan email wajib diisi!', 'warning')
    return
  }

  const lowerEmail = email.value.toLowerCase().trim()

  if (isEditing.value) {
    const user = socialStore.users[editingEmail.value]
    if (user) {
      const res = await socialStore.updateMember(user.id, name.value.trim(), lowerEmail, computedTitle.value)
      if (res.success) {
        isEditing.value = false
        editingEmail.value = ''
        showToast('Data anggota berhasil diperbarui! ✏️', 'success')
      } else {
        showToast('Gagal memperbarui data anggota!', 'error')
        return
      }
    }
  } else {
    if (socialStore.users[lowerEmail]) {
      showToast('Email sudah terdaftar di database!', 'error')
      return
    }
    const res = await socialStore.addMember(name.value.trim(), lowerEmail, computedTitle.value)
    if (res.success) {
      showToast('Anggota baru berhasil didaftarkan! 🎉', 'success')
    } else {
      showToast('Gagal menyimpan anggota ke database!', 'error')
      return
    }
  }

  resetForm()
}

const resetForm = () => {
  name.value = ''
  email.value = ''
  role.value = 'anggota'
  age.value = ''
  hobby.value = ''
  quote.value = ''
  removeAvatar()
  isEditing.value = false
  editingEmail.value = ''
}
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div>
      <h1 class="text-xl font-black text-slate-900 tracking-tight">
        {{ isEditing ? 'Edit Data Anggota' : 'Registrasi Anggota Baru' }}
      </h1>
      <p class="text-xs text-slate-400 font-semibold mt-0.5">
        Daftarkan anggota baru ke dalam sistem FORMULA
      </p>
    </div>

    <!-- 2-Column Layout -->
    <div class="grid grid-cols-5 gap-6">

      <!-- LEFT: Form -->
      <div class="col-span-3 bg-white border border-slate-200/70 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 class="text-[10px] font-black uppercase tracking-widest text-slate-500 pb-3 border-b border-slate-100">
          Informasi Anggota
        </h3>

        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <!-- Nama -->
            <div class="col-span-2">
              <label class="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
                Nama Lengkap <span class="text-rose-500">*</span>
              </label>
              <input
                v-model="name"
                type="text"
                placeholder="Nama lengkap anggota"
                class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              >
            </div>

            <!-- Email -->
            <div class="col-span-2">
              <label class="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
                Alamat Email <span class="text-rose-500">*</span>
              </label>
              <input
                v-model="email"
                type="email"
                :disabled="isEditing"
                placeholder="email@example.com"
                class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all disabled:opacity-60"
              >
            </div>

            <!-- Jabatan Select -->
            <div class="col-span-2">
              <label class="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Jabatan / Level Akses</label>
              <div class="grid grid-cols-2 gap-2">
                <button
                  v-for="opt in roleOptions"
                  :key="opt.value"
                  type="button"
                  @click="role = opt.value"
                  :class="[
                    'py-2.5 px-3 rounded-lg border text-[10px] font-black uppercase tracking-wide transition-all cursor-pointer text-left flex items-center gap-2',
                    role === opt.value
                      ? opt.badge + ' ring-2 ring-offset-1 ' + (opt.value === 'admin' ? 'ring-rose-400' : opt.value === 'bendahara' ? 'ring-amber-400' : opt.value === 'sekertaris' ? 'ring-indigo-400' : 'ring-emerald-400')
                      : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                  ]"
                >
                  <span :class="['w-2 h-2 rounded-full flex-shrink-0', role === opt.value ? (opt.value === 'admin' ? 'bg-rose-500' : opt.value === 'bendahara' ? 'bg-amber-500' : opt.value === 'sekertaris' ? 'bg-indigo-500' : 'bg-emerald-500') : 'bg-slate-300']"></span>
                  {{ opt.label }}
                </button>
              </div>
              <p class="text-[9px] text-slate-400 font-semibold mt-1.5">
                Jabatan: <span class="text-slate-600 font-black">{{ computedTitle }}</span>
              </p>
            </div>

            <!-- Umur + Hobi -->
            <div>
              <label class="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Umur</label>
              <input
                v-model="age"
                type="text"
                placeholder="22 Tahun"
                class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              >
            </div>
            <div>
              <label class="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Hobi</label>
              <input
                v-model="hobby"
                type="text"
                placeholder="Misal: Membaca"
                class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              >
            </div>

            <!-- Quote -->
            <div class="col-span-2">
              <label class="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">Quote / Motto</label>
              <textarea
                v-model="quote"
                placeholder="Quote atau motto anggota..."
                rows="3"
                class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all resize-none"
              ></textarea>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-3 pt-1">
            <button
              @click="handleSave"
              class="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-black text-xs uppercase tracking-widest transition-all cursor-pointer active:scale-95 shadow-sm shadow-emerald-200"
            >
              {{ isEditing ? '✏️ Simpan Perubahan' : '➕ Daftarkan Anggota' }}
            </button>
            <button
              v-if="isEditing"
              @click="resetForm"
              class="px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 rounded-lg font-black text-xs uppercase tracking-widest transition-all cursor-pointer"
            >
              Batal
            </button>
          </div>
        </div>
      </div>

      <!-- RIGHT: Photo Upload & Preview -->
      <div class="col-span-2 space-y-4">
        <div class="bg-white border border-slate-200/70 rounded-2xl p-6 shadow-xs">
          <h3 class="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4 pb-3 border-b border-slate-100">
            Foto Profil Anggota
          </h3>

          <!-- Preview area -->
          <div
            @click="triggerFileInput"
            class="relative w-full aspect-square rounded-xl overflow-hidden border-2 border-dashed border-slate-200 hover:border-emerald-400 transition-colors cursor-pointer bg-slate-50 flex items-center justify-center group mb-4"
          >
            <img
              v-if="avatarPreview"
              :src="avatarPreview"
              class="absolute inset-0 w-full h-full object-cover rounded-xl"
            />
            <div v-else class="text-center space-y-2 px-4">
              <div class="w-14 h-14 bg-slate-100 group-hover:bg-emerald-50 rounded-full flex items-center justify-center mx-auto transition-colors">
                <font-awesome-icon icon="user" class="text-slate-300 group-hover:text-emerald-400 text-2xl transition-colors" />
              </div>
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-wider">Klik untuk pilih foto</p>
              <p class="text-[9px] text-slate-300 font-medium">JPG, PNG, atau WEBP</p>
            </div>

            <!-- Hover overlay if image is loaded -->
            <div v-if="avatarPreview" class="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition-all rounded-xl flex items-center justify-center">
              <div class="opacity-0 group-hover:opacity-100 transition-opacity text-center">
                <font-awesome-icon icon="edit" class="text-white text-xl" />
                <p class="text-white text-[10px] font-black uppercase tracking-wider mt-1">Ganti Foto</p>
              </div>
            </div>
          </div>

          <!-- Hidden file input -->
          <input
            ref="fileInputRef"
            type="file"
            accept="image/*"
            class="hidden"
            @change="onFileChange"
          >

          <!-- Buttons -->
          <div class="space-y-2">
            <button
              @click="triggerFileInput"
              type="button"
              class="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-black text-[10px] uppercase tracking-widest cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <font-awesome-icon icon="search" class="text-xs" />
              Pilih Gambar
            </button>
            <button
              v-if="avatarPreview"
              @click="removeAvatar"
              type="button"
              class="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-lg font-black text-[10px] uppercase tracking-widest cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <font-awesome-icon icon="trash" class="text-xs" />
              Hapus Foto
            </button>
          </div>
        </div>

        <!-- Preview Card -->
        <div v-if="name || avatarPreview" class="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-5 shadow-sm text-white">
          <p class="text-[9px] font-black uppercase tracking-widest text-emerald-100 mb-3">Preview Kartu Anggota</p>
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-full overflow-hidden border-2 border-white/30 flex-shrink-0 bg-white/10 flex items-center justify-center">
              <img v-if="avatarPreview" :src="avatarPreview" class="w-full h-full object-cover" />
              <font-awesome-icon v-else icon="user" class="text-white/50 text-lg" />
            </div>
            <div class="min-w-0">
              <p class="text-sm font-black leading-tight truncate">{{ name || 'Nama Anggota' }}</p>
              <p class="text-[10px] text-emerald-100 font-semibold mt-0.5 truncate">{{ computedTitle }}</p>
              <p class="text-[9px] text-emerald-200/70 font-medium mt-0.5 truncate">{{ email || 'email@example.com' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
