import api from "./api";
export const uploadNote = (formData) => api.post("/api/notes", formData);
export const getNotes = (params) => api.get("/api/notes", { params });
export const getNote = (id) => api.get(`/api/notes/${id}`);
export const deleteNote = (id) => api.delete(`/api/notes/${id}`);
export const getFilterOptions = () => api.get("/api/notes/filters");
