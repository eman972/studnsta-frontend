import api from "./api";

export const sendMessage = (messages, extras = {}) =>
  api.post("/api/ai/chat", { messages, persist: true, ...extras });

export const getAvailableModels = () => api.get("/api/ai/models");
export const explainWrong = (payload) => api.post("/api/ai/explain-wrong", payload);
