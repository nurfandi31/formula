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
      caption: 'Alhamdulillah rapat koordinasi kepengurusan FORMULA Generasi 18 berjalan lancar dan penuh semangat! Kita bahas program kerja Ramadhan, bakti sosial, dan digitalisasi dusun. Semangat terus pemuda Ngampon! 🌿',
      likes: 47,
      hasLiked: false,
      commentsList: [
        { user: 'Aditya Pratama', text: 'Siap ketua! Kita gaspol bareng 💪' },
        { user: 'Rina Amalia', text: 'Semangat FORMULA! Generasi 18 terbaik 🌟' }
      ],
      showComments: false,
      newCommentText: '',
      time: '2 jam lalu'
    },
    {
      id: 2,
      user: 'Aditya Pratama',
      role: 'Sekretaris I',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aditya',
      image: '/ngampon_village_vibes_1777344139732.png',
      caption: 'Pagi yang indah di Dusun Ngampon 🌅 Udara segar, tetangga ramah, dan semangat gotong royong yang tak pernah pudar. Ini yang bikin kita bangga jadi bagian dari FORMULA Ngampon!',
      likes: 32,
      hasLiked: false,
      commentsList: [
        { user: 'Fandi Ahmad', text: 'Indah banget desanya, masya Allah!' }
      ],
      showComments: false,
      newCommentText: '',
      time: '5 jam lalu'
    }
  ]

  const defaultStories = [
    { id: 1, name: 'Fandi', image: 'https://api.dicebear.com/7.x/bottts/svg?seed=admin' },
    { id: 2, name: 'Aditya', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aditya' },
    { id: 3, name: 'Rina', image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rina' }
  ]

  const defaultMessages = {}

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
