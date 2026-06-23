import axios from "axios";

export const shippingApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SHIPPING_API_URL,
  headers: {
    "X-API-Key": process.env.SHIPPING_APIKEY || "", // Agrega tu variable de entorno
  },
});

export const sellerApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SELLER_API_URL,
  headers: {
    "X-API-Key": process.env.SELLER_APIKEY || "", // Agrega tu variable de entorno
  },
});

console.log(sellerApi);

export const paymentsApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_PAYMENTS_API_URL,
  headers: {
    "x-api-key": process.env.PAYMENTS_APIKEY || "", // Agrega tu variable de entorno
  },
});
