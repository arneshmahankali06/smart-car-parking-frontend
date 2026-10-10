import api from "./axiosConfig";

export const createBooking  = (data) => api.post("/bookings", data).then(r => r.data);
export const getMyBookings  = ()     => api.get("/bookings/my").then(r => r.data);
export const getBookingById = (id)   => api.get(`/bookings/${id}`).then(r => r.data);
export const cancelBooking  = (id)   => api.put(`/bookings/${id}/cancel`).then(r => r.data);
export const getAllBookings  = ()     => api.get("/bookings").then(r => r.data);
export const adminCancelBooking = (id) =>
  api.put(`/bookings/${id}/admin-cancel`).then(r => r.data);
