<script setup>
import { ref } from 'vue'

const props = defineProps({
  allOtherMembers: Array,
  activeChatMember: Object,
  chatMessages: Array,
  currentUser: Object,
  allMessages: Object
})
const emit = defineEmits(['selectMember', 'sendMessage', 'clearMember', 'viewProfile'])

const chatInput = ref('')

const send = () => {
  if (!chatInput.value.trim()) return
  emit('sendMessage', chatInput.value.trim())
  chatInput.value = ''
}

const lastMsg = (email) => {
  const msgs = props.allMessages?.[email.toLowerCase().trim()]
  return msgs?.length ? msgs[msgs.length - 1] : null
}
</script>

<template>
  <div class="animate-in fade-in duration-300 min-h-[70vh]">
    <div v-if="!activeChatMember">
      <div class="flex items-center justify-between px-1 pb-4">
        <h2 class="text-lg font-black text-white">{{ currentUser?.name?.split(' ')[0] ?? 'Pesan' }}</h2>
        <button class="text-slate-400 hover:text-white cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>
      </div>

      <div class="relative mb-4">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input type="text" placeholder="Cari" class="w-full pl-9 pr-4 py-2.5 bg-slate-900/60 border border-slate-800 rounded-xl text-[13px] text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500">
      </div>

      <div class="space-y-1">
        <div
          v-for="member in allOtherMembers"
          :key="member.email"
          @click="emit('selectMember', member)"
          class="flex items-center gap-3 px-2 py-3 rounded-2xl hover:bg-slate-900/40 cursor-pointer transition-colors"
        >
          <div class="relative flex-shrink-0">
            <img :src="member.avatar" class="w-14 h-14 rounded-full object-cover">
            <span class="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-950"></span>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between">
              <span class="text-[14px] font-semibold text-white truncate">{{ member.name }}</span>
              <span class="text-[11px] text-slate-500 flex-shrink-0 ml-2">{{ lastMsg(member.email)?.time ?? '' }}</span>
            </div>
            <p class="text-[12px] text-slate-400 truncate mt-0.5">
              <span v-if="lastMsg(member.email)">
                <span v-if="lastMsg(member.email).sender === 'me'" class="text-slate-500">Anda: </span>
                {{ lastMsg(member.email).text }}
              </span>
              <span v-else class="italic text-slate-600">Mulai percakapan...</span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="flex flex-col" style="height: 72vh">
      <div class="flex items-center gap-3 pb-3 border-b border-slate-800/60 mb-2">
        <button @click="emit('clearMember')" class="text-slate-400 hover:text-white cursor-pointer p-1 -ml-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <div class="flex items-center gap-3 flex-1 cursor-pointer hover:bg-slate-800/30 p-1 -ml-1 rounded-lg" @click="emit('viewProfile', activeChatMember)">
          <img :src="activeChatMember.avatar" class="w-9 h-9 rounded-full object-cover">
          <div class="flex-1">
            <p class="text-[14px] font-semibold text-white leading-tight">{{ activeChatMember.name }}</p>
            <p class="text-[11px] text-emerald-400 leading-tight">Aktif sekarang</p>
          </div>
        </div>
        <button class="text-slate-400 hover:text-white cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.69a16 16 0 0 0 6.29 6.29l1.06-1.06a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto space-y-3 scrollbar-hide pb-2">
        <div v-if="chatMessages.length === 0" class="flex flex-col items-center justify-center h-full py-12 space-y-3">
          <img :src="activeChatMember.avatar" class="w-16 h-16 rounded-full object-cover">
          <p class="text-[13px] font-semibold text-white">{{ activeChatMember.name }}</p>
          <p class="text-[11px] text-slate-500">{{ activeChatMember.title }}</p>
          <p class="text-[12px] text-slate-600 mt-2">Mulai percakapan dengan {{ activeChatMember.nickname }}</p>
        </div>
        <div
          v-for="msg in chatMessages"
          :key="msg.id"
          :class="['flex', msg.sender === 'me' ? 'justify-end' : 'justify-start items-end gap-2']"
        >
          <img v-if="msg.sender !== 'me'" :src="activeChatMember.avatar" class="w-6 h-6 rounded-full object-cover flex-shrink-0 mb-0.5">
          <div :class="['max-w-[72%] px-4 py-2.5 text-[13px] leading-snug', msg.sender === 'me' ? 'bg-emerald-600 text-white rounded-[20px] rounded-br-sm' : 'bg-slate-800 text-slate-100 rounded-[20px] rounded-bl-sm']">
            <p>{{ msg.text }}</p>
            <span class="text-[10px] opacity-50 block text-right mt-1">{{ msg.time }}</span>
          </div>
        </div>
      </div>

      <form @submit.prevent="send" class="flex items-center gap-2 pt-3 border-t border-slate-800/60">
        <div class="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
          <img :src="currentUser?.avatar" class="w-full h-full object-cover">
        </div>
        <div class="flex-1 flex items-center bg-slate-900/60 border border-slate-800 rounded-full px-4 py-2 gap-2">
          <input
            v-model="chatInput"
            type="text"
            placeholder="Pesan..."
            class="flex-1 bg-transparent text-[13px] text-slate-200 placeholder-slate-600 focus:outline-none"
          >
          <button v-if="chatInput" type="submit" class="text-[12px] font-semibold text-emerald-400 cursor-pointer hover:text-emerald-300 flex-shrink-0">Kirim</button>
        </div>
      </form>
    </div>
  </div>
</template>
