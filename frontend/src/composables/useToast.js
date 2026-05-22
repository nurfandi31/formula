import { ref } from 'vue'

// Shared reactive state — satu instance dipakai di seluruh app
const toasts = ref([])

let idCounter = 0

/**
 * Tampilkan toast notifikasi
 * @param {string} message - Pesan yang ditampilkan
 * @param {'success'|'error'|'info'|'warning'} type - Tipe notifikasi
 * @param {number} duration - Durasi tampil dalam ms (default 4000)
 */
function showToast(message, type = 'success', duration = 4000) {
  const id = ++idCounter
  toasts.value.push({ id, message, type })

  setTimeout(() => {
    removeToast(id)
  }, duration)
}

function removeToast(id) {
  const idx = toasts.value.findIndex(t => t.id === id)
  if (idx !== -1) toasts.value.splice(idx, 1)
}

/**
 * Simpan toast ke localStorage agar bisa dibaca setelah navigasi
 * Gunakan ini SEBELUM router.push()
 */
function queueToast(message, type = 'success') {
  localStorage.setItem('formula_pending_toast', JSON.stringify({ message, type }))
}

/**
 * Baca & tampilkan toast yang tersimpan di localStorage
 * Panggil ini di onMounted atau setelah navigasi selesai
 */
function flushPendingToast() {
  const raw = localStorage.getItem('formula_pending_toast')
  if (raw) {
    try {
      const { message, type } = JSON.parse(raw)
      showToast(message, type)
    } catch (_) {}
    localStorage.removeItem('formula_pending_toast')
  }
}

export function useToast() {
  return { toasts, showToast, removeToast, queueToast, flushPendingToast }
}
