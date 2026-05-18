import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useAuthStore } from './auth'

export const useFeedStore = defineStore('feed', () => {
  const defaultPosts = [
    {
      id: 1,
      user: 'Ahmad Fauzi',
      role: 'Ketua FORMULA',
      avatar: '/member_portrait_1_1777344189794.png',
      image: '/formula_youth_landing_hero_1777344117635.png',
      caption: 'Semangat muda Ngampon! Rapat persiapan kegiatan Ramadhan tahun ini berjalan lancar. Siapkan ide terbaik kalian! ✨ #RamadhanDiNgampon #MudaBerprestasi',
      likes: 1200,
      hasLiked: false,
      commentsList: [
        { user: 'Budi', text: 'Keren banget kak, semangat!' },
        { user: 'Sari', text: 'Mantap, nggak sabar ikutan kegiatan Ramadhan' }
      ],
      showComments: false,
      newCommentText: '',
      time: '2 jam yang lalu'
    },
    {
      id: 2,
      user: 'Siti Aminah',
      role: 'Sekretaris',
      avatar: '/member_portrait_2_1777344210087.png',
      image: '/ngampon_village_vibes_1777344139732.png',
      caption: 'Keseruan kegiatan akhir pekan lalu di Bakti Sosial Dusun Ngampon. Bangga bisa berkontribusi langsung untuk warga! 🚀 #NgamponCerdas #FormulaBeraksi',
      likes: 856,
      hasLiked: false,
      commentsList: [
        { user: 'Andi', text: 'Alhamdulillah bermanfaat bagi sesama' },
        { user: 'Pratama', text: 'Maju terus pemuda Ngampon!' }
      ],
      showComments: false,
      newCommentText: '',
      time: '5 jam yang lalu'
    }
  ]

  const defaultStories = [
    { 
      id: 1, 
      name: 'Ahmad', 
      image: '/member_portrait_1_1777344189794.png',
      slides: [
        { id: 101, image: '/formula_youth_landing_hero_1777344117635.png', caption: 'Persiapan baksos pemuda dusun Ngampon pagi ini! 🧹🌿 #SinergiMuda' },
        { id: 102, image: '/ngampon_village_vibes_1777344139732.png', caption: 'Ayo mampir, kopi hangat sudah siap di balai dusun! ☕ #GuyubRukun' }
      ]
    },
    { 
      id: 2, 
      name: 'Siti', 
      image: '/member_portrait_2_1777344210087.png',
      slides: [
        { id: 201, image: '/ngampon_village_vibes_1777344139732.png', caption: 'Mengerjakan proposal kegiatan baksos akhir tahun 💻✨ #TertibAdministrasi' }
      ]
    },
    { 
      id: 3, 
      name: 'Andi', 
      image: '/member_portrait_3_1777354146065.png',
      slides: [
        { id: 301, image: '/formula_youth_landing_hero_1777344117635.png', caption: 'Pendaftaran turnamen futsal antar RT resmi dibuka! ⚽🏆 #MudaSehat' }
      ]
    },
    { 
      id: 4, 
      name: 'Laila', 
      image: '/member_portrait_4_1777354168316.png',
      slides: [
        { id: 401, image: '/ngampon_village_vibes_1777344139732.png', caption: 'Indahnya sore di Dusun Ngampon, damai tentram! 🌅🏡 #NgamponHarmonis' }
      ]
    },
    { 
      id: 5, 
      name: 'Rizky', 
      image: '/member_portrait_1_1777344189794.png',
      slides: [
        { id: 501, image: '/formula_youth_landing_hero_1777344117635.png', caption: 'Dokumentasi rapat koordinasi pengurus semalam. Mantap! 📝🚀' }
      ]
    },
    { 
      id: 6, 
      name: 'Fauzi', 
      image: '/member_portrait_3_1777354146065.png',
      slides: [
        { id: 601, image: '/ngampon_village_vibes_1777344139732.png', caption: 'Pagi hari yang cerah di Ngampon, siap beraktivitas! ☀️🌿' }
      ]
    },
    { 
      id: 7, 
      name: 'Aminah', 
      image: '/member_portrait_2_1777344210087.png',
      slides: [
        { id: 701, image: '/formula_youth_landing_hero_1777344117635.png', caption: 'Belajar desain publikasi media sosial FORMULA 🎨📱' }
      ]
    },
    { 
      id: 8, 
      name: 'Budi', 
      image: '/member_portrait_1_1777344189794.png',
      slides: [
        { id: 801, image: '/ngampon_village_vibes_1777344139732.png', caption: 'Kondisi kebersihan lingkungan pos ronda aman terkendali! 🧹👮' }
      ]
    },
    { 
      id: 9, 
      name: 'Sari', 
      image: '/member_portrait_4_1777354168316.png',
      slides: [
        { id: 901, image: '/formula_youth_landing_hero_1777344117635.png', caption: 'Yuk kumpul di warung kopi dusun, diskusi santai! ☕💬' }
      ]
    }
  ]

  const defaultMessages = {
    'ahmad@formula.org': [
      { id: 1, sender: 'them', text: 'Halo! Ada koordinasi rapat nanti malam jam 19.30 di balai dusun ya. 👍', time: '10:14' },
      { id: 2, sender: 'me', text: 'Siap Kak Ahmad! Saya akan datang tepat waktu.', time: '10:15' }
    ],
    'siti@formula.org': [
      { id: 1, sender: 'them', text: 'Format laporan kas bulanan sudah saya kirim ke email ya.', time: 'Kemarin' },
      { id: 2, sender: 'me', text: 'Oke baik Mbak Siti, akan segera saya rekap.', time: 'Kemarin' }
    ],
    'andi@formula.org': [
      { id: 1, sender: 'them', text: 'Bro, nanti sore jadi futsal kan? Sepatu jangan lupa dibawa.', time: '11:20' }
    ],
    'laila@formula.org': [
      { id: 1, sender: 'them', text: 'Desain pamflet baksos besok lusa sudah disetujui ya.', time: '13:02' }
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
