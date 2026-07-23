import api, { BASE_URL } from "./api";
import { getAuthToken } from "../utils/authStorage";

// Classes
export const createClass = (data) => api.post("/api/classes", data);
export const joinClass = (joinCode) => api.post("/api/classes/join", { joinCode });
export const listClasses = () => api.get("/api/classes");
export const getClass = (id) => api.get(`/api/classes/${id}`);
export const getClassRoster = (id) => api.get(`/api/classes/${id}/roster`);
export const announceClass = (id, body, pinned = false) =>
  api.post(`/api/classes/${id}/announce`, { body, pinned });
export const addClassFile = (id, formData) =>
  api.post(`/api/classes/${id}/files`, formData);

// Notifications
export const listNotifications = () => api.get("/api/notifications");
export const unreadNotificationCount = () =>
  api.get("/api/notifications/unread-count");
export const markNotificationRead = (id) =>
  api.post(`/api/notifications/${id}/read`);
export const markAllNotificationsRead = () =>
  api.post("/api/notifications/read-all");

// Messages
export const getInbox = () => api.get("/api/messages/inbox");
export const sendDM = (recipientId, body) =>
  api.post("/api/messages/dm", { recipientId, body });
export const getConversation = (withUserId) =>
  api.get(`/api/messages/with/${withUserId}`);

// Assignments
export const listAssignments = (params) =>
  api.get("/api/assignments", { params });
export const createAssignment = (data) => api.post("/api/assignments", data);
export const submitAssignment = (id, data) =>
  api.post(`/api/assignments/${id}/submit`, data);

// Flashcards
export const listFlashcards = () => api.get("/api/flashcards");
export const dueFlashcards = () => api.get("/api/flashcards/due");
export const createFlashcard = (data) => api.post("/api/flashcards", data);
export const reviewFlashcard = (id, quality) =>
  api.post(`/api/flashcards/${id}/review`, { quality });

// Study groups
export const listStudyGroups = () => api.get("/api/study-groups");
export const createStudyGroup = (data) => api.post("/api/study-groups", data);
export const joinStudyGroup = (id) => api.post(`/api/study-groups/${id}/join`);
export const updateWhiteboard = (id, whiteboard) =>
  api.put(`/api/study-groups/${id}/whiteboard`, { whiteboard });

// Events / calendar
export const listEvents = () => api.get("/api/events");
export const createEvent = (data) => api.post("/api/events", data);
export const exportIcsUrl = () => `${BASE_URL}/api/events/export.ics`;
export const downloadIcs = async () => {
  const token = getAuthToken();
  const res = await fetch(exportIcsUrl(), {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "studnsta-calendar.ics";
  a.click();
  URL.revokeObjectURL(url);
};

// Clubs
export const listClubs = () => api.get("/api/clubs");
export const createClub = (data) => api.post("/api/clubs", data);
export const joinClub = (id) => api.post(`/api/clubs/${id}/join`);

// Search / mastery
export const globalSearch = (q) => api.get("/api/search", { params: { q } });
export const getMastery = () => api.get("/api/mastery");
export const getStudyPlan = () => api.get("/api/study-plan");

// People
export const searchUsers = (q) =>
  api.get("/api/profile/users", { params: { q } });
export const followUser = (userId) =>
  api.post(`/api/profile/follow/${userId}`);
export const unfollowUser = (userId) =>
  api.delete(`/api/profile/follow/${userId}`);

// Settings / profile extras
export const updateProfile = (data) => api.put("/api/profile", data);
export const exportMyData = () => api.get("/api/profile/export");
export const deactivateAccount = () => api.post("/api/profile/deactivate");

// Admin functions removed
