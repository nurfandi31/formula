<script setup>
import { ref, computed } from 'vue'
import { useSocialStore } from '../../stores/social'

const emit = defineEmits(['openProfile', 'toast'])

const socialStore = useSocialStore()

const storiesContainer = ref(null)

const scrollStories = (direction) => {
  if (storiesContainer.value) {
    const scrollAmount = 300
    storiesContainer.value.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    })
  }
}

// Reactively fetch stories and posts from central Pinia store
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
  <section id="sosial" class="scroll-mt-28 relative overflow-hidden bg-white">
    <div class="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_15%,rgba(56,189,248,0.03),transparent_35%)]"></div>
    <div class="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_85%_85%,rgba(16,185,129,0.03),transparent_35%)]"></div>
    <div class="absolute top-10 left-1/4 w-80 h-80 bg-sky-100/25 blur-[120px] rounded-full -z-10"></div>
    <div class="absolute bottom-20 right-1/4 w-80 h-80 bg-emerald-100/25 blur-[120px] rounded-full -z-10"></div>
    <div class="max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-24">
      <div class="text-center max-w-3xl mx-auto mb-12 sm:mb-20 space-y-4">
        <span class="text-xs font-black uppercase tracking-[0.25em] text-emerald-600">Social Feed</span>
        <h2 class="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 leading-tight">
          Kabar Terbaru & <span class="text-transparent bg-clip-text bg-linear-to-r from-emerald-600 via-green-600 to-teal-500">Interaksi Hangat</span>
        </h2>
        <p class="text-slate-500 font-medium text-base sm:text-lg leading-relaxed">
          Simak ungkapan positif, update kegiatan, serta ragam status inspiratif pemuda-pemudi Dusun Ngampon.
        </p>
      </div>

      <div class="relative group/stories mb-12 sm:mb-16">
        <button @click="scrollStories('left')" class="absolute -left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white shadow-xl shadow-emerald-500/10 flex items-center justify-center text-emerald-600 opacity-0 group-hover/stories:opacity-100 transition-opacity cursor-pointer">
           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <button @click="scrollStories('right')" class="absolute -right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white shadow-xl shadow-emerald-500/10 flex items-center justify-center text-emerald-600 opacity-0 group-hover/stories:opacity-100 transition-opacity cursor-pointer">
           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>

        <div ref="storiesContainer" class="flex gap-4 sm:gap-8 overflow-x-auto pb-4 sm:pb-6 scrollbar-hide snap-x px-2 sm:px-0 scroll-smooth">
          <div v-for="story in stories" :key="story.id" @click="emit('openProfile', story.name)" class="flex-shrink-0 text-center space-y-2 sm:space-y-4 cursor-pointer group snap-start">
            <div class="w-16 h-16 sm:w-24 sm:h-24 rounded-full p-1 bg-linear-to-tr from-emerald-400 via-green-500 to-teal-600 group-hover:scale-110 transition-all duration-300 shadow-2xl shadow-emerald-500/20">
              <div class="w-full h-full rounded-full border-2 sm:border-4 border-white overflow-hidden">
                <img :src="story.image" class="w-full h-full object-cover" :alt="story.name">
              </div>
            </div>
            <span class="text-[9px] sm:text-[10px] font-black text-slate-500 truncate w-16 sm:w-24 inline-block uppercase tracking-[0.2em]">{{ story.name }}</span>
          </div>
        </div>
      </div>

      <div class="grid lg:grid-cols-12 gap-8 lg:gap-12">
        <div class="lg:col-span-8 space-y-8 lg:space-y-12">
          <article v-for="post in postsData" :key="post.id" :id="'sosial-post-' + post.id" class="bg-white rounded-[2rem] sm:rounded-[3rem] shadow-2xl shadow-emerald-500/20 overflow-hidden group">
            <div class="p-6 sm:p-8 flex items-center justify-between">
              <div class="flex items-center gap-4 sm:gap-5 cursor-pointer" @click="emit('openProfile', post)">
                <img :src="post.avatar" class="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl object-cover border border-slate-50 shadow-md">
                <div>
                  <h4 class="text-base sm:text-lg font-black text-slate-900 group-hover:text-emerald-600 transition-colors leading-tight">{{ post.user }}</h4>
                  <p class="text-[9px] sm:text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mt-0.5">{{ post.role }}</p>
                </div>
              </div>
              <span class="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest">{{ post.time }}</span>
            </div>
            
            <div class="px-4 sm:px-8">
              <div class="aspect-square md:aspect-video rounded-[1.75rem] sm:rounded-[2.5rem] overflow-hidden bg-slate-100 shadow-inner group-hover:shadow-2xl transition-all duration-500">
                <img :src="post.image" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000">
              </div>
            </div>

            <div class="p-6 sm:p-8 space-y-4 sm:space-y-6">
              <div class="flex items-center gap-6 sm:gap-8">
                <button @click="toggleLike(post)" :class="['flex items-center gap-2 font-black text-xs sm:text-sm cursor-pointer transition-colors', post.hasLiked ? 'text-rose-500' : 'text-slate-700 hover:text-rose-500']">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" :fill="post.hasLiked ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                  {{ post.likes >= 1000 ? (post.likes / 1000).toFixed(1) + 'k' : post.likes }}
                </button>
                
                <button @click="toggleComments(post)" :class="['flex items-center gap-2 font-black text-xs sm:text-sm cursor-pointer transition-colors', post.showComments ? 'text-emerald-600' : 'text-slate-700 hover:text-emerald-600']">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  {{ post.commentsList.length }}
                </button>
                
                <button @click="sharePost(post)" class="ml-auto text-slate-300 hover:text-emerald-500 transition-colors cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                </button>
              </div>
              
              <p class="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                <span class="font-black mr-2 text-slate-900 text-sm cursor-pointer hover:text-emerald-600 transition-colors" @click="emit('openProfile', post)">{{ post.user }}</span> {{ post.caption }}
              </p>
              
              <p @click="toggleComments(post)" class="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-widest cursor-pointer hover:text-emerald-600 transition-colors">
                {{ post.showComments ? 'Sembunyikan komentar' : 'Lihat semua ' + post.commentsList.length + ' komentar' }}
              </p>

              <div v-if="post.showComments" class="mt-6 pt-6 border-t border-slate-50 space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                <h5 class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Daftar Komentar</h5>
                <div class="space-y-3 max-h-48 overflow-y-auto pr-2 scrollbar-thin">
                  <div v-for="(comment, index) in post.commentsList" :key="index" class="p-4 bg-slate-50 rounded-2xl flex items-start gap-3">
                    <div class="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-black text-emerald-700 flex-shrink-0">
                      {{ comment.user.substring(0, 2).toUpperCase() }}
                    </div>
                    <div>
                      <h6 class="text-xs font-black text-slate-900 leading-none">{{ comment.user }}</h6>
                      <p class="text-xs text-slate-600 font-medium mt-1 leading-relaxed">{{ comment.text }}</p>
                    </div>
                  </div>
                </div>
                
                <form @submit.prevent="addComment(post)" class="flex gap-3 pt-2">
                  <input v-model="post.newCommentText" type="text" placeholder="Tulis komentar..." class="flex-grow px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all">
                  <button type="submit" class="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs uppercase tracking-wider transition-colors cursor-pointer">Kirim</button>
                </form>
              </div>
            </div>
          </article>
        </div>

        <div class="lg:col-span-4">
          <div class="bg-white rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 shadow-2xl shadow-emerald-500/20 sticky top-28">
            <div class="w-12 h-1 bg-emerald-600 rounded-full mb-6 sm:mb-8"></div>
            <h3 class="text-xl sm:text-2xl font-black text-slate-900 mb-6 sm:mb-10 flex items-center justify-between">
              Statistik Aksi
              <span class="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
            </h3>
            <p class="text-slate-500 font-medium text-xs sm:text-sm leading-relaxed mb-6 sm:mb-8">
              Melalui pergerakan pemuda yang sinergis dan terpadu, FORMULA berupaya memberikan dampak positif bagi segenap warga dusun.
            </p>
            <div class="space-y-4 sm:space-y-6 pt-4 border-t border-slate-100 font-bold text-slate-600 text-xs sm:text-sm">
              <div class="flex justify-between items-center">
                <span>Total Penyaluran Sosial</span>
                <span class="text-emerald-600 font-black">42 Kali</span>
              </div>
              <div class="flex justify-between items-center">
                <span>Rapat Koordinasi</span>
                <span class="text-green-600 font-black">28 Kali</span>
              </div>
              <div class="flex justify-between items-center">
                <span>Sponsor & Kerja Sama</span>
                <span class="text-teal-600 font-black">12 Mitra</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
