<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSocialStore } from '../../stores/social'

import DesktopSidebar from './DesktopSidebar.vue'
import MobileBottomNav from './MobileBottomNav.vue'
import FeedTab from './FeedTab.vue'
import MessagesTab from './MessagesTab.vue'
import ExploreTab from './ExploreTab.vue'
import CreateTab from './CreateTab.vue'
import ProfileTab from './ProfileTab.vue'
import EditProfileTab from './EditProfileTab.vue'
import StoryViewer from './StoryViewer.vue'
import CreateStoryModal from './CreateStoryModal.vue'

const router = useRouter()
const socialStore = useSocialStore()

const activeTab = ref('feed')
const selectedImage = ref('/formula_youth_landing_hero_1777344117635.png')
const captionText = ref('')
const showToast = ref(false)
const toastMsg = ref('')
const fileInput = ref(null)
const editingPost = ref(null)
const editingCaptionText = ref('')
const viewingMember = ref(null)
const editName = ref('')
const editBio = ref('')
const editQuote = ref('')
const editHobby = ref('')
const editEducation = ref('')
const editInstagram = ref('')
const editAvatar = ref('')
const activeChatMember = ref(null)
const chatInputText = ref('')
const showNotifications = ref(false)

const activeStory = ref(null)
const activeSlideIndex = ref(0)
const storyProgress = ref(0)
let storyProgressInterval = null

const showCreateStoryModal = ref(false)
const newStoryImage = ref('/formula_youth_landing_hero_1777344117635.png')
const newStoryCaption = ref('')
const storySourceMode = ref('gallery')
const currentFacingMode = ref('user')
const isCameraActive = ref(false)
let activeStream = null

const presetImages = [
  { id: 1, path: '/formula_youth_landing_hero_1777344117635.png', label: 'Rapat Kerja' },
  { id: 2, path: '/ngampon_village_vibes_1777344139732.png', label: 'Suasana Dusun' },
  { id: 3, path: '/member_portrait_1_1777344189794.png', label: 'Potret Pengurus' }
]

const presetAvatars = [
  { path: '/member_portrait_1_1777344189794.png', label: 'Avatar 1' },
  { path: '/member_portrait_2_1777344210087.png', label: 'Avatar 2' },
  { path: '/member_portrait_3_1777354146065.png', label: 'Avatar 3' },
  { path: '/member_portrait_4_1777354168316.png', label: 'Avatar 4' }
]

const currentUser = computed(() => socialStore.currentUser)
const stories = computed(() => socialStore.stories)
const posts = computed(() => socialStore.posts)

const activeTabIndex = computed(() => {
  const tabs = ['feed', 'explore', 'create', 'messages', 'profile']
  const idx = tabs.indexOf(activeTab.value)
  return idx !== -1 ? idx : 0
})

const myStory = computed(() => stories.value.find(s => s.name === 'Cerita Saya'))
const hasMyStory = computed(() => !!myStory.value && myStory.value.slides.length > 0)
const otherStories = computed(() => stories.value.filter(s => s.name !== 'Cerita Saya'))
const myPosts = computed(() => {
  if (!currentUser.value) return []
  return posts.value.filter(p => p.user === currentUser.value.name)
})
const exploreUsers = computed(() => {
  if (!currentUser.value) return []
  return Object.values(socialStore.users).filter(u => u.email !== currentUser.value.email)
})
const allOtherMembers = computed(() => {
  if (!currentUser.value) return []
  return Object.values(socialStore.users).filter(u => u.email !== currentUser.value.email)
})
const chatMessages = computed(() => {
  if (!activeChatMember.value) return []
  return socialStore.messages[activeChatMember.value.email.toLowerCase().trim()] || []
})

const unreadNotificationsCount = computed(() => {
  if (!currentUser.value || !currentUser.value.notifications) return 0
  return currentUser.value.notifications.filter(n => !n.read).length
})

const getNotificationUser = (email) => {
  return socialStore.users[email] || null
}

const openNotifications = () => {
  socialStore.markNotificationsAsRead()
  showNotifications.value = true
}

const handleFollowToggle = (memberEmail) => {
  const res = socialStore.toggleFollow(memberEmail)
  if (res && res.success) {
    triggerToast(res.isFollowing ? 'Mulai mengikuti teman! 🤝' : 'Batal mengikuti teman.')
    // Refresh viewing member to get updated followers list if needed
    if (viewingMember.value && viewingMember.value.email === memberEmail) {
      viewingMember.value = socialStore.users[memberEmail]
    }
  }
}

const triggerToast = (msg) => {
  toastMsg.value = msg
  showToast.value = true
  setTimeout(() => { showToast.value = false }, 3000)
}

const handleLogout = () => {
  socialStore.logout()
  router.push('/login')
}

const toggleLike = (post) => {
  if (post.hasLiked) { post.likes--; post.hasLiked = false }
  else { post.likes++; post.hasLiked = true }
}

const submitComment = (post) => {
  if (!post.newCommentText?.trim()) return
  post.commentsList.push({ user: currentUser.value?.name ?? 'Anggota', text: post.newCommentText.trim() })
  post.newCommentText = ''
  triggerToast('Komentar berhasil ditambahkan! 💬')
}

const copyShareLink = (post) => {
  const link = `${window.location.origin}/#sosial-post-${post.id}`
  navigator.clipboard.writeText(link).then(() => triggerToast('Tautan kiriman disalin! 🔗')).catch(() => triggerToast('Gagal menyalin tautan.'))
}

const publishNewPost = () => {
  if (!captionText.value?.trim()) { triggerToast('Tulis caption terlebih dahulu!'); return }
  const res = socialStore.addPost(captionText.value, selectedImage.value)
  if (res.success) {
    captionText.value = ''
    selectedImage.value = presetImages[0].path
    activeTab.value = 'feed'
    triggerToast('Kiriman berhasil dibagikan! 🚀🌿')
  } else { triggerToast(res.message) }
}

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => { selectedImage.value = e.target.result; triggerToast('Foto berhasil diunggah! 📸') }
    reader.readAsDataURL(file)
  }
}

const openEditPost = (post) => { editingPost.value = post; editingCaptionText.value = post.caption }
const saveEditedPost = () => {
  if (editingPost.value) {
    const res = socialStore.updatePost(editingPost.value.id, editingCaptionText.value)
    if (res.success) { triggerToast('Caption berhasil diubah! ✨'); editingPost.value = null }
    else triggerToast(res.message)
  }
}
const confirmDeletePost = (post) => {
  if (confirm('Apakah Anda yakin ingin menghapus kiriman ini?')) {
    const res = socialStore.deletePost(post.id)
    if (res.success) { triggerToast('Kiriman berhasil dihapus! 🗑️'); editingPost.value = null }
    else triggerToast(res.message)
  }
}

const handleUpdateProfile = () => {
  if (!editName.value?.trim()) { triggerToast('Nama tidak boleh kosong!'); return }
  const res = socialStore.updateProfile({ name: editName.value, quote: editQuote.value, hobby: editHobby.value, education: editEducation.value, instagram: editInstagram.value, avatar: editAvatar.value })
  if (res.success) { triggerToast('Profil berhasil diperbarui! 🎉'); activeTab.value = 'profile' }
  else triggerToast('Gagal memperbarui profil.')
}

const initializeProfileForm = () => {
  if (socialStore.currentUser) {
    editName.value = socialStore.currentUser.name
    editQuote.value = socialStore.currentUser.quote || ''
    editHobby.value = socialStore.currentUser.hobby || ''
    editEducation.value = socialStore.currentUser.education || ''
    editInstagram.value = socialStore.currentUser.instagram || ''
    editAvatar.value = socialStore.currentUser.avatar || ''
  }
}

const viewMemberProfile = (member) => { 
  closeStoryViewer()
  if (typeof member === 'string') {
    const found = Object.values(socialStore.users).find(u => u.name === member || u.nickname === member || u.email === member)
    if (found) viewingMember.value = found
  } else {
    viewingMember.value = member 
  }
}
const closeMemberView = () => { viewingMember.value = null }
const selectChatMember = (member) => { activeChatMember.value = member }

const sendChatMessage = (text) => {
  if (!activeChatMember.value) return
  socialStore.sendDirectMessage(activeChatMember.value.email, text)
  triggerToast('Pesan terkirim! ✉️')
}

const startStoryProgress = () => {
  if (storyProgressInterval) clearInterval(storyProgressInterval)
  storyProgress.value = 0
  storyProgressInterval = setInterval(() => {
    if (activeStory.value) {
      storyProgress.value += 2.5
      if (storyProgress.value >= 100) nextSlide()
    } else { clearInterval(storyProgressInterval) }
  }, 100)
}

const openStoryViewer = (story) => { activeStory.value = story; activeSlideIndex.value = 0; startStoryProgress() }
const closeStoryViewer = () => { activeStory.value = null; if (storyProgressInterval) clearInterval(storyProgressInterval) }

const nextSlide = () => {
  if (!activeStory.value) return
  const slides = activeStory.value.slides || []
  if (activeSlideIndex.value < slides.length - 1) { activeSlideIndex.value++; startStoryProgress() }
  else {
    const idx = stories.value.findIndex(s => s.id === activeStory.value.id)
    if (idx !== -1 && idx < stories.value.length - 1) { activeStory.value = stories.value[idx + 1]; activeSlideIndex.value = 0; startStoryProgress() }
    else closeStoryViewer()
  }
}

const prevSlide = () => {
  if (!activeStory.value) return
  if (activeSlideIndex.value > 0) { activeSlideIndex.value--; startStoryProgress() }
  else {
    const idx = stories.value.findIndex(s => s.id === activeStory.value.id)
    if (idx > 0) { activeStory.value = stories.value[idx - 1]; const prev = activeStory.value.slides || []; activeSlideIndex.value = prev.length > 0 ? prev.length - 1 : 0; startStoryProgress() }
    else startStoryProgress()
  }
}

const replyToStory = (text) => {
  if (!activeStory.value) return
  const creator = activeStory.value.name.toLowerCase()
  const found = Object.values(socialStore.users).find(u => u.name.toLowerCase().includes(creator) || u.nickname.toLowerCase().includes(creator))
  if (found) { socialStore.sendDirectMessage(found.email, `Membalas Cerita Anda: "${text}" 📸`); triggerToast(`Balasan dikirim ke ${found.name}! 💌`) }
  else triggerToast('Komentar terkirim! 💬')
  closeStoryViewer()
}

const openCreateStory = () => { newStoryImage.value = presetImages[0].path; newStoryCaption.value = ''; storySourceMode.value = 'gallery'; showCreateStoryModal.value = true }
const closeCreateStory = () => { showCreateStoryModal.value = false; stopCamera() }

const startCamera = async () => {
  if (activeStream) activeStream.getTracks().forEach(t => t.stop())
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: currentFacingMode.value, width: { ideal: 1280 }, height: { ideal: 720 } }, audio: false })
    activeStream = stream
    isCameraActive.value = true
  } catch { triggerToast('Gagal mengakses kamera! 📁'); storySourceMode.value = 'gallery' }
}

const stopCamera = () => {
  if (activeStream) { activeStream.getTracks().forEach(t => t.stop()); activeStream = null }
  isCameraActive.value = false
}

const setSourceMode = (mode) => {
  storySourceMode.value = mode
  if (mode === 'camera') setTimeout(() => startCamera(), 150)
  else stopCamera()
}

const toggleFacingMode = () => { currentFacingMode.value = currentFacingMode.value === 'user' ? 'environment' : 'user'; startCamera() }

const capturePhoto = (videoEl) => {
  if (videoEl) {
    const canvas = document.createElement('canvas')
    canvas.width = videoEl.videoWidth || 640
    canvas.height = videoEl.videoHeight || 480
    canvas.getContext('2d').drawImage(videoEl, 0, 0, canvas.width, canvas.height)
    newStoryImage.value = canvas.toDataURL('image/jpeg')
    stopCamera(); storySourceMode.value = 'gallery'
    triggerToast('Foto berhasil ditangkap! 📸✨')
  }
}

const handleStoryImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) { const r = new FileReader(); r.onload = e => { newStoryImage.value = e.target.result; triggerToast('Foto cerita diunggah! 📸') }; r.readAsDataURL(file) }
}

const publishMyStory = () => {
  if (!newStoryCaption.value?.trim()) { triggerToast('Tulis keterangan cerita terlebih dahulu!'); return }
  if (myStory.value) {
    myStory.value.slides.push({ id: Date.now(), image: newStoryImage.value, caption: newStoryCaption.value.trim() })
  } else {
    socialStore.stories.unshift({ id: Date.now(), name: 'Cerita Saya', image: currentUser.value.avatar, slides: [{ id: Date.now(), image: newStoryImage.value, caption: newStoryCaption.value.trim() }] })
  }
  closeCreateStory(); triggerToast('Cerita berhasil dibagikan! 📸✨')
}

const handleMyStoryClick = () => {
  if (hasMyStory.value) openStoryViewer(myStory.value)
  else openCreateStory()
}

onMounted(() => {
  if (!socialStore.currentUser) { router.push('/login'); return }
  initializeProfileForm()
})
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex font-sans select-none antialiased">
    <DesktopSidebar :activeTab="activeTab" :currentUser="currentUser" @update:activeTab="activeTab = $event" @logout="handleLogout" @open-notifications="openNotifications" />

    <MobileBottomNav :activeTab="activeTab" :activeTabIndex="activeTabIndex" :currentUser="currentUser" @update:activeTab="activeTab = $event" />

    <main class="flex-1 md:ml-72 pb-24 md:pb-8 min-h-screen relative overflow-hidden bg-slate-950">
      <div class="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full -z-10"></div>
      <div class="absolute bottom-0 left-1/3 w-96 h-96 bg-teal-500/5 blur-[120px] rounded-full -z-10"></div>

      <header class="md:hidden h-14 bg-slate-950 border-b border-slate-900 px-6 flex items-center justify-between sticky top-0 z-35 shadow-md">
        <h2 class="logo-cursive text-white select-none">Formula</h2>
        <div class="flex items-center gap-5">
          <button @click="openCreateStory" class="text-2xl text-white hover:text-emerald-400 transition-colors cursor-pointer active:scale-90 select-none">＋</button>
          <button @click="openNotifications" class="relative text-xl cursor-pointer active:scale-90 select-none">
            ❤️
            <span v-if="unreadNotificationsCount > 0" class="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-slate-950 animate-pulse"></span>
          </button>
        </div>
      </header>

      <div class="max-w-4xl mx-auto px-4 md:px-8 py-6 md:py-8">
        <FeedTab
          v-if="activeTab === 'feed'"
          :posts="posts"
          :currentUser="currentUser"
          :otherStories="otherStories"
          :hasMyStory="hasMyStory"
          @like="toggleLike"
          @comment="submitComment"
          @share="copyShareLink"
          @openCreateStory="openCreateStory"
          @openStoryViewer="openStoryViewer"
          @myStoryClick="handleMyStoryClick"
          @viewProfile="viewMemberProfile"
        />

        <MessagesTab
          v-else-if="activeTab === 'messages'"
          :allOtherMembers="allOtherMembers"
          :activeChatMember="activeChatMember"
          :chatMessages="chatMessages"
          :currentUser="currentUser"
          :allMessages="socialStore.messages"
          @selectMember="selectChatMember"
          @sendMessage="sendChatMessage"
          @clearMember="activeChatMember = null"
          @viewProfile="viewMemberProfile"
        />

        <ExploreTab
          v-else-if="activeTab === 'explore'"
          :exploreUsers="exploreUsers"
          @viewProfile="viewMemberProfile"
        />

        <CreateTab
          v-else-if="activeTab === 'create'"
          :presetImages="presetImages"
          :selectedImage="selectedImage"
          :captionText="captionText"
          @update:selectedImage="selectedImage = $event"
          @update:captionText="captionText = $event"
          @publish="publishNewPost"
          @uploadImage="fileInput?.click()"
        />

        <ProfileTab
          v-else-if="activeTab === 'profile'"
          :currentUser="currentUser"
          :myPosts="myPosts"
          @editProfile="activeTab = 'edit-profile'"
          @logout="handleLogout"
          @editPost="openEditPost"
          @goCreate="activeTab = 'create'"
        />

        <EditProfileTab
          v-else-if="activeTab === 'edit-profile'"
          :editName="editName"
          :editQuote="editQuote"
          :editHobby="editHobby"
          :editEducation="editEducation"
          :editInstagram="editInstagram"
          :editAvatar="editAvatar"
          :presetAvatars="presetAvatars"
          @update:editName="editName = $event"
          @update:editQuote="editQuote = $event"
          @update:editHobby="editHobby = $event"
          @update:editEducation="editEducation = $event"
          @update:editInstagram="editInstagram = $event"
          @update:editAvatar="editAvatar = $event"
          @save="handleUpdateProfile"
        />
      </div>
    </main>

    <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleImageUpload">

    <div v-if="editingPost" class="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div class="bg-slate-900 border border-slate-800 rounded-[2.5rem] w-full max-w-xl overflow-hidden relative shadow-2xl animate-in zoom-in-95 duration-300">
        <div class="p-6 border-b border-slate-850 flex justify-between items-center bg-slate-900/60">
          <h3 class="text-sm font-black uppercase tracking-wider text-white">Detail & Edit Kiriman</h3>
          <button @click="editingPost = null" class="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-750 flex items-center justify-center text-slate-300 hover:text-white font-bold cursor-pointer text-xs">✕</button>
        </div>
        <div class="p-6 space-y-6">
          <div class="aspect-video rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
            <img :src="editingPost.image" class="w-full h-full object-cover">
          </div>
          <div class="space-y-1.5">
            <label class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Keterangan Kiriman (Caption)</label>
            <textarea v-model="editingCaptionText" rows="3" class="w-full px-4 py-3.5 bg-slate-950 border border-slate-850 rounded-2xl text-xs font-bold text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"></textarea>
          </div>
          <div class="grid grid-cols-2 gap-4">
            <button @click="confirmDeletePost(editingPost)" class="py-3.5 bg-rose-600/10 border border-rose-500/20 hover:bg-rose-600 text-rose-400 hover:text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer">🗑️ Hapus Kiriman</button>
            <button @click="saveEditedPost" class="py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer">💾 Simpan Perubahan</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="viewingMember" class="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div class="bg-slate-900 border border-slate-800 rounded-[2.5rem] w-full max-w-md overflow-hidden relative shadow-2xl animate-in zoom-in-95 duration-300">
        <div class="p-6 border-b border-slate-850 flex justify-between items-center bg-slate-900/60">
          <h3 class="text-sm font-black uppercase tracking-wider text-white">Profil Pengurus</h3>
          <button @click="closeMemberView" class="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-750 flex items-center justify-center text-slate-300 hover:text-white font-bold cursor-pointer text-xs">✕</button>
        </div>
        <div class="p-8 text-center space-y-6">
          <div class="w-24 h-24 rounded-full p-1 bg-linear-to-tr from-emerald-500 to-teal-500 mx-auto shadow-xl">
            <div class="w-full h-full rounded-full border-4 border-slate-900 overflow-hidden bg-slate-950">
              <img :src="viewingMember.image || viewingMember.avatar" class="w-full h-full object-cover">
            </div>
          </div>
          <div class="space-y-1">
            <h4 class="text-lg font-black text-white leading-none">{{ viewingMember.name || viewingMember.nickname }}</h4>
            <span class="text-[9px] font-black text-emerald-500 uppercase tracking-widest inline-block mt-1">{{ viewingMember.title || viewingMember.role || 'Anggota FORMULA' }}</span>
          </div>

          <div v-if="currentUser && viewingMember.email !== currentUser.email" class="pt-2">
            <button 
              @click="handleFollowToggle(viewingMember.email)"
              :class="['w-full py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all cursor-pointer', 
                (currentUser.following || []).includes(viewingMember.email) 
                  ? 'bg-slate-800 text-slate-300 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/30 border border-slate-700' 
                  : ((viewingMember.following || []).includes(currentUser.email) 
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                      : 'bg-emerald-600 text-white hover:bg-emerald-700')
              ]"
            >
              {{ 
                (currentUser.following || []).includes(viewingMember.email) 
                  ? 'Mengikuti' 
                  : ((viewingMember.following || []).includes(currentUser.email) ? 'Ikuti Balik' : 'Ikuti') 
              }}
            </button>
          </div>

          <p class="text-xs text-slate-400 italic max-w-sm mx-auto leading-relaxed">"{{ viewingMember.quote || 'Bersama FORMULA, berkontribusi aktif melahirkan kegunaan konkret bagi dusun tercinta.' }}"</p>
          <div class="grid grid-cols-2 gap-3 pt-2 font-bold text-[10px] uppercase tracking-wider text-slate-500 text-left border-t border-slate-850">
            <div class="space-y-1 bg-slate-950/50 p-3.5 rounded-xl border border-slate-850">
              <span class="text-[8px] font-black text-slate-600 block mb-0.5">🎓 PENDIDIKAN</span>
              <span class="text-slate-300">{{ viewingMember.education || 'S1 Pendidikan' }}</span>
            </div>
            <div class="space-y-1 bg-slate-950/50 p-3.5 rounded-xl border border-slate-850">
              <span class="text-[8px] font-black text-slate-600 block mb-0.5">🏆 HOBI & MINAT</span>
              <span class="text-slate-300">{{ viewingMember.hobby || 'Organisasi' }}</span>
            </div>
            <div class="col-span-2 space-y-1 bg-slate-950/50 p-3.5 rounded-xl border border-slate-850 text-center">
              <span class="text-[8px] font-black text-slate-600 block mb-0.5">📱 SOSIAL MEDIA</span>
              <a href="#" class="text-emerald-400 font-black hover:underline tracking-widest text-xs inline-block">{{ viewingMember.instagram || '@formula_ngampon' }}</a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showNotifications" class="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex items-start justify-center p-4 pt-20 z-50 animate-in fade-in duration-200">
      <div class="bg-slate-900 border border-slate-800 rounded-[2rem] w-full max-w-md overflow-hidden relative shadow-2xl animate-in slide-in-from-top-4 duration-300">
        <div class="p-5 border-b border-slate-850 flex justify-between items-center bg-slate-900/60">
          <div class="flex items-center gap-2">
            <span class="text-lg">❤️</span>
            <h3 class="text-sm font-black uppercase tracking-wider text-white">Notifikasi</h3>
          </div>
          <button @click="showNotifications = false" class="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-750 flex items-center justify-center text-slate-300 hover:text-white font-bold cursor-pointer text-xs">✕</button>
        </div>
        <div class="p-2 max-h-[60vh] overflow-y-auto">
          <div v-if="!currentUser?.notifications || currentUser.notifications.length === 0" class="p-8 text-center text-slate-500 text-xs">
            Belum ada notifikasi baru.
          </div>
          <div v-else class="divide-y divide-slate-800/40">
            <div v-for="notif in currentUser.notifications" :key="notif.id" class="p-4 flex items-center gap-4 hover:bg-slate-800/20 transition-colors">
              <div @click="viewMemberProfile(getNotificationUser(notif.fromEmail)); showNotifications = false" class="w-10 h-10 rounded-full border border-slate-700 overflow-hidden cursor-pointer flex-shrink-0">
                <img :src="getNotificationUser(notif.fromEmail)?.avatar" class="w-full h-full object-cover">
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-xs text-slate-300 leading-snug">
                  <span class="font-bold text-white cursor-pointer hover:underline" @click="viewMemberProfile(getNotificationUser(notif.fromEmail)); showNotifications = false">
                    {{ getNotificationUser(notif.fromEmail)?.name || 'Seseorang' }}
                  </span> 
                  mulai mengikuti Anda.
                </p>
                <p class="text-[9px] text-slate-500 mt-1 uppercase tracking-widest">{{ notif.time }}</p>
              </div>
              <div v-if="notif.type === 'follow' && !(currentUser.following || []).includes(notif.fromEmail)">
                <button @click="handleFollowToggle(notif.fromEmail)" class="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer transition-colors whitespace-nowrap">
                  Follback
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <CreateStoryModal
      :show="showCreateStoryModal"
      :newStoryImage="newStoryImage"
      :newStoryCaption="newStoryCaption"
      :presetImages="presetImages"
      :storySourceMode="storySourceMode"
      :isCameraActive="isCameraActive"
      @close="closeCreateStory"
      @publish="publishMyStory"
      @update:newStoryImage="newStoryImage = $event"
      @update:newStoryCaption="newStoryCaption = $event"
      @setMode="setSourceMode"
      @toggleCamera="toggleFacingMode"
      @capturePhoto="capturePhoto"
      @uploadFile="handleStoryImageUpload"
    />

    <StoryViewer
      :activeStory="activeStory"
      :activeSlideIndex="activeSlideIndex"
      :storyProgress="storyProgress"
      :stories="stories"
      @close="closeStoryViewer"
      @next="nextSlide"
      @prev="prevSlide"
      @reply="replyToStory"
      @viewProfile="viewMemberProfile"
    />

    <transition name="toast-anim">
      <div v-if="showToast" class="fixed bottom-20 md:bottom-8 right-4 left-4 sm:left-auto sm:right-8 z-50 px-6 py-4 bg-emerald-600 border border-emerald-500/20 text-white rounded-2xl shadow-2xl flex items-center justify-between gap-4 font-black text-xs uppercase tracking-widest">
        <div class="flex items-center gap-3">
          <span class="flex h-2 w-2 rounded-full bg-white animate-pulse"></span>
          <span>{{ toastMsg }}</span>
        </div>
        <button @click="showToast = false" class="text-white hover:text-emerald-200 transition-colors text-[9px] font-bold">✕</button>
      </div>
    </transition>
  </div>
</template>
