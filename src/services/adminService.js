import api from "./api";

export const fetchPlatformStats = async () => {
  const response = await api.get("/api/admin/stats");
  return response.data;
};

export const fetchUsers = async () => {
  const response = await api.get("/api/admin/users");
  return response.data;
};

export const toggleUserStatus = async (userId) => {
  const response = await api.put(`/api/admin/users/${userId}/status`);
  return response.data;
};

export const fetchNotes = async () => {
  const response = await api.get("/api/admin/notes");
  return response.data;
};

export const deleteNote = async (noteId) => {
  const response = await api.delete(`/api/admin/notes/${noteId}`);
  return response.data;
};

export const fetchPosts = async () => {
  const response = await api.get("/api/admin/posts");
  return response.data;
};

export const deletePost = async (postId) => {
  const response = await api.delete(`/api/admin/posts/${postId}`);
  return response.data;
};
