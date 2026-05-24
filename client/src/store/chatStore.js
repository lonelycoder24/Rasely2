import { create } from 'zustand';

const useChatStore = create((set) => ({
  chats: [],
  activeChat: null,
  messages: [],
  isLoading: false,
  error: null,

  setChats: (chats) => set({ chats }),
  setActiveChat: (chat) => set({ activeChat: chat }),
  setMessages: (messages) => set({ messages }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  clearChat: () => set({ messages: [], activeChat: null, error: null }),
}));

export default useChatStore;
