export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
  },
  USERS: {
    GET_ALL: '/users',
    GET_BY_ID: (id) => `/users/${id}`,
    UPDATE_PROFILE: (id) => `/users/${id}`,
    SEARCH: '/users/search',
  },
  CHATS: {
    GET_ALL: '/chats',
    GET_BY_ID: (id) => `/chats/${id}`,
    CREATE: '/chats',
    DELETE: (id) => `/chats/${id}`,
  },
  MESSAGES: {
    GET_BY_CHAT: (chatId) => `/chats/${chatId}/messages`,
    SEND: (chatId) => `/chats/${chatId}/messages`,
    DELETE: (chatId, msgId) => `/chats/${chatId}/messages/${msgId}`,
  },
};
