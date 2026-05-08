import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useSocialStore = defineStore('social', () => {
  // Predefined profiles and credentials
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

  // Initial Posts (adapted from SosialSection)
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

  // Initial Stories with multiple slide images and text
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

  // Direct Messages state
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

  const defaultKasData = {
    saldo: 2450000,
    pemasukan: 3500000,
    pengeluaran: 1050000,
    riwayat: [
      { label: 'Konsumsi Rapat Rutin', nominal: 150000, tanggal: '03 Mei 2025', icon: '🍱' },
      { label: 'Pembelian Atribut Organisasi', nominal: 400000, tanggal: '28 Apr 2025', icon: '👕' },
      { label: 'Sewa Lapangan Futsal', nominal: 200000, tanggal: '25 Apr 2025', icon: '⚽' },
      { label: 'Santunan Warga Sakit', nominal: 300000, tanggal: '20 Apr 2025', icon: '❤️' }
    ]
  }

  const defaultHasilRapat = [
    {
      id: 1,
      judul: 'Rencana Kerja & Pembagian Divisi Humas',
      tanggal: '04 Mei',
      peserta: 18,
      keputusan: [
        'Penyusunan jadwal kegiatan bulanan bakti sosial.',
        'Pembagian penanggung jawab dokumentasi & sosial media.',
        'Penetapan iuran wajib anggota disepakati Rp 10.000 per iuran.'
      ]
    },
    {
      id: 2,
      judul: 'Persiapan Pengadaan Kas & Atribut Anggota',
      tanggal: '27 Apr',
      peserta: 15,
      keputusan: [
        'Pemesanan kaos seragam FORMULA disepakati warna hijau botol.',
        'Pendataan ukuran baju wajib diselesaikan maksimal tanggal 10 Mei.',
        'Alokasi anggaran kas awal disetujui sebesar Rp 500.000.'
      ]
    }
  ]

  const defaultAgendaKegiatan = [
    { id: 1, judul: 'Bakti Sosial & Kerja Bakti Dusun Ngampon', tanggal: 'Sabtu, 10 Mei 2025', jam: '07:30 - Selesai', lokasi: 'Balai Dusun Ngampon', kategori: 'Sosial', warna: 'emerald' },
    { id: 2, judul: 'Rapat Rutin Pengurus Harian FORMULA', tanggal: 'Minggu, 11 Mei 2025', jam: '19:30 - Selesai', lokasi: 'Rumah Ketua Fauzi', kategori: 'Rapat', warna: 'teal' },
    { id: 3, judul: 'Latihan Futsal Bersama Antar RT Dusun', tanggal: 'Selasa, 13 Mei 2025', jam: '16:00 - 18:00', lokasi: 'Ngampon Sport Center', kategori: 'Olahraga', warna: 'emerald' }
  ]

  const defaultAbsensi = {
    'Rapat Kerja 04 Mei': {
      'ahmad@formula.org': 'Hadir',
      'siti@formula.org': 'Hadir',
      'andi@formula.org': 'Izin',
      'laila@formula.org': 'Hadir'
    }
  }

  const defaultLandingConfig = {
    heroTitle: 'Wadah Sinergi & Pengabdian Pemuda Ngampon',
    heroSubtitle: 'Bersama FORMULA, berkontribusi aktif melahirkan kegunaan konkret bagi dusun tercinta.',
    sejarah: 'FORMULA (Forum Pemuda Pemudi Ngampon) didirikan sebagai wadah sinergi aksi nyata pemuda...'
  }

  const users = ref(JSON.parse(localStorage.getItem('formula_users')) || defaultUsers)
  const posts = ref(JSON.parse(localStorage.getItem('formula_posts')) || defaultPosts)
  const stories = ref(JSON.parse(localStorage.getItem('formula_stories')) || defaultStories)
  const currentUser = ref(JSON.parse(localStorage.getItem('formula_current_user')) || null)
  const messages = ref(JSON.parse(localStorage.getItem('formula_messages')) || defaultMessages)
  const kasData = ref(JSON.parse(localStorage.getItem('formula_kas_data')) || defaultKasData)
  const hasilRapat = ref(JSON.parse(localStorage.getItem('formula_hasil_rapat')) || defaultHasilRapat)
  const agendaKegiatan = ref(JSON.parse(localStorage.getItem('formula_agenda_kegiatan')) || defaultAgendaKegiatan)
  const absensi = ref(JSON.parse(localStorage.getItem('formula_absensi')) || defaultAbsensi)
  const landingConfig = ref(JSON.parse(localStorage.getItem('formula_landing_config')) || defaultLandingConfig)

  // Watchers to persist state
  watch(users, (val) => {
    localStorage.setItem('formula_users', JSON.stringify(val))
  }, { deep: true })

  watch(posts, (val) => {
    localStorage.setItem('formula_posts', JSON.stringify(val))
  }, { deep: true })

  watch(stories, (val) => {
    localStorage.setItem('formula_stories', JSON.stringify(val))
  }, { deep: true })

  watch(currentUser, (val) => {
    localStorage.setItem('formula_current_user', JSON.stringify(val))
  }, { deep: true })

  watch(messages, (val) => {
    localStorage.setItem('formula_messages', JSON.stringify(val))
  }, { deep: true })

  watch(kasData, (val) => {
    localStorage.setItem('formula_kas_data', JSON.stringify(val))
  }, { deep: true })

  watch(hasilRapat, (val) => {
    localStorage.setItem('formula_hasil_rapat', JSON.stringify(val))
  }, { deep: true })

  watch(agendaKegiatan, (val) => {
    localStorage.setItem('formula_agenda_kegiatan', JSON.stringify(val))
  }, { deep: true })

  watch(absensi, (val) => {
    localStorage.setItem('formula_absensi', JSON.stringify(val))
  }, { deep: true })

  watch(landingConfig, (val) => {
    localStorage.setItem('formula_landing_config', JSON.stringify(val))
  }, { deep: true })

  // Actions
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

    // Add to stories
    if (!stories.value.some(s => s.name.toLowerCase() === nickname.toLowerCase())) {
      stories.value.unshift({
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

  const addPost = (caption, image) => {
    if (!currentUser.value) return { success: false, message: 'Sesi habis. Silakan login kembali.' }

    const newPost = {
      id: Date.now(),
      user: currentUser.value.name,
      role: currentUser.value.title,
      avatar: currentUser.value.avatar,
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

  const updateProfile = (profileData) => {
    if (!currentUser.value) return { success: false }

    const email = currentUser.value.email
    const user = users.value[email]
    if (user) {
      Object.assign(user, profileData)
      currentUser.value = { ...user }

      // Propagate changes to user's posts
      posts.value.forEach(p => {
        if (p.user === user.name || p.avatar === user.avatar || p.role === user.title) {
          p.user = user.name
          p.role = user.title
          p.avatar = user.avatar
        }
      })

      // Propagate nickname/avatar to stories list
      const storyIndex = stories.value.findIndex(s => s.name.toLowerCase() === user.nickname.toLowerCase() || s.name === user.nickname)
      if (storyIndex !== -1) {
        stories.value[storyIndex].name = user.nickname
        stories.value[storyIndex].image = user.avatar
      }

      return { success: true }
    }
    return { success: false }
  }

  const sendDirectMessage = (recipientEmail, text) => {
    if (!currentUser.value) return { success: false, message: 'Harus login terlebih dahulu.' }
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

  const fetchLandingConfig = async () => {
    try {
      const res = await fetch(`${API_BASE}/landing`)
      if (res.ok) {
        const data = await res.json()
        landingConfig.value.heroTitle = data.hero_title
        landingConfig.value.heroSubtitle = data.hero_subtitle
        landingConfig.value.sejarah = data.sejarah
      }
    } catch (e) {}
  }

  const saveLandingConfig = async (heroTitle, heroSubtitle, sejarah) => {
    try {
      const res = await fetch(`${API_BASE}/landing`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hero_title: heroTitle, hero_subtitle: heroSubtitle, sejarah })
      })
      if (res.ok) {
        await fetchLandingConfig()
        return { success: true }
      }
    } catch (e) {}
    return { success: false }
  }

  const fetchKasData = async () => {
    try {
      const res = await fetch(`${API_BASE}/kas`)
      if (res.ok) {
        const data = await res.json()
        kasData.value.pemasukan = Number(data.pemasukan)
        kasData.value.pengeluaran = Number(data.pengeluaran)
        kasData.value.saldo = Number(data.saldo)
        kasData.value.riwayat = data.riwayat.map(item => ({
          id: item.id,
          label: item.label,
          nominal: Number(item.nominal),
          type: item.type,
          icon: item.icon,
          tanggal: item.tanggal
        }))
      }
    } catch (e) {}
  }

  const addKasTransaction = async (label, nominal, type, icon, tanggal) => {
    try {
      const res = await fetch(`${API_BASE}/kas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ label, nominal, type, icon, tanggal })
      })
      if (res.ok) {
        await fetchKasData()
        return { success: true }
      }
    } catch (e) {}
    return { success: false }
  }

  const deleteKasTransaction = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/kas/${id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        await fetchKasData()
        return { success: true }
      }
    } catch (e) {}
    return { success: false }
  }

  const fetchActivities = async () => {
    try {
      const res = await fetch(`${API_BASE}/activities`)
      if (res.ok) {
        const data = await res.json()
        hasilRapat.value = data.filter(a => a.type === 'rapat').map(a => ({
          id: a.id,
          judul: a.title,
          tanggal: a.date,
          keputusan: a.decisions || []
        }))
        agendaKegiatan.value = data.filter(a => a.type === 'agenda').map(a => ({
          id: a.id,
          judul: a.title,
          tanggal: a.date,
          jam: '08:00 - Selesai',
          lokasi: 'Balai Dusun Ngampon',
          kategori: 'Umum',
          warna: 'emerald'
        }))
      }
    } catch (e) {}
  }

  const addActivity = async (title, date, type, decisions = null) => {
    try {
      const res = await fetch(`${API_BASE}/activities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, date, type, decisions })
      })
      if (res.ok) {
        await fetchActivities()
        return { success: true }
      }
    } catch (e) {}
    return { success: false }
  }

  const deleteActivity = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/activities/${id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        await fetchActivities()
        return { success: true }
      }
    } catch (e) {}
    return { success: false }
  }

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

  fetchLandingConfig()
  fetchKasData()
  fetchActivities()
  fetchMembers()

  return {
    users,
    posts,
    stories,
    currentUser,
    messages,
    kasData,
    hasilRapat,
    agendaKegiatan,
    absensi,
    landingConfig,
    login,
    register,
    logout,
    addPost,
    updatePost,
    deletePost,
    updateProfile,
    sendDirectMessage,
    toggleFollow,
    markNotificationsAsRead,
    fetchLandingConfig,
    saveLandingConfig,
    fetchKasData,
    addKasTransaction,
    deleteKasTransaction,
    fetchActivities,
    addActivity,
    deleteActivity,
    fetchMembers,
    addMember,
    updateMember,
    deleteMember
  }
})
