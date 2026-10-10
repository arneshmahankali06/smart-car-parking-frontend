import api from "./axiosConfig";

export const processPayment    = (data) => api.post("/payments", data).then(r => r.data);
export const getPaymentByBooking = (bookingId) =>
  api.get(`/payments/booking/${bookingId}`).then(r => r.data);
export const getMyPayments     = () => api.get("/payments/my").then(r => r.data);
