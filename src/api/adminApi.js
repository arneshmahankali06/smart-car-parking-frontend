import api from "./axiosConfig";

export const getAdminStats   = ()     => api.get("/admin/stats").then(r => r.data);
export const getAdminHistory = ()     => api.get("/admin/reports/history").then(r => r.data);
export const getAdminBookings = ()    => api.get("/admin/bookings").then(r => r.data);
export const gateEntry = (bookingId) => api.post(`/gate/entry/${bookingId}`).then(r => r.data);
export const gateExit  = (bookingId) => api.post(`/gate/exit/${bookingId}`).then(r => r.data);
export const getGateHistory = (bookingId) => api.get(`/gate/history/${bookingId}`).then(r => r.data);
