<script setup>
import { ref } from 'vue'

const props = defineProps({
  posts: Array,
  currentUser: Object,
  otherStories: Array,
  hasMyStory: Boolean,
  storiesContainer: Object
})

const emit = defineEmits(['like', 'comment', 'share', 'openCreateStory', 'openStoryViewer', 'myStoryClick', 'viewProfile'])

let isDown = false, startX = 0, scrollLeft = 0, startTime = 0, startXPos = 0
const storiesEl = ref(null)

const onMouseDown = (e) => {
  isDown = true
  startTime = Date.now()
  startXPos = e.pageX
  startX = e.pageX - storiesEl.value.offsetLeft
  scrollLeft = storiesEl.value.scrollLeft
}
const onMouseLeave = () => { isDown = false }
const onMouseUp = () => { isDown = false }
const onMouseMove = (e) => {
  if (!isDown) return
  e.preventDefault()
  const x = e.pageX - storiesEl.value.offsetLeft
  storiesEl.value.scrollLeft = scrollLeft - (x - startX) * 1.5
}

const handleStoryClick = (story, e) => {
  const dur = Date.now() - startTime
  const dist = Math.abs(e.pageX - startXPos)
  if (dur < 200 && dist < 10) emit('openStoryViewer', story)
}

const handleMyStoryClick = (e) => {
  const dur = Date.now() - startTime
  const dist = Math.abs(e.pageX - startXPos)
  if (dur < 200 && dist < 10) emit('myStoryClick')
}

import { useSocialStore } from '../../stores/social'

const socialStore = useSocialStore()
const kasData = socialStore.kasData
const hasilRapat = socialStore.hasilRapat
const agendaKegiatan = socialStore.agendaKegiatan

const agendaColors = {
  emerald: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
  teal: 'bg-teal-500/10 border-teal-500/30 text-teal-400',
  indigo: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400',
  amber: 'bg-amber-500/10 border-amber-500/30 text-amber-400'
}

const formatRupiah = (n) => 'Rp ' + n.toLocaleString('id-ID')

const activeRapatId = ref(1)

const widgets = ref({
  kas: {
    likes: 8, hasLiked: false,
    showComments: false, comments: [
      { user: 'Ahmad', text: 'Alhamdulillah, pengelolaan kas sudah transparan 👍' }
    ], newComment: ''
  },
  rapat: {
    likes: 14, hasLiked: false,
    showComments: false, comments: [
      { user: 'Siti', text: 'Mantap! Keputusan rapatnya sangat bermanfaat untuk warga.' }
    ], newComment: ''
  },
  agenda: {
    likes: 21, hasLiked: false,
    showComments: false, comments: [
      { user: 'Andi', text: 'Siap hadir untuk turnamen futsal! ⚽🔥' }
    ], newComment: ''
  }
})

const toggleWidgetLike = (key) => {
  const w = widgets.value[key]
  if (w.hasLiked) { w.likes--; w.hasLiked = false }
  else { w.likes++; w.hasLiked = true }
}

const addWidgetComment = (key) => {
  const w = widgets.value[key]
  if (!w.newComment.trim()) return
  w.comments.push({ user: props.currentUser?.name?.split(' ')[0] ?? 'Anggota', text: w.newComment.trim() })
  w.newComment = ''
}

const shareWidget = (label) => {
  navigator.clipboard?.writeText(`${window.location.origin} — ${label}`)
  emit('share', { caption: label })
}
</script>

<template>
  <div class="space-y-8 animate-in fade-in duration-300">
    <div class="relative">
      <div
        ref="storiesEl"
        @mousedown="onMouseDown"
        @mouseleave="onMouseLeave"
        @mouseup="onMouseUp"
        @mousemove="onMouseMove"
        class="bg-slate-900/40 border border-slate-850/50 rounded-[2rem] p-4 flex gap-5 overflow-x-auto scrollbar-hide select-none cursor-grab active:cursor-grabbing scroll-smooth"
      >
        <div class="flex-shrink-0 text-center space-y-1.5 cursor-pointer group relative">
          <div
            @click="handleMyStoryClick($event)"
            :class="['w-16 h-16 rounded-full transition-transform group-hover:scale-105', hasMyStory ? 'bg-gradient-to-tr from-[#f77737] via-[#e1306c] to-[#c13584] p-[2.5px]' : 'border-2 border-dashed border-slate-700 p-0.5']"
          >
            <div class="w-full h-full rounded-full border-2 border-slate-950 overflow-hidden bg-slate-900 relative">
              <img :src="currentUser?.avatar" class="w-full h-full object-cover">
            </div>
          </div>
          <button
            @click.stop="emit('openCreateStory')"
            class="absolute bottom-5 right-0 w-5.5 h-5.5 bg-white rounded-full flex items-center justify-center shadow-md cursor-pointer transition-all hover:scale-110 active:scale-95 border-2 border-slate-950"
          >
            <span class="w-4 h-4 bg-sky-500 rounded-full flex items-center justify-center text-[10px] text-white font-extrabold">+</span>
          </button>
          <span class="text-[9.5px] font-medium text-slate-300 truncate w-16 block text-center">Cerita Anda</span>
        </div>

        <div
          v-for="story in otherStories"
          :key="story.id"
          class="flex-shrink-0 text-center space-y-1.5 cursor-pointer group"
          @click="handleStoryClick(story, $event)"
        >
          <div class="w-16 h-16 rounded-full p-[2.5px] bg-gradient-to-tr from-[#f77737] via-[#e1306c] to-[#c13584] group-hover:scale-105 transition-transform pointer-events-none">
            <div class="w-full h-full rounded-full border-2 border-slate-950 overflow-hidden bg-slate-900">
              <img :src="story.image" class="w-full h-full object-cover">
            </div>
          </div>
          <span class="text-[9.5px] font-medium text-slate-400 truncate w-16 block text-center pointer-events-none">
            {{ story.name.toLowerCase().replace(/\s+/g, '_') }}
          </span>
        </div>
      </div>
    </div>

    <div class="space-y-4 px-1">

      <!-- WIDGET KAS -->
      <div class="bg-slate-900/60 border border-slate-800/80 rounded-lg overflow-hidden pb-1">
        <div class="space-y-2 p-1">
          <div class="flex items-center justify-between px-1">
            <div class="flex items-center gap-1.5">
              <span class="text-base">💰</span>
              <span class="text-[11px] font-black text-white uppercase tracking-wider">Kas Organisasi</span>
            </div>
            <button @click="kasData.showDetail = !kasData.showDetail" class="text-[10px] font-semibold text-emerald-400 cursor-pointer hover:text-emerald-300">
              {{ kasData.showDetail ? 'Sembunyikan' : 'Lihat Detail' }}
            </button>
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div class="bg-slate-900/80 border border-slate-800/80 rounded-lg p-4">
              <p class="text-[9px] text-slate-500 uppercase tracking-widest mb-1">Saldo Saat Ini</p>
              <p class="text-[18px] font-black text-white leading-none">{{ formatRupiah(kasData.saldo) }}</p>
              <div class="mt-3 w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                  :style="{ width: `${Math.round((kasData.saldo / kasData.pemasukan) * 100)}%` }"></div>
              </div>
              <p class="text-[9px] text-slate-600 mt-1">{{ Math.round((kasData.saldo / kasData.pemasukan) * 100) }}% tersisa</p>
            </div>

            <div class="bg-slate-900/80 border border-slate-800/80 rounded-lg p-4 flex flex-col gap-3">
              <div>
                <p class="text-[9px] text-emerald-400 uppercase tracking-widest mb-0.5">Total Masuk</p>
                <p class="text-[14px] font-black text-emerald-400 leading-none">+{{ formatRupiah(kasData.pemasukan) }}</p>
              </div>
              <div class="h-px bg-slate-800/60"></div>
              <div>
                <p class="text-[9px] text-rose-400 uppercase tracking-widest mb-0.5">Total Keluar</p>
                <p class="text-[14px] font-black text-rose-400 leading-none">-{{ formatRupiah(kasData.pengeluaran) }}</p>
              </div>
            </div>
          </div>

          <div v-if="kasData.showDetail" class="bg-slate-900/80 border border-slate-800/80 rounded-lg overflow-hidden animate-in fade-in duration-200">
            <p class="text-[9px] font-black text-slate-500 uppercase tracking-widest px-4 py-2 border-b border-slate-800/60">Riwayat Pengeluaran</p>
            <div v-for="item in kasData.riwayat" :key="item.label" class="flex items-center gap-3 px-4 py-2.5 border-b border-slate-800/30 hover:bg-slate-800/20 transition-colors last:border-0">
              <span class="text-lg flex-shrink-0">{{ item.icon }}</span>
              <div class="flex-1 min-w-0">
                <p class="text-[12px] font-semibold text-slate-200 truncate">{{ item.label }}</p>
                <p class="text-[10px] text-slate-500">{{ item.tanggal }}</p>
              </div>
              <span class="text-[12px] font-black text-rose-400 flex-shrink-0">-{{ formatRupiah(item.nominal) }}</span>
            </div>
          </div>
        </div>

        <div class="px-3 pt-2 pb-1 mt-1 flex items-center gap-5 border-t border-slate-800/40">
          <button @click="toggleWidgetLike('kas')" class="flex items-center gap-1.5 cursor-pointer transition-transform active:scale-90" :class="widgets.kas.hasLiked ? 'text-rose-500' : 'text-slate-400 hover:text-slate-200'">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" :fill="widgets.kas.hasLiked ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="1.8"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            <span class="text-[11px] font-semibold">{{ widgets.kas.likes }}</span>
          </button>
          <button @click="widgets.kas.showComments = !widgets.kas.showComments" class="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <span class="text-[11px] font-semibold">{{ widgets.kas.comments.length }}</span>
          </button>
          <button @click="shareWidget('Info Kas FORMULA')" class="text-slate-400 hover:text-slate-200 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>
        <div v-if="widgets.kas.showComments" class="px-3 pb-1 space-y-1.5 animate-in fade-in duration-150">
          <div v-for="(c, i) in widgets.kas.comments" :key="i" class="flex gap-1.5">
            <span class="text-[12px] font-semibold text-white">{{ c.user.toLowerCase().replace(/\s+/g,'_') }}</span>
            <span class="text-[12px] text-slate-300">{{ c.text }}</span>
          </div>
          <form @submit.prevent="addWidgetComment('kas')" class="flex items-center gap-2 pt-2 mt-1 border-t border-slate-800/30">
            <img :src="currentUser?.avatar" class="w-6 h-6 rounded-full object-cover flex-shrink-0">
            <input v-model="widgets.kas.newComment" type="text" placeholder="Tambahkan komentar..." class="flex-1 bg-transparent text-[12px] text-slate-300 placeholder-slate-600 focus:outline-none">
            <button v-if="widgets.kas.newComment" type="submit" class="text-[11px] font-semibold text-emerald-400 cursor-pointer">Kirim</button>
          </form>
        </div>
      </div>

      <!-- WIDGET HASIL RAPAT -->
      <div class="bg-slate-900/60 border border-slate-800/80 rounded-lg overflow-hidden pb-1">
        <div class="flex items-center justify-between px-4 py-3 border-b border-slate-800/60">
          <div class="flex items-center gap-2">
            <span class="text-lg">📋</span>
            <span class="text-[12px] font-black text-white uppercase tracking-wider">Hasil Rapat</span>
          </div>
          <span class="text-[9px] font-black text-slate-500 uppercase tracking-widest">{{ hasilRapat.length }} rapat terakhir</span>
        </div>

        <div class="flex gap-2 px-4 pt-3 pb-1">
          <button
            v-for="rapat in hasilRapat" :key="rapat.id"
            @click="activeRapatId = rapat.id"
            :class="['text-[10px] font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer', activeRapatId === rapat.id ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white']"
          >
            {{ rapat.tanggal }}
          </button>
        </div>

        <div v-for="rapat in hasilRapat" :key="rapat.id">
          <div v-if="activeRapatId === rapat.id" class="px-4 pb-4 pt-2 animate-in fade-in duration-200">
            <p class="text-[13px] font-bold text-white mb-2">{{ rapat.judul }}</p>
            <div class="space-y-1.5">
              <div v-for="(k, i) in rapat.keputusan" :key="i" class="flex gap-2 items-start">
                <span class="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-[9px] font-black text-emerald-400 flex-shrink-0 mt-0.5">{{ i + 1 }}</span>
                <span class="text-[12px] text-slate-300 leading-snug">{{ k }}</span>
              </div>
            </div>
            <p class="text-[10px] text-slate-600 mt-2.5">👥 {{ rapat.peserta }} peserta hadir</p>
          </div>
        </div>

        <div class="px-3 pt-2 pb-1 mt-1 flex items-center gap-5 border-t border-slate-800/40">
          <button @click="toggleWidgetLike('rapat')" class="flex items-center gap-1.5 cursor-pointer transition-transform active:scale-90" :class="widgets.rapat.hasLiked ? 'text-rose-500' : 'text-slate-400 hover:text-slate-200'">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" :fill="widgets.rapat.hasLiked ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="1.8"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            <span class="text-[11px] font-semibold">{{ widgets.rapat.likes }}</span>
          </button>
          <button @click="widgets.rapat.showComments = !widgets.rapat.showComments" class="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <span class="text-[11px] font-semibold">{{ widgets.rapat.comments.length }}</span>
          </button>
          <button @click="shareWidget('Hasil Rapat FORMULA')" class="text-slate-400 hover:text-slate-200 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>
        <div v-if="widgets.rapat.showComments" class="px-3 pb-1 space-y-1.5 animate-in fade-in duration-150">
          <div v-for="(c, i) in widgets.rapat.comments" :key="i" class="flex gap-1.5">
            <span class="text-[12px] font-semibold text-white">{{ c.user.toLowerCase().replace(/\s+/g,'_') }}</span>
            <span class="text-[12px] text-slate-300">{{ c.text }}</span>
          </div>
          <form @submit.prevent="addWidgetComment('rapat')" class="flex items-center gap-2 pt-2 mt-1 border-t border-slate-800/30">
            <img :src="currentUser?.avatar" class="w-6 h-6 rounded-full object-cover flex-shrink-0">
            <input v-model="widgets.rapat.newComment" type="text" placeholder="Tambahkan komentar..." class="flex-1 bg-transparent text-[12px] text-slate-300 placeholder-slate-600 focus:outline-none">
            <button v-if="widgets.rapat.newComment" type="submit" class="text-[11px] font-semibold text-emerald-400 cursor-pointer">Kirim</button>
          </form>
        </div>
      </div>

      <!-- WIDGET AGENDA -->
      <div class="bg-slate-900/60 border border-slate-800/80 rounded-lg overflow-hidden pb-1">
        <div class="flex items-center gap-2 px-4 py-3 border-b border-slate-800/60">
          <span class="text-lg">📅</span>
          <span class="text-[12px] font-black text-white uppercase tracking-wider">Agenda Kegiatan</span>
        </div>
        <div class="divide-y divide-slate-800/40">
          <div v-for="agenda in agendaKegiatan" :key="agenda.id" class="flex gap-3 px-4 py-3 hover:bg-slate-800/20 transition-colors">
            <div :class="['w-1 rounded-full flex-shrink-0', `bg-${agenda.warna}-500`]"></div>
            <div class="flex-1 min-w-0">
              <p class="text-[13px] font-semibold text-white leading-tight">{{ agenda.judul }}</p>
              <div class="flex flex-wrap gap-x-3 mt-1">
                <span class="text-[10px] text-slate-400">📅 {{ agenda.tanggal }}</span>
                <span class="text-[10px] text-slate-400">🕐 {{ agenda.jam }}</span>
              </div>
              <span class="text-[10px] text-slate-500">📍 {{ agenda.lokasi }}</span>
            </div>
            <span :class="['text-[9px] font-black px-2 py-1 rounded-lg border self-start uppercase tracking-wider flex-shrink-0', agendaColors[agenda.warna]]">{{ agenda.kategori }}</span>
          </div>
        </div>

        <div class="px-3 pt-2 pb-1 mt-1 flex items-center gap-5 border-t border-slate-800/40">
          <button @click="toggleWidgetLike('agenda')" class="flex items-center gap-1.5 cursor-pointer transition-transform active:scale-90" :class="widgets.agenda.hasLiked ? 'text-rose-500' : 'text-slate-400 hover:text-slate-200'">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" :fill="widgets.agenda.hasLiked ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="1.8"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            <span class="text-[11px] font-semibold">{{ widgets.agenda.likes }}</span>
          </button>
          <button @click="widgets.agenda.showComments = !widgets.agenda.showComments" class="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            <span class="text-[11px] font-semibold">{{ widgets.agenda.comments.length }}</span>
          </button>
          <button @click="shareWidget('Agenda Kegiatan FORMULA')" class="text-slate-400 hover:text-slate-200 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>
        <div v-if="widgets.agenda.showComments" class="px-3 pb-1 space-y-1.5 animate-in fade-in duration-150">
          <div v-for="(c, i) in widgets.agenda.comments" :key="i" class="flex gap-1.5">
            <span class="text-[12px] font-semibold text-white">{{ c.user.toLowerCase().replace(/\s+/g,'_') }}</span>
            <span class="text-[12px] text-slate-300">{{ c.text }}</span>
          </div>
          <form @submit.prevent="addWidgetComment('agenda')" class="flex items-center gap-2 pt-2 mt-1 border-t border-slate-800/30">
            <img :src="currentUser?.avatar" class="w-6 h-6 rounded-full object-cover flex-shrink-0">
            <input v-model="widgets.agenda.newComment" type="text" placeholder="Tambahkan komentar..." class="flex-1 bg-transparent text-[12px] text-slate-300 placeholder-slate-600 focus:outline-none">
            <button v-if="widgets.agenda.newComment" type="submit" class="text-[11px] font-semibold text-emerald-400 cursor-pointer">Kirim</button>
          </form>
        </div>
      </div>

    </div>

    <div class="space-y-0">
      <article
        v-for="post in posts"
        :key="post.id"
        class="border-b border-slate-800/60 pb-2 mb-2"
      >
        <div class="flex items-center justify-between px-4 py-3">
          <div class="flex items-center gap-3 cursor-pointer group" @click="emit('viewProfile', post.user)">
            <div class="w-9 h-9 rounded-full p-[2px] bg-gradient-to-tr from-[#f77737] via-[#e1306c] to-[#c13584] flex-shrink-0 group-hover:scale-105 transition-transform">
              <div class="w-full h-full rounded-full border-[2px] border-slate-950 overflow-hidden">
                <img :src="post.avatar" class="w-full h-full object-cover">
              </div>
            </div>
            <div>
              <p class="text-[13px] font-semibold text-white leading-tight group-hover:underline">{{ post.user.toLowerCase().replace(/\s+/g, '_') }}</p>
              <p class="text-[10px] text-slate-500 leading-tight">{{ post.role }}</p>
            </div>
          </div>
          <button class="text-slate-400 hover:text-white px-1 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/>
            </svg>
          </button>
        </div>

        <div class="aspect-square overflow-hidden bg-slate-900">
          <img :src="post.image" class="w-full h-full object-cover">
        </div>

        <div class="px-4 pt-3 pb-1">
          <div class="flex items-center gap-4">
            <button @click="emit('like', post)" class="cursor-pointer transition-transform active:scale-90"
              :class="post.hasLiked ? 'text-rose-500' : 'text-slate-200 hover:text-slate-400'">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                :fill="post.hasLiked ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
            <button @click="post.showComments = !post.showComments" class="text-slate-200 hover:text-slate-400 cursor-pointer transition-transform active:scale-90">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </button>
            <button @click="emit('share', post)" class="text-slate-200 hover:text-slate-400 cursor-pointer transition-transform active:scale-90">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
              </svg>
            </button>
            <button class="ml-auto text-slate-200 hover:text-white cursor-pointer transition-transform active:scale-90">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </svg>
            </button>
          </div>

          <p class="text-[13px] font-semibold text-white mt-2">{{ post.likes }} suka</p>
          <p class="text-[13px] text-slate-200 mt-1 leading-snug">
            <span class="font-semibold text-white mr-1">{{ post.user.toLowerCase().replace(/\s+/g, '_') }}</span>{{ post.caption }}
          </p>
          <button
            v-if="post.commentsList.length > 0"
            @click="post.showComments = !post.showComments"
            class="text-[12px] text-slate-500 mt-1 cursor-pointer hover:text-slate-300 transition-colors block">
            {{ post.showComments ? 'Sembunyikan komentar' : `Lihat ${post.commentsList.length} komentar` }}
          </button>
          <p class="text-[11px] text-slate-600 mt-1 uppercase tracking-wide">{{ post.time }}</p>
        </div>

        <div v-if="post.showComments" class="px-4 pt-1 pb-2 space-y-2 animate-in fade-in duration-200">
          <div v-for="(comment, idx) in post.commentsList" :key="idx" class="flex gap-2 items-start">
            <span class="text-[13px] font-semibold text-white whitespace-nowrap">{{ comment.user.toLowerCase().replace(/\s+/g,'_') }}</span>
            <span class="text-[13px] text-slate-300 leading-snug">{{ comment.text }}</span>
          </div>
        </div>

        <form @submit.prevent="emit('comment', post)" class="flex items-center gap-3 px-4 py-2 border-t border-slate-800/40 mt-1">
          <div class="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 border border-slate-800">
            <img :src="currentUser?.avatar" class="w-full h-full object-cover">
          </div>
          <input
            v-model="post.newCommentText"
            type="text"
            :placeholder="`Tambahkan komentar sebagai ${currentUser?.name?.split(' ')[0] ?? 'Kamu'}...`"
            class="flex-1 bg-transparent text-[12px] text-slate-300 placeholder-slate-600 focus:outline-none py-1"
          >
          <button
            v-if="post.newCommentText"
            type="submit"
            class="text-[12px] font-semibold text-emerald-400 cursor-pointer hover:text-emerald-300">
            Kirim
          </button>
        </form>
      </article>
    </div>
  </div>
</template>
