<script setup>
import { ref, computed } from 'vue'
import { useSocialStore } from '../../stores/social'

const emit = defineEmits(['openProfile', 'toast'])
const socialStore = useSocialStore()

const storiesContainer = ref(null)

const scrollStories = (direction) => {
  if (storiesContainer.value) {
    storiesContainer.value.scrollBy({
      left: direction === 'left' ? -280 : 280,
      behavior: 'smooth'
    })
  }
}

const stories = computed(() => socialStore.stories)
const postsData = computed(() => socialStore.posts)

const toggleLike = (post) => {
  if (post.hasLiked) {
    post.likes--
    post.hasLiked = false
  } else {
    post.likes++
    post.hasLiked = true
  }
}

const toggleComments = (post) => {
  post.showComments = !post.showComments
}

const addComment = (post) => {
  if (post.newCommentText.trim() === '') return
  post.commentsList.push({
    user: 'Kamu (Pengunjung)',
    text: post.newCommentText.trim()
  })
  post.newCommentText = ''
}

const sharePost = (post) => {
  const shareLink = `${window.location.origin}${window.location.pathname}#sosial-post-${post.id}`
  navigator.clipboard.writeText(shareLink).then(() => {
    emit('toast', 'Tautan berhasil disalin ke papan klip! 🔗')
  }).catch(() => {
    emit('toast', 'Gagal menyalin tautan.')
  })
}
</script>

<template>
  <section id="sosial" class="scroll-mt-24 relative overflow-hidden bg-white">
    <div class="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_15%,rgba(56,189,248,0.03),transparent_35%)]"></div>
    <div class="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_85%_85%,rgba(16,185,129,0.03),transparent_35%)]"></div>
    <div class="absolute top-10 left-1/4 w-72 h-72 bg-sky-100/20 blur-[100px] rounded-full -z-10"></div>
    <div class="absolute bottom-20 right-1/4 w-72 h-72 bg-emerald-100/20 blur-[100px] rounded-full -z-10"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">

      <div class="text-center max-w-3xl mx-auto mb-12 sm:mb-16 lg:mb-20 space-y-4">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 border border-emerald-200/60 rounded-full mb-2">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span class="text-[10px] sm:text-xs font-black text-emerald-600 uppercase tracking-[0.2em]">Social Feed</span>
        </div>
        <h2 class="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-tight">
          Kabar Terbaru &
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500">Interaksi Hangat</span>
        </h2>
        <p class="text-slate-500 font-medium text-sm sm:text-base lg:text-lg leading-relaxed">
          Simak ungkapan positif, update kegiatan, serta ragam status inspiratif pemuda-pemudi Dusun Ngampon.
        </p>
      </div>

      <div class="relative mb-10 sm:mb-14">
        <button
          @click="scrollStories('left')"
          class="hidden sm:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border border-slate-100 shadow-lg items-center justify-center text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <button
          @click="scrollStories('right')"
          class="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border border-slate-100 shadow-lg items-center justify-center text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>

        <div
          ref="storiesContainer"
          class="flex gap-4 sm:gap-6 overflow-x-auto pb-3 sm:pb-4 snap-x snap-mandatory scroll-smooth"
          style="scrollbar-width: none; -ms-overflow-style: none;"
        >
          <div
            v-for="story in stories"
            :key="story.id"
            @click="emit('openProfile', story.name)"
            class="flex-shrink-0 text-center space-y-2 cursor-pointer group snap-start"
          >
            <div class="w-14 h-14 sm:w-20 sm:h-20 rounded-full p-[2px] sm:p-[3px] bg-gradient-to-tr from-emerald-400 via-green-500 to-teal-600 group-hover:scale-110 transition-all duration-300 shadow-lg shadow-emerald-500/15 mx-auto">
              <div class="w-full h-full rounded-full border-2 sm:border-[3px] border-white overflow-hidden">
                <img :src="story.image" class="w-full h-full object-cover" :alt="story.name">
              </div>
            </div>
            <span class="text-[9px] sm:text-[10px] font-black text-slate-500 truncate w-14 sm:w-20 inline-block uppercase tracking-wider">{{ story.name.split(' ')[0] }}</span>
          </div>
        </div>
      </div>

      <div class="grid lg:grid-cols-12 gap-6 lg:gap-10">

        <div class="lg:col-span-8 space-y-6 sm:space-y-8">
          <article
            v-for="post in postsData"
            :key="post.id"
            :id="'sosial-post-' + post.id"
            class="bg-white border border-slate-100 rounded-2xl sm:rounded-3xl shadow-xl shadow-slate-100/80 overflow-hidden group"
          >
            <div class="p-4 sm:p-6 flex items-center justify-between">
              <div class="flex items-center gap-3 sm:gap-4 cursor-pointer" @click="emit('openProfile', post)">
                <img :src="post.avatar" class="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl object-cover border border-slate-100 shadow-md">
                <div>
                  <h4 class="text-sm sm:text-base font-black text-slate-900 group-hover:text-emerald-600 transition-colors leading-tight">{{ post.user }}</h4>
                  <p class="text-[9px] sm:text-[10px] font-black text-emerald-500 uppercase tracking-wider mt-0.5">{{ post.role }}</p>
                </div>
              </div>
              <span class="text-[10px] sm:text-xs font-bold text-slate-400">{{ post.time }}</span>
            </div>

            <div class="px-4 sm:px-6">
              <div class="rounded-2xl overflow-hidden bg-slate-100 group-hover:shadow-xl transition-shadow duration-500" style="aspect-ratio: 16/9;">
                <img :src="post.image" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">
              </div>
            </div>

            <div class="p-4 sm:p-6 space-y-3 sm:space-y-4">
              <div class="flex items-center gap-4 sm:gap-6">
                <button
                  @click="toggleLike(post)"
                  :class="['flex items-center gap-1.5 font-black text-xs sm:text-sm cursor-pointer transition-colors', post.hasLiked ? 'text-rose-500' : 'text-slate-600 hover:text-rose-500']"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" :fill="post.hasLiked ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                  {{ post.likes >= 1000 ? (post.likes / 1000).toFixed(1) + 'k' : post.likes }}
                </button>

                <button
                  @click="toggleComments(post)"
                  :class="['flex items-center gap-1.5 font-black text-xs sm:text-sm cursor-pointer transition-colors', post.showComments ? 'text-emerald-600' : 'text-slate-600 hover:text-emerald-600']"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  {{ post.commentsList.length }}
                </button>

                <button @click="sharePost(post)" class="ml-auto text-slate-300 hover:text-emerald-500 transition-colors cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                </button>
              </div>

              <p class="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                <span class="font-black text-slate-900 cursor-pointer hover:text-emerald-600 transition-colors mr-1" @click="emit('openProfile', post)">{{ post.user }}</span>
                {{ post.caption }}
              </p>

              <p @click="toggleComments(post)" class="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-widest cursor-pointer hover:text-emerald-600 transition-colors">
                {{ post.showComments ? 'Sembunyikan komentar' : 'Lihat ' + post.commentsList.length + ' komentar' }}
              </p>

              <div v-if="post.showComments" class="pt-4 border-t border-slate-50 space-y-3">
                <div class="space-y-2 max-h-44 overflow-y-auto pr-1">
                  <div v-for="(comment, index) in post.commentsList" :key="index" class="p-3 bg-slate-50 rounded-xl flex items-start gap-2.5">
                    <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-100 flex items-center justify-center text-[10px] font-black text-emerald-700 flex-shrink-0">
                      {{ comment.user.substring(0, 2).toUpperCase() }}
                    </div>
                    <div>
                      <h6 class="text-[10px] sm:text-xs font-black text-slate-900">{{ comment.user }}</h6>
                      <p class="text-[10px] sm:text-xs text-slate-500 font-medium mt-0.5 leading-relaxed">{{ comment.text }}</p>
                    </div>
                  </div>
                </div>

                <form @submit.prevent="addComment(post)" class="flex gap-2 pt-1">
                  <input
                    v-model="post.newCommentText"
                    type="text"
                    placeholder="Tulis komentar..."
                    class="flex-grow px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                  >
                  <button type="submit" class="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs uppercase tracking-wide transition-colors cursor-pointer">
                    Kirim
                  </button>
                </form>
              </div>
            </div>
          </article>
        </div>

        <div class="lg:col-span-4">
          <div class="bg-white border border-slate-100 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-100/80 lg:sticky lg:top-24">
            <div class="flex items-center justify-between mb-6">
              <div>
                <div class="w-8 h-1 bg-emerald-500 rounded-full mb-2.5"></div>
                <h3 class="text-lg sm:text-xl font-black text-slate-900">Statistik Aksi</h3>
              </div>
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>

            <p class="text-slate-500 font-medium text-xs sm:text-sm leading-relaxed mb-6 pb-6 border-b border-slate-100">
              Melalui pergerakan pemuda yang sinergis dan terpadu, FORMULA berupaya memberikan dampak positif bagi segenap warga dusun.
            </p>

            <div class="space-y-4">
              <div v-for="stat in [
                { label: 'Total Penyaluran Sosial', value: '42 Kali', color: 'text-emerald-600' },
                { label: 'Rapat Koordinasi', value: '28 Kali', color: 'text-green-600' },
                { label: 'Sponsor & Kerja Sama', value: '12 Mitra', color: 'text-teal-600' }
              ]" :key="stat.label" class="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                <span class="text-xs sm:text-sm font-semibold text-slate-600">{{ stat.label }}</span>
                <span :class="['font-black text-xs sm:text-sm', stat.color]">{{ stat.value }}</span>
              </div>
            </div>

            <div class="mt-6 pt-6 border-t border-slate-100">
              <p class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Aksi Cepat</p>
              <div class="space-y-2">
                <a href="https://wa.me/628123456789" target="_blank" class="flex items-center gap-2.5 p-3 rounded-xl bg-green-50 hover:bg-green-100 text-green-700 transition-colors group cursor-pointer">
                  <span class="text-base">💬</span>
                  <span class="text-xs font-black">Chat WhatsApp</span>
                  <svg class="ml-auto w-3 h-3 group-hover:translate-x-0.5 transition-transform" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="m9 18 6-6-6-6"/></svg>
                </a>
                <a href="https://instagram.com/formula_ngampon" target="_blank" class="flex items-center gap-2.5 p-3 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-700 transition-colors group cursor-pointer">
                  <span class="text-base">📸</span>
                  <span class="text-xs font-black">Follow Instagram</span>
                  <svg class="ml-auto w-3 h-3 group-hover:translate-x-0.5 transition-transform" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="m9 18 6-6-6-6"/></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
div[ref="storiesContainer"]::-webkit-scrollbar { display: none; }
</style>
