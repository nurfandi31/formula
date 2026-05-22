import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useFeedStore } from './feed'

export const useAuthStore = defineStore('auth', () => {
  const defaultUsers = {}

  const users = ref(defaultUsers)
  const currentUser = ref(JSON.parse(localStorage.getItem('formula_current_user')) || null)

  watch(currentUser, (val) => {
    localStorage.setItem('formula_current_user', JSON.stringify(val))
  }, { deep: true })

  const API_BASE = 'http://localhost:8000/api'

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      if (res.ok) {
        const data = await res.json()
        if (data.success) {
          const m = data.user
          const fetchedUser = {
            id: m.id,
            email: m.email,
            role: m.role,
            name: m.name,
            nickname: m.name.split(' ')[0],
            title: m.title || (m.role === 'admin' ? 'Ketua Umum' : 'Anggota FORMULA'),
            avatar: m.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + m.name,
            age: m.age || (m.role === 'admin' ? '25 Tahun' : '22 Tahun'),
            hobby: m.hobby || 'Organisasi',
            quote: m.quote || 'Bersama FORMULA, berkontribusi aktif.',
            education: m.education || 'Universitas Lokal',
            instagram: m.instagram || `@${m.name.split(' ')[0].toLowerCase()}_ngampon`,
            joinedSince: m.joined_since || '2024'
          }
          currentUser.value = fetchedUser
          users.value[fetchedUser.email.toLowerCase().trim()] = fetchedUser
          return { success: true, user: fetchedUser }
        }
      } else {
        const errData = await res.json().catch(() => ({}))
        return { success: false, message: errData.message || 'Alamat email atau kata sandi salah.' }
      }
    } catch (e) {
      return { success: false, message: 'Gagal menghubungi server. Silakan coba beberapa saat lagi.' }
    }
    return { success: false, message: 'Alamat email atau kata sandi salah.' }
  }

  const register = async (name, email, password) => {
    try {
      const res = await fetch(`${API_BASE}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          role: 'anggota',
          title: 'Anggota FORMULA'
        })
      })
      if (res.ok) {
        const data = await res.json()
        if (data.success) {
          await fetchMembers()
          const m = data.user
          const newUser = {
            id: m.id,
            email: m.email,
            role: m.role,
            name: m.name,
            nickname: m.name.split(' ')[0],
            title: m.title || 'Anggota FORMULA',
            avatar: m.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + m.name,
            age: '22 Tahun',
            hobby: 'Organisasi & Humas',
            quote: 'Bersama FORMULA, berkontribusi aktif melahirkan kegunaan konkret bagi dusun tercinta.',
            education: 'Universitas Lokal',
            instagram: `@${m.name.split(' ')[0].toLowerCase()}_ngampon`,
            joinedSince: new Date().getFullYear().toString()
          }
          currentUser.value = newUser
          users.value[newUser.email.toLowerCase().trim()] = newUser

          const feedStore = useFeedStore()
          if (!feedStore.stories.some(s => s.name.toLowerCase() === newUser.nickname.toLowerCase())) {
            feedStore.stories.unshift({
              id: Date.now(),
              name: newUser.nickname,
              image: newUser.avatar
            })
          }
          return { success: true, user: newUser }
        }
      } else {
        const errData = await res.json().catch(() => ({}))
        return { success: false, message: errData.message || 'Alamat email sudah terdaftar atau tidak valid.' }
      }
    } catch (e) {
      return { success: false, message: 'Gagal menghubungi server. Silakan coba lagi.' }
    }
    return { success: false, message: 'Gagal mendaftar.' }
  }

  const logout = async () => {
    try {
      await fetch(`${API_BASE}/logout`, { method: 'POST' })
    } catch (e) {}
    currentUser.value = null
    localStorage.removeItem('formula_current_user')
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

  const fetchMembers = async () => {
    try {
      const res = await fetch(`${API_BASE}/members`)
      if (res.ok) {
        const data = await res.json()
        const newUsers = {}
        data.forEach(m => {
          const emailKey = m.email.toLowerCase().trim()
          newUsers[emailKey] = {
            id: m.id,
            email: m.email,
            role: m.role,
            name: m.name,
            nickname: m.name.split(' ')[0],
            title: m.title || (m.role === 'admin' ? 'Ketua Umum' : 'Anggota FORMULA'),
            avatar: m.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + m.name,
            age: m.age || (m.role === 'admin' ? '25 Tahun' : '22 Tahun'),
            hobby: m.hobby || 'Organisasi',
            quote: m.quote || 'Bersama FORMULA, berkontribusi aktif.',
            education: m.education || 'Universitas Lokal',
            instagram: m.instagram || `@${m.name.split(' ')[0].toLowerCase()}_ngampon`,
            joinedSince: m.joined_since || '2024'
          }
        })
        users.value = newUsers
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
