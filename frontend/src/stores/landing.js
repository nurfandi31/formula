import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useLandingStore = defineStore('landing', () => {
  const defaultLandingConfig = {
    heroTitle: '',
    heroSubtitle: '',
    sejarah: ''
  }

  const landingConfig = ref(JSON.parse(localStorage.getItem('formula_landing_config')) || defaultLandingConfig)
  const landingGallery = ref([])
  const landingSections = ref([])
  const landingFaqs = ref([])
  const landingFeatures = ref([])
  const landingNavbars = ref([])
  const landingTestimonials = ref([])
  const landingSettings = ref([])
  const landingSocialLinks = ref([])

  watch(landingConfig, (val) => {
    localStorage.setItem('formula_landing_config', JSON.stringify(val))
  }, { deep: true })

  const API_BASE = 'http://localhost:8000/api'

  const fetchLandingConfig = async () => {
    try {
      const res = await fetch(`${API_BASE}/landing`)
      if (res.ok) {
        const data = await res.json()
        landingConfig.value.heroTitle = data.hero_title
        landingConfig.value.heroSubtitle = data.hero_subtitle
        landingConfig.value.sejarah = data.sejarah
        
        landingGallery.value = data.gallery || []
        landingSections.value = data.sections || []
        landingFaqs.value = data.faqs || []
        landingFeatures.value = data.features || []
        landingNavbars.value = data.navbars || []
        landingTestimonials.value = data.testimonials || []
        landingSettings.value = data.settings || []
        landingSocialLinks.value = data.social_links || []
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

  const saveSection = async (key, content) => {
    try {
      const res = await fetch(`${API_BASE}/landing/sections/${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      })
      if (res.ok) {
        await fetchLandingConfig()
        return { success: true }
      }
    } catch (e) {}
    return { success: false }
  }

  const saveSettings = async (settings) => {
    try {
      const res = await fetch(`${API_BASE}/landing/settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings })
      })
      if (res.ok) {
        await fetchLandingConfig()
        return { success: true }
      }
    } catch (e) {}
    return { success: false }
  }

  const saveFeature = async (feature) => {
    try {
      const res = await fetch(`${API_BASE}/landing/features`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feature)
      })
      if (res.ok) {
        await fetchLandingConfig()
        return { success: true }
      }
    } catch (e) {}
    return { success: false }
  }

  const deleteFeature = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/landing/features/${id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        await fetchLandingConfig()
        return { success: true }
      }
    } catch (e) {}
    return { success: false }
  }

  const saveGallery = async (item) => {
    try {
      const res = await fetch(`${API_BASE}/landing/gallery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      })
      if (res.ok) {
        await fetchLandingConfig()
        return { success: true }
      }
    } catch (e) {}
    return { success: false }
  }

  const deleteGallery = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/landing/gallery/${id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        await fetchLandingConfig()
        return { success: true }
      }
    } catch (e) {}
    return { success: false }
  }

  const saveFaq = async (faq) => {
    try {
      const res = await fetch(`${API_BASE}/landing/faqs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(faq)
      })
      if (res.ok) {
        await fetchLandingConfig()
        return { success: true }
      }
    } catch (e) {}
    return { success: false }
  }

  const deleteFaq = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/landing/faqs/${id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        await fetchLandingConfig()
        return { success: true }
      }
    } catch (e) {}
    return { success: false }
  }

  const saveSocialLink = async (link) => {
    try {
      const res = await fetch(`${API_BASE}/landing/social-links`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(link)
      })
      if (res.ok) {
        await fetchLandingConfig()
        return { success: true }
      }
    } catch (e) {}
    return { success: false }
  }

  const deleteSocialLink = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/landing/social-links/${id}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        await fetchLandingConfig()
        return { success: true }
      }
    } catch (e) {}
    return { success: false }
  }

  return {
    landingConfig,
    landingGallery,
    landingSections,
    landingFaqs,
    landingFeatures,
    landingNavbars,
    landingTestimonials,
    landingSettings,
    landingSocialLinks,
    fetchLandingConfig,
    saveLandingConfig,
    saveSection,
    saveSettings,
    saveFeature,
    deleteFeature,
    saveGallery,
    deleteGallery,
    saveFaq,
    deleteFaq,
    saveSocialLink,
    deleteSocialLink
  }
})
