import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useFeedStore } from './feed'

export const useAuthStore = defineStore('auth', () => {
  const defaultUsers = {
    'ahmad@formula.org': {
      email: 'ahmad@formula.org',
      role: 'anggota',
      name: 'Ahmad Fauzi',
      nickname: 'Ahmad',
      title: 'Ketua FORMULA',
      avatar: '/member_portrait_1_1777344189794.png',
      age: '23 Tahun',
      hobby: 'Bakti Sosial & Fotografi',
      quote: 'Maju terus pemuda dusun, aksi nyata lebih bernilai daripada sekadar wacana.',
      education: 'S1 Teknik Informatika',
      instagram: '@ahmadfauzi_ngampon',
      joinedSince: '2022'
    },
    'siti@formula.org': {
      email: 'siti@formula.org',
      role: 'anggota',
      name: 'Siti Aminah',
      nickname: 'Siti',
      title: 'Sekretaris',
      avatar: '/member_portrait_2_1777344210087.png',
      age: '21 Tahun',
      hobby: 'Membaca & Desain Grafis',
      quote: 'Setiap goresan tinta kepengurusan adalah bagian dari sejarah kebaikan dusun.',
      education: 'D3 Administrasi Perkantoran',
      instagram: '@sitiaminah_am',
      joinedSince: '2023'
    },
    'andi@formula.org': {
      email: 'andi@formula.org',
      role: 'anggota',
      name: 'Andi Pratama',
      nickname: 'Andi',
      title: 'Humas & Koordinator Olahraga',
      avatar: '/member_portrait_3_1777354146065.png',
      age: '22 Tahun',
      hobby: 'Futsal & Aransemen Musik',
      quote: 'Tubuh yang sehat melahirkan pemikiran yang cerdas dan tindakan yang tangguh.',
      education: 'S1 Pendidikan Jasmani',
      instagram: '@andipratama_real',
      joinedSince: '2022'
    },
    'laila@formula.org': {
      email: 'laila@formula.org',
      role: 'anggota',
      name: 'Laila Sari',
      nickname: 'Laila',
      title: 'Divisi Humas',
      avatar: '/member_portrait_4_1777354168316.png',
      age: '20 Tahun',
      hobby: 'Menulis & Public Speaking',
      quote: 'Menghubungkan hati, menyebarkan kebaikan, membangun kerukunan warga.',
      education: 'S1 Ilmu Komunikasi',
      instagram: '@lailasari_official',
      joinedSince: '2024'
    },
    'admin@gmail.com': {
      email: 'admin@gmail.com',
      role: 'admin',
      name: 'Administrator',
      nickname: 'Admin',
      title: 'Sistem Admin',
      avatar: '/member_portrait_3_1777354146065.png',
      age: '25 Tahun',
      hobby: 'System Management',
      quote: 'Keep the system clean and performant.',
      education: 'S1 Ilmu Komputer',
      instagram: '@formula_admin',
      joinedSince: '2021'
    }
  }

  const users = ref(JSON.parse(localStorage.getItem('formula_users')) || defaultUsers)
  const currentUser = ref(JSON.parse(localStorage.getItem('formula_current_user')) || null)

  watch(users, (val) => {
    localStorage.setItem('formula_users', JSON.stringify(val))
  }, { deep: true })

  watch(currentUser, (val) => {
    localStorage.setItem('formula_current_user', JSON.stringify(val))
  }, { deep: true })

  const login = (email, password) => {
    const user = users.value[email.toLowerCase().trim()]
    if (user) {
      if (password === 'password' || (user.role === 'admin' && (password === 'admin123' || password === 'adminpassword123'))) {
        currentUser.value = user
        return { success: true, user }
      }
    }
    return { success: false, message: 'Alamat email atau kata sandi salah.' }
  }

  const register = (name, email, password) => {
    const lowerEmail = email.toLowerCase().trim()
    if (users.value[lowerEmail]) {
      return { success: false, message: 'Alamat email sudah terdaftar.' }
    }

    const nickname = name.split(' ')[0]
    const newUser = {
      email: lowerEmail,
      role: 'anggota',
      name,
      nickname,
      title: 'Anggota FORMULA',
      avatar: '/member_portrait_1_1777344189794.png',
      age: '22 Tahun',
      hobby: 'Organisasi & Humas',
      quote: 'Bersama FORMULA, berkontribusi aktif melahirkan kegunaan konkret bagi dusun tercinta.',
      education: 'S1 Ilmu Komunikasi',
      instagram: `@${nickname.toLowerCase()}_ngampon`,
      joinedSince: new Date().getFullYear().toString()
    }

    users.value[lowerEmail] = newUser
    currentUser.value = newUser

    const feedStore = useFeedStore()
    if (!feedStore.stories.some(s => s.name.toLowerCase() === nickname.toLowerCase())) {
      feedStore.stories.unshift({
        id: Date.now(),
        name: nickname,
        image: newUser.avatar
      })
    }

    return { success: true, user: newUser }
  }

  const logout = () => {
    currentUser.value = null
  }

  const updateProfile = (profileData) => {
    if (!currentUser.value) return { success: false }

    const email = currentUser.value.email
    const user = users.value[email]
    if (user) {
      Object.assign(user, profileData)
      currentUser.value = { ...user }

      const feedStore = useFeedStore()
      feedStore.posts.forEach(p => {
        if (p.user === user.name || p.avatar === user.avatar || p.role === user.title) {
          p.user = user.name
          p.role = user.title
          p.avatar = user.avatar
        }
      })

      const storyIndex = feedStore.stories.findIndex(s => s.name.toLowerCase() === user.nickname.toLowerCase() || s.name === user.nickname)
      if (storyIndex !== -1) {
        feedStore.stories[storyIndex].name = user.nickname
        feedStore.stories[storyIndex].image = user.avatar
      }

      return { success: true }
    }
    return { success: false }
  }

  const toggleFollow = (targetEmail) => {
    if (!currentUser.value) return { success: false }
    const me = currentUser.value.email
    if (me === targetEmail) return { success: false }

    const meUser = users.value[me]
    const targetUser = users.value[targetEmail]
    if (!meUser || !targetUser) return { success: false }

    if (!meUser.following) meUser.following = []
    if (!targetUser.followers) targetUser.followers = []
    if (!targetUser.notifications) targetUser.notifications = []

    const isFollowing = meUser.following.includes(targetEmail)
    if (isFollowing) {
      meUser.following = meUser.following.filter(e => e !== targetEmail)
      targetUser.followers = targetUser.followers.filter(e => e !== me)
    } else {
      meUser.following.push(targetEmail)
      targetUser.followers.push(me)
      
      const now = new Date()
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
      targetUser.notifications.unshift({
        id: Date.now(),
        fromEmail: me,
        type: 'follow',
        read: false,
        time: timeStr
      })
    }
    currentUser.value = { ...meUser }
    return { success: true, isFollowing: !isFollowing }
  }

  const markNotificationsAsRead = () => {
    if (currentUser.value && users.value[currentUser.value.email.toLowerCase().trim()]) {
      const user = users.value[currentUser.value.email.toLowerCase().trim()]
      if (user.notifications) {
        user.notifications.forEach(n => n.read = true)
      }
      currentUser.value = { ...user }
    }
  }

  const API_BASE = 'http://localhost:8000/api'

  const fetchMembers = async () => {
    try {
      const res = await fetch(`${API_BASE}/members`)
      if (res.ok) {
        const data = await res.json()
        data.forEach(m => {
          users.value[m.email.toLowerCase().trim()] = {
            id: m.id,
            email: m.email,
            role: m.role,
            name: m.name,
            nickname: m.name.split(' ')[0],
            title: m.title || 'Anggota FORMULA',
            avatar: m.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + m.name
          }
        })
      }
    } catch (e) {}
  }

  const addMember = async (name, email, title, role = 'anggota') => {
    try {
      const res = await fetch(`${API_BASE}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password: 'password',
          role,
          title
        })
      })
      if (res.ok) {
        await fetchMembers()
        return { success: true }
      }
    } catch (e) {}
    return { success: false }
  }

  const updateMember = async (id, name, email, title, role = 'anggota') => {
    try {
      const res = await fetch(`${API_BASE}/members/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          title,
          role
        })
      })
      if (res.ok) {
        await fetchMembers()
        return { success: true }
      }
    } catch (e) {}
    return { success: false }
  }

  const deleteMember = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/members/${id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        await fetchMembers()
        return { success: true }
      }
    } catch (e) {}
    return { success: false }
  }

  return {
    users,
    currentUser,
    login,
    register,
    logout,
    updateProfile,
    toggleFollow,
    markNotificationsAsRead,
    fetchMembers,
    addMember,
    updateMember,
    deleteMember
  }
})
