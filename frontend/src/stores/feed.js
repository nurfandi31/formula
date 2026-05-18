import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useAuthStore } from './auth'

export const useFeedStore = defineStore('feed', () => {
  const defaultPosts = [
    {
      id: 1,
      user: 'Fandi Ahmad',
      role: 'Ketua Umum',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=admin',
      image: '/formula_youth_landing_hero_1777344117635.png',
      caption: 'Semangat muda Ngampon! Rapat persiapan kegiatan Ramadhan tahun ini berjalan lancar. Siapkan ide terbaik kalian! ✨ #RamadhanDiNgampon #MudaBerprestasi',
      likes: 120,
      hasLiked: false,
      commentsList: [
        { user: 'Aditya', text: 'Keren banget, Kak Fandi! Semangat!' },
        { user: 'Rina', text: 'Mantap, siap mendukung kegiatan Ramadhan!' }
      ],
      showComments: false,
      newCommentText: '',
      time: '2 jam yang lalu'
    },
    {
      id: 2,
      user: 'Aditya Pratama',
      role: 'Sekretaris I',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aditya',
      image: '/ngampon_village_vibes_1777344139732.png',
      caption: 'Keseruan kegiatan akhir pekan lalu di Bakti Sosial Dusun Ngampon. Bangga bisa berkontribusi langsung untuk warga! 🚀 #NgamponCerdas #FormulaBeraksi',
      likes: 85,
      hasLiked: false,
      commentsList: [
        { user: 'Rina', text: 'Alhamdulillah sangat bermanfaat bagi sesama.' },
        { user: 'Fandi', text: 'Maju terus pemuda Ngampon!' }
      ],
      showComments: false,
      newCommentText: '',
      time: '5 jam yang lalu'
    }
  ]

  const defaultStories = [
    { 
      id: 1, 
      name: 'Fandi', 
      image: 'https://api.dicebear.com/7.x/bottts/svg?seed=admin',
      slides: [
        { id: 101, image: '/formula_youth_landing_hero_1777344117635.png', caption: 'Persiapan baksos pemuda dusun Ngampon pagi ini! 🧹🌿 #SinergiMuda' },
        { id: 102, image: '/ngampon_village_vibes_1777344139732.png', caption: 'Ayo mampir, kopi hangat sudah siap di balai dusun! ☕ #GuyubRukun' }
      ]
    },
    { 
      id: 2, 
      name: 'Aditya', 
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aditya',
      slides: [
        { id: 201, image: '/ngampon_village_vibes_1777344139732.png', caption: 'Mengerjakan proposal kegiatan baksos akhir tahun 💻✨ #TertibAdministrasi' }
      ]
    },
    { 
      id: 3, 
      name: 'Rina', 
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rina',
      slides: [
        { id: 301, image: '/formula_youth_landing_hero_1777344117635.png', caption: 'Pendaftaran turnamen futsal antar RT resmi dibuka! ⚽🏆 #MudaSehat' }
      ]
    }
  ]

  const defaultMessages = {
    'adit@formula.org': [
      { id: 1, sender: 'them', text: 'Halo! Ada koordinasi rapat nanti malam jam 19.30 di balai dusun ya. 👍', time: '10:14' },
      { id: 2, sender: 'me', text: 'Siap Adit! Saya akan datang tepat waktu.', time: '10:15' }
    ],
    'rina@formula.org': [
      { id: 1, sender: 'them', text: 'Format laporan kas bulanan sudah saya kirim ke email ya.', time: 'Kemarin' },
      { id: 2, sender: 'me', text: 'Oke baik Mbak Rina, akan segera saya rekap.', time: 'Kemarin' }
    ]
  }

  const posts = ref(JSON.parse(localStorage.getItem('formula_posts')) || defaultPosts)
  const stories = ref(JSON.parse(localStorage.getItem('formula_stories')) || defaultStories)
  const messages = ref(JSON.parse(localStorage.getItem('formula_messages')) || defaultMessages)

  watch(posts, (val) => {
    localStorage.setItem('formula_posts', JSON.stringify(val))
  }, { deep: true })

  watch(stories, (val) => {
    localStorage.setItem('formula_stories', JSON.stringify(val))
  }, { deep: true })

  watch(messages, (val) => {
    localStorage.setItem('formula_messages', JSON.stringify(val))
  }, { deep: true })

  const addPost = (caption, image) => {
    const authStore = useAuthStore()
    if (!authStore.currentUser) return { success: false, message: 'Sesi habis. Silakan login kembali.' }

    const newPost = {
      id: Date.now(),
      user: authStore.currentUser.name,
      role: authStore.currentUser.title,
      avatar: authStore.currentUser.avatar,
      image: image || '/formula_youth_landing_hero_1777344117635.png',
      caption,
      likes: 0,
      hasLiked: false,
      commentsList: [],
      showComments: false,
      newCommentText: '',
      time: 'Baru saja'
    }

    posts.value.unshift(newPost)
    return { success: true, post: newPost }
  }

  const updatePost = (id, newCaption) => {
    const post = posts.value.find(p => p.id === id)
    if (post) {
      post.caption = newCaption
      return { success: true }
    }
    return { success: false, message: 'Kiriman tidak ditemukan.' }
  }

  const deletePost = (id) => {
    const index = posts.value.findIndex(p => p.id === id)
    if (index !== -1) {
      posts.value.splice(index, 1)
      return { success: true }
    }
    return { success: false, message: 'Kiriman tidak ditemukan.' }
  }

  const sendDirectMessage = (recipientEmail, text) => {
    const authStore = useAuthStore()
    if (!authStore.currentUser) return { success: false, message: 'Harus login terlebih dahulu.' }
    const emailKey = recipientEmail.toLowerCase().trim()
    if (!messages.value[emailKey]) {
      messages.value[emailKey] = []
    }
    const now = new Date()
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
    messages.value[emailKey].push({
      id: Date.now(),
      sender: 'me',
      text: text.trim(),
      time: timeStr
    })
    return { success: true }
  }

  return {
    posts,
    stories,
    messages,
    addPost,
    updatePost,
    deletePost,
    sendDirectMessage
  }
})
