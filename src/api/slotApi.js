import api from "./axiosConfig";

export const getAllSlots      = () => api.get("/slots").then(r => r.data);
export const getAvailableSlots = () => api.get("/slots/available").then(r => r.data);
export const createSlot      = (data) => api.post("/slots", data).then(r => r.data);
export const updateSlotStatus = (id, status) =>
  api.put(`/slots/${id}/status`, null, { params: { status } }).then(r => r.data);
export const deleteSlot      = (id) => api.delete(`/slots/${id}`);
