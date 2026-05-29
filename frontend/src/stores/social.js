import { defineStore, storeToRefs } from 'pinia'
import { useAuthStore } from './auth'
import { useFeedStore } from './feed'
import { useFinancialsStore } from './financials'
import { useActivitiesStore } from './activities'
import { useAttendanceStore } from './attendance'
import { useLandingStore } from './landing'

export const useSocialStore = defineStore('social', () => {
  const authStore = useAuthStore()
  const feedStore = useFeedStore()
  const financialsStore = useFinancialsStore()
  const activitiesStore = useActivitiesStore()
  const attendanceStore = useAttendanceStore()
  const landingStore = useLandingStore()

  const { users, currentUser } = storeToRefs(authStore)
  const { posts, stories, messages } = storeToRefs(feedStore)
  const { kasData, yearlyReports } = storeToRefs(financialsStore)
  const { hasilRapat, agendaKegiatan } = storeToRefs(activitiesStore)
  const { absensi } = storeToRefs(attendanceStore)
  const {
    landingConfig,
    landingGallery,
    landingSections,
    landingFaqs,
    landingFeatures,
    landingNavbars,
    landingTestimonials,
    landingSettings,
    landingSocialLinks,
    landingStats,
    landingGenerations
  } = storeToRefs(landingStore)

  landingStore.fetchLandingConfig()
  financialsStore.fetchKasData()
  activitiesStore.fetchActivities()
  authStore.fetchMembers()

  return {
    users,
    posts,
    stories,
    currentUser,
    messages,
    kasData,
    yearlyReports,
    hasilRapat,
    agendaKegiatan,
    absensi,
    landingConfig,
    landingGallery,
    landingSections,
    landingFaqs,
    landingFeatures,
    landingNavbars,
    landingTestimonials,
    landingSettings,
    landingSocialLinks,
    landingStats,
    landingGenerations,
    login: authStore.login,
    register: authStore.register,
    logout: authStore.logout,
    addPost: feedStore.addPost,
    updatePost: feedStore.updatePost,
    deletePost: feedStore.deletePost,
    updateProfile: authStore.updateProfile,
    sendDirectMessage: feedStore.sendDirectMessage,
    toggleFollow: authStore.toggleFollow,
    markNotificationsAsRead: authStore.markNotificationsAsRead,
    fetchLandingConfig: landingStore.fetchLandingConfig,
    saveLandingConfig: landingStore.saveLandingConfig,
    fetchKasData: financialsStore.fetchKasData,
    fetchYearlyReports: financialsStore.fetchYearlyReports,
    addKasTransaction: financialsStore.addKasTransaction,
    deleteKasTransaction: financialsStore.deleteKasTransaction,
    fetchActivities: activitiesStore.fetchActivities,
    addActivity: activitiesStore.addActivity,
    deleteActivity: activitiesStore.deleteActivity,
    fetchMembers: authStore.fetchMembers,
    addMember: authStore.addMember,
    updateMember: authStore.updateMember,
    deleteMember: authStore.deleteMember,
    saveSection: landingStore.saveSection,
    saveSettings: landingStore.saveSettings,
    saveFeature: landingStore.saveFeature,
    deleteFeature: landingStore.deleteFeature,
    saveGallery: landingStore.saveGallery,
    deleteGallery: landingStore.deleteGallery,
    saveFaq: landingStore.saveFaq,
    deleteFaq: landingStore.deleteFaq,
    saveSocialLink: landingStore.saveSocialLink,
    deleteSocialLink: landingStore.deleteSocialLink,
    saveGeneration: landingStore.saveGeneration,
    deleteGeneration: landingStore.deleteGeneration,
    fetchAttendance: attendanceStore.fetchAttendance,
    saveAttendance: attendanceStore.saveAttendance
  }
})
