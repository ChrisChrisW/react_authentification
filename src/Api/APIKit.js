import axios from "axios";

// Create axios client, pre-configured with baseURL
let APIKit = axios.create({
  baseURL: "http://whaledone.iut-lepuy.fr/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Set JSON Web Token in Client to be included in all calls
export const setClientToken = (token) => {
  APIKit.interceptors.request.use(function (config) {
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
};

export default APIKit;
