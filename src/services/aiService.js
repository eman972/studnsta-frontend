import api from "./api";

export const sendMessage = (messages, extras = {}) =>
  api.post("/api/ai/chat", { messages, persist: true, ...extras });

export const getAvailableModels = () => api.get("/api/ai/models");
export const explainWrong = (payload) => api.post("/api/ai/explain-wrong", payload);
export const chatWithNotes = (payload) => api.post("/api/ai/chat-with-notes", payload);
export const generateFlashcards = (payload) =>
  api.post("/api/ai/generate-flashcards", payload);
export const generateQuiz = (payload) => api.post("/api/ai/generate-quiz", payload);
export const dailyCoach = () => api.get("/api/ai/daily-coach");
export const teacherAssist = (payload) => api.post("/api/ai/teacher-assist", payload);
export const listChats = () => api.get("/api/ai/chats");
export const getChat = (id) => api.get(`/api/ai/chats/${id}`);
