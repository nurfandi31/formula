<script setup>
import { ref, computed, watch } from 'vue'
import { useSocialStore } from '../../../stores/social'
import { useToast } from '../../../composables/useToast'

const socialStore = useSocialStore()
const { showToast } = useToast()

const currentUser = computed(() => socialStore.currentUser)

// ── Tab aktif ─────────────────────────────────────────────────────────────
const activeTab = ref('profil') // 'profil' | 'akun'

// ── Form data pribadi ──────────────────────────────────────────────────────
const form = ref({ name: '', title: '', avatar: '' })
const isLoadingProfile = ref(false)

// ── Form akun (email + password) ──────────────────────────────────────────
const formAkun = ref({ email: '', currentPassword: '', newPassword: '', confirmPassword: '' })
const showCurrentPwd = ref(false)
const showNewPwd = ref(false)
const showConfirmPwd = ref(false)
const isLoadingAkun = ref(false)
const passwordStrength = ref(0)

// Inisialisasi form saat currentUser tersedia
watch(currentUser, (u) => {
  if (u) {
    form.value.name = u.name || ''
    form.value.title = u.title || ''
    form.value.avatar = u.avatar || ''
    formAkun.value.email = u.email || ''
  }
}, { immediate: true })

// Cek kekuatan password
watch(() => formAkun.value.newPassword, (val) => {
  let score = 0
  if (val.length >= 8) score++
  if (/[A-Z]/.test(val)) score++
  if (/[0-9]/.test(val)) score++
  if (/[^A-Za-z0-9]/.test(val)) score++
  passwordStrength.value = score
})

const strengthLabel = computed(() => {
  const labels = ['', 'Lemah', 'Cukup', 'Kuat', 'Sangat Kuat']
  return labels[passwordStrength.value] || ''
})
const strengthColor = computed(() => {
  const colors = ['', 'bg-rose-500', 'bg-amber-500', 'bg-blue-500', 'bg-emerald-500']
  return colors[passwordStrength.value] || ''
})

// Avatar preset
const avatarPresets = [
  'https://api.dicebear.com/7.x/bottts/svg?seed=admin',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Fandi',
  'https://api.dicebear.com/7.x/adventurer/svg?seed=admin',
  'https://api.dicebear.com/7.x/micah/svg?seed=formula',
  'https://api.dicebear.com/7.x/personas/svg?seed=formula',
  'https://api.dicebear.com/7.x/notionists/svg?seed=admin',
]

const API_BASE = 'http://localhost:8000/api'

// ── Simpan data pribadi ────────────────────────────────────────────────────
const saveProfile = async () => {
  if (!form.value.name.trim()) {
    showToast('Nama tidak boleh kosong!', 'error'); return
  }
  isLoadingProfile.value = true
  try {
    const res = await fetch(`${API_BASE}/members/${currentUser.value.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.value.name,
        email: currentUser.value.email,
        role: currentUser.value.role,
        title: form.value.title,
        avatar: form.value.avatar,
      })
    })
    if (res.ok) {
      await socialStore.fetchMembers()
      // Update currentUser di store langsung
      socialStore.updateProfile({
        name: form.value.name,
        title: form.value.title,
        avatar: form.value.avatar,
      })
      showToast('Data profil berhasil diperbarui! 🎉', 'success')
    } else {
      showToast('Gagal menyimpan. Coba lagi.', 'error')
    }
  } catch {
    showToast('Tidak bisa terhubung ke server.', 'error')
  } finally {
    isLoadingProfile.value = false
  }
}

// ── Simpan email + password ────────────────────────────────────────────────
const saveAkun = async () => {
  if (!formAkun.value.email.trim()) {
    showToast('Email tidak boleh kosong!', 'error'); return
  }
  if (formAkun.value.newPassword && formAkun.value.newPassword !== formAkun.value.confirmPassword) {
    showToast('Konfirmasi password tidak cocok!', 'error'); return
  }
  if (formAkun.value.newPassword && formAkun.value.newPassword.length < 6) {
    showToast('Password minimal 6 karakter!', 'error'); return
  }

  isLoadingAkun.value = true
  try {
    const payload = {
      name: currentUser.value.name,
      email: formAkun.value.email,
      role: currentUser.value.role,
      title: currentUser.value.title,
    }
    if (formAkun.value.newPassword) {
      payload.password = formAkun.value.newPassword
    }

    const res = await fetch(`${API_BASE}/members/${currentUser.value.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    if (res.ok) {
      // Reset password fields
      formAkun.value.currentPassword = ''
      formAkun.value.newPassword = ''
      formAkun.value.confirmPassword = ''
      passwordStrength.value = 0
      await socialStore.fetchMembers()
      showToast('Akun berhasil diperbarui! 🔐', 'success')
    } else {
      const err = await res.json().catch(() => ({}))
      showToast(err.message || 'Gagal memperbarui akun.', 'error')
    }
  } catch {
    showToast('Tidak bisa terhubung ke server.', 'error')
  } finally {
    isLoadingAkun.value = false
  }
}
</script>

<template>
  <div class="space-y-6 max-w-4xl">

    <!-- ── Header ─────────────────────────────────────────────────────── -->
    <div class="flex items-start justify-between">
      <div>
        <h1 class="text-xl font-black text-slate-900 tracking-tight">Profil Saya</h1>
        <p class="text-xs text-slate-400 font-semibold mt-0.5">Kelola informasi akun dan keamanan Anda</p>
      </div>
      <div class="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-lg">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
        <span class="text-[10px] font-black text-emerald-700 uppercase tracking-widest">{{ currentUser?.role }}</span>
      </div>
    </div>

    <!-- ── Avatar Hero Card ────────────────────────────────────────────── -->
    <div class="bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 rounded-xl p-6 shadow-xl shadow-emerald-200 relative overflow-hidden">
      <!-- background decoration -->
      <div class="absolute -top-8 -right-8 w-40 h-40 bg-white/10 rounded-full"></div>
      <div class="absolute -bottom-10 -left-4 w-32 h-32 bg-white/5 rounded-full"></div>

      <div class="relative flex items-center gap-5">
        <div class="relative">
          <div class="w-20 h-20 rounded-xl overflow-hidden border-4 border-white/30 shadow-xl bg-white/20 flex-shrink-0">
            <img :src="currentUser?.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=admin'"
                 class="w-full h-full object-cover" alt="Avatar">
          </div>
          <div class="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md">
            <span class="text-[8px]">✓</span>
          </div>
        </div>
        <div>
          <h2 class="text-xl font-black text-white leading-tight">{{ currentUser?.name }}</h2>
          <p class="text-emerald-100 text-xs font-bold mt-0.5">{{ currentUser?.title }}</p>
          <p class="text-emerald-200 text-[10px] font-semibold mt-1">{{ currentUser?.email }}</p>
        </div>
      </div>
    </div>

    <!-- ── Tab Navigation ─────────────────────────────────────────────── -->
    <div class="flex gap-1 p-1 bg-slate-100 rounded-lg w-fit">
      <button
        @click="activeTab = 'profil'"
        :class="['px-5 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer',
          activeTab === 'profil'
            ? 'bg-white text-slate-900 shadow-sm'
            : 'text-slate-500 hover:text-slate-700']"
      >
        📋 Data Pribadi
      </button>
      <button
        @click="activeTab = 'akun'"
        :class="['px-5 py-2 rounded-md text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer',
          activeTab === 'akun'
            ? 'bg-white text-slate-900 shadow-sm'
            : 'text-slate-500 hover:text-slate-700']"
      >
        🔐 Keamanan Akun
      </button>
    </div>

    <!-- ── TAB: Data Pribadi ──────────────────────────────────────────── -->
    <transition name="tab-fade" mode="out-in">
    <div v-if="activeTab === 'profil'" key="profil" class="grid grid-cols-1 lg:grid-cols-3 gap-5">

      <!-- Avatar Picker -->
      <div class="bg-white rounded-xl p-5 space-y-4">
        <div>
          <h3 class="text-xs font-black text-slate-800 uppercase tracking-widest">Foto Profil</h3>
          <p class="text-[10px] text-slate-400 font-semibold mt-0.5">Pilih avatar atau tempel URL gambar</p>
        </div>

        <!-- Preview -->
        <div class="flex justify-center">
          <div class="w-24 h-24 rounded-xl overflow-hidden border-2 border-slate-200 bg-slate-100 shadow-md">
            <img :src="form.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=admin'"
                 class="w-full h-full object-cover" alt="Preview">
          </div>
        </div>

        <!-- Preset grid -->
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="(av, i) in avatarPresets" :key="i"
            @click="form.avatar = av"
            :class="['w-full aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-pointer hover:scale-105',
              form.avatar === av ? 'border-emerald-500 shadow-md shadow-emerald-200' : 'border-transparent bg-slate-100']"
          >
            <img :src="av" class="w-full h-full object-cover" alt="">
          </button>
        </div>

        <!-- URL Input -->
        <div class="space-y-1">
          <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest">URL Gambar Custom</label>
          <input
            v-model="form.avatar"
            type="text"
            placeholder="https://..."
            class="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
          >
        </div>
      </div>

      <!-- Info Form -->
      <div class="lg:col-span-2 bg-white rounded-xl p-5 space-y-5">
        <div>
          <h3 class="text-xs font-black text-slate-800 uppercase tracking-widest">Informasi Pribadi</h3>
          <p class="text-[10px] text-slate-400 font-semibold mt-0.5">Nama dan jabatan yang tampil di dashboard</p>
        </div>

        <div class="space-y-4">
          <!-- Nama -->
          <div class="space-y-1.5">
            <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nama Lengkap</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-3.5 flex items-center text-slate-400 text-sm">👤</span>
              <input
                v-model="form.name"
                type="text"
                placeholder="Nama lengkap Anda..."
                class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              >
            </div>
          </div>

          <!-- Jabatan -->
          <div class="space-y-1.5">
            <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Jabatan / Posisi</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-3.5 flex items-center text-slate-400 text-sm">🏷️</span>
              <input
                v-model="form.title"
                type="text"
                placeholder="Contoh: Ketua Umum, Sekretaris..."
                class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              >
            </div>
          </div>

          <!-- Role (readonly) -->
          <div class="space-y-1.5">
            <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Role Sistem</label>
            <div class="px-4 py-3 bg-slate-100 border border-slate-200 rounded-lg flex items-center gap-2">
              <span class="text-sm">🔒</span>
              <span class="text-sm font-black text-slate-500 capitalize">{{ currentUser?.role }}</span>
              <span class="ml-auto text-[9px] font-black text-slate-400 uppercase tracking-widest">Tidak bisa diubah</span>
            </div>
          </div>
        </div>

        <!-- Info card -->
        <div class="p-3.5 bg-emerald-50 border border-emerald-100 rounded-lg flex gap-2.5">
          <span class="text-emerald-500 text-base flex-shrink-0 mt-0.5">ℹ️</span>
          <p class="text-[10px] font-semibold text-emerald-700 leading-relaxed">
            Nama dan jabatan yang Anda simpan akan langsung tampil di navbar admin, halaman anggota, dan laporan absensi.
          </p>
        </div>

        <!-- Tombol simpan -->
        <div class="flex justify-end pt-2">
          <button
            @click="saveProfile"
            :disabled="isLoadingProfile"
            class="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white rounded-lg font-black text-xs uppercase tracking-widest transition-all cursor-pointer shadow-lg shadow-emerald-600/20 active:scale-95"
          >
            <span v-if="isLoadingProfile" class="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
            <span>{{ isLoadingProfile ? 'Menyimpan...' : '💾 Simpan Data Pribadi' }}</span>
          </button>
        </div>
      </div>
    </div>
    </transition>

    <!-- ── TAB: Keamanan Akun ─────────────────────────────────────────── -->
    <transition name="tab-fade" mode="out-in">
    <div v-if="activeTab === 'akun'" key="akun" class="grid grid-cols-1 lg:grid-cols-3 gap-5">

      <!-- Info keamanan sidebar -->
      <div class="space-y-4">
        <div class="bg-white rounded-xl p-5 space-y-3">
          <h3 class="text-xs font-black text-slate-800 uppercase tracking-widest">🛡️ Keamanan</h3>
          <div class="space-y-2.5">
            <div class="flex items-center gap-2.5 p-2.5 bg-emerald-50 rounded-lg">
              <span class="w-5 h-5 bg-emerald-500 rounded-md flex items-center justify-center text-white text-[9px] font-black flex-shrink-0">✓</span>
              <div>
                <p class="text-[10px] font-black text-emerald-800">Email Terverifikasi</p>
                <p class="text-[9px] text-emerald-600">Akun aktif & terhubung</p>
              </div>
            </div>
            <div class="flex items-center gap-2.5 p-2.5 bg-slate-50 rounded-lg">
              <span class="w-5 h-5 bg-slate-400 rounded-md flex items-center justify-center text-white text-[9px] font-black flex-shrink-0">🔑</span>
              <div>
                <p class="text-[10px] font-black text-slate-700">Password</p>
                <p class="text-[9px] text-slate-400">Update secara berkala</p>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-amber-50 border border-amber-100 rounded-xl p-4 space-y-1.5">
          <p class="text-[10px] font-black text-amber-700 uppercase tracking-widest">⚠️ Perhatian</p>
          <p class="text-[9px] font-semibold text-amber-600 leading-relaxed">
            Setelah mengubah email atau password, Anda perlu login ulang dengan kredensial baru.
          </p>
        </div>
      </div>

      <!-- Form akun -->
      <div class="lg:col-span-2 space-y-5">

        <!-- Email Section -->
        <div class="bg-white rounded-xl p-5 space-y-4">
          <div class="flex items-center gap-2 pb-3 border-b border-slate-100">
            <span class="text-base">📧</span>
            <div>
              <h3 class="text-xs font-black text-slate-800">Alamat Email</h3>
              <p class="text-[10px] text-slate-400 font-semibold">Digunakan untuk login ke sistem</p>
            </div>
          </div>
          <div class="space-y-1.5">
            <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Email Baru</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-3.5 flex items-center text-slate-400 text-sm">✉️</span>
              <input
                v-model="formAkun.email"
                type="email"
                placeholder="email@formula.org"
                class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
              >
            </div>
          </div>
        </div>

        <!-- Password Section -->
        <div class="bg-white rounded-xl p-5 space-y-4">
          <div class="flex items-center gap-2 pb-3 border-b border-slate-100">
            <span class="text-base">🔐</span>
            <div>
              <h3 class="text-xs font-black text-slate-800">Ubah Password</h3>
              <p class="text-[10px] text-slate-400 font-semibold">Kosongkan jika tidak ingin mengubah password</p>
            </div>
          </div>

          <div class="space-y-4">
            <!-- Password baru -->
            <div class="space-y-1.5">
              <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Password Baru</label>
              <div class="relative">
                <span class="absolute inset-y-0 left-3.5 flex items-center text-slate-400 text-sm">🔑</span>
                <input
                  v-model="formAkun.newPassword"
                  :type="showNewPwd ? 'text' : 'password'"
                  placeholder="Minimal 6 karakter..."
                  class="w-full pl-10 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                >
                <button @click="showNewPwd = !showNewPwd" type="button"
                  class="absolute inset-y-0 right-3.5 flex items-center text-[9px] font-black text-slate-400 hover:text-slate-600 cursor-pointer transition-colors">
                  {{ showNewPwd ? 'SEMBUNYI' : 'LIHAT' }}
                </button>
              </div>

              <!-- Password strength bar -->
              <div v-if="formAkun.newPassword" class="space-y-1">
                <div class="flex gap-1">
                  <div v-for="i in 4" :key="i"
                    :class="['h-1 flex-1 rounded-full transition-all duration-300',
                      i <= passwordStrength ? strengthColor : 'bg-slate-200']">
                  </div>
                </div>
                <p class="text-[9px] font-black" :class="{
                  'text-rose-500': passwordStrength === 1,
                  'text-amber-500': passwordStrength === 2,
                  'text-blue-500': passwordStrength === 3,
                  'text-emerald-600': passwordStrength === 4,
                }">{{ strengthLabel }}</p>
              </div>
            </div>

            <!-- Konfirmasi password -->
            <div class="space-y-1.5">
              <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Konfirmasi Password</label>
              <div class="relative">
                <span class="absolute inset-y-0 left-3.5 flex items-center text-slate-400 text-sm">🔒</span>
                <input
                  v-model="formAkun.confirmPassword"
                  :type="showConfirmPwd ? 'text' : 'password'"
                  placeholder="Ulangi password baru..."
                  :class="['w-full pl-10 pr-12 py-3 bg-slate-50 border rounded-lg text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:bg-white transition-all',
                    formAkun.confirmPassword && formAkun.confirmPassword !== formAkun.newPassword
                      ? 'border-rose-300 focus:ring-rose-400'
                      : formAkun.confirmPassword && formAkun.confirmPassword === formAkun.newPassword
                        ? 'border-emerald-300 focus:ring-emerald-500'
                        : 'border-slate-200 focus:ring-emerald-500']"
                >
                <button @click="showConfirmPwd = !showConfirmPwd" type="button"
                  class="absolute inset-y-0 right-3.5 flex items-center text-[9px] font-black text-slate-400 hover:text-slate-600 cursor-pointer transition-colors">
                  {{ showConfirmPwd ? 'SEMBUNYI' : 'LIHAT' }}
                </button>
              </div>
              <p v-if="formAkun.confirmPassword && formAkun.confirmPassword !== formAkun.newPassword"
                class="text-[9px] font-black text-rose-500">
                ⚠️ Password tidak cocok
              </p>
              <p v-if="formAkun.confirmPassword && formAkun.confirmPassword === formAkun.newPassword && formAkun.newPassword"
                class="text-[9px] font-black text-emerald-600">
                ✓ Password cocok
              </p>
            </div>
          </div>
        </div>

        <!-- Tombol simpan akun -->
        <div class="flex justify-end">
          <button
            @click="saveAkun"
            :disabled="isLoadingAkun"
            class="flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white rounded-lg font-black text-xs uppercase tracking-widest transition-all cursor-pointer shadow-lg shadow-slate-900/20 active:scale-95"
          >
            <span v-if="isLoadingAkun" class="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
            <span>{{ isLoadingAkun ? 'Menyimpan...' : '🔐 Perbarui Akun' }}</span>
          </button>
        </div>
      </div>
    </div>
    </transition>

  </div>
</template>

<style scoped>
.tab-fade-enter-active, .tab-fade-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease;
}
.tab-fade-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.tab-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
