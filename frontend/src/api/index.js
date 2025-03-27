import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8000",
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const csrfToken = document.cookie.match('(^|;)\\s*csrftoken\\s*=\\s*([^;]+)');
    if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken[2];
    }
    return config;
});

export default api;