import { createRouter, createWebHistory } from 'vue-router'
import LandingView from '../views/landing/LandingView.vue'
import LoginView from '../views/auth/LoginView.vue'
import RegisterView from '../views/auth/RegisterView.vue'
import AnggotaDashboardView from '../views/anggota/DashboardView.vue'
import { useSocialStore } from '../stores/social'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: LandingView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('../views/admin/DashboardView.vue'),
      meta: { requiresAuth: true, role: 'admin' }
    },
    {
      path: '/admin/basis-data/registrasi',
      name: 'admin-registrasi-anggota',
      component: () => import('../views/admin/RegistrasiAnggotaView.vue'),
      meta: { requiresAuth: true, role: 'admin' }
    },
    {
      path: '/admin/basis-data/daftar',
      name: 'admin-daftar-anggota',
      component: () => import('../views/admin/DaftarAnggotaView.vue'),
      meta: { requiresAuth: true, role: 'admin' }
    },
    {
      path: '/admin/keuangan',
      name: 'admin-keuangan',
      component: () => import('../views/admin/FinancialsView.vue'),
      meta: { requiresAuth: true, role: 'admin' }
    },
    {
      path: '/admin/kegiatan',
      name: 'admin-kegiatan',
      component: () => import('../views/admin/ActivitiesView.vue'),
      meta: { requiresAuth: true, role: 'admin' }
    },
    {
      path: '/admin/absensi',
      name: 'admin-absensi',
      component: () => import('../views/admin/AttendanceView.vue'),
      meta: { requiresAuth: true, role: 'admin' }
    },
    {
      path: '/admin/anggota',
      name: 'admin-anggota',
      component: () => import('../views/admin/MembersManagementView.vue'),
      meta: { requiresAuth: true, role: 'admin' }
    },
    {
      path: '/admin/landing',
      name: 'admin-landing',
      component: () => import('../views/admin/LandingPageManagerView.vue'),
      meta: { requiresAuth: true, role: 'admin' }
    },
    {
      path: '/admin/profil',
      name: 'admin-profil',
      component: () => import('../views/admin/ProfileView.vue'),
      meta: { requiresAuth: true, role: 'admin' }
    },
    {
      path: '/admin/akses-login',
      name: 'admin-akses-login',
      component: () => import('../views/admin/LoginAccessView.vue'),
      meta: { requiresAuth: true, role: 'admin' }
    },
    {
      path: '/anggota',
      name: 'anggota-dashboard',
      component: AnggotaDashboardView,
      meta: { requiresAuth: true, role: 'anggota' }
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const store = useSocialStore()
    if (!store.currentUser) {
      next({ name: 'login' })
    } else if (to.meta.role) {
      const userRole = store.currentUser.role
      const targetRole = to.meta.role
      const isAdminLike = ['admin', 'bendahara', 'sekertaris'].includes(userRole)

      if (targetRole === 'admin' && !isAdminLike) {
        next({ name: 'anggota-dashboard' })
      } else if (targetRole === 'anggota' && isAdminLike) {
        next({ name: 'admin' })
      } else {
        next()
      }
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router

