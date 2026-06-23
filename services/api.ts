import axios from "axios";

export const shippingApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SHIPPING_API_URL,
});

export const sellerApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SELLER_API_URL,
});

export const paymentsApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_PAYMENTS_API_URL,
});
