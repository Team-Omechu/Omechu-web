import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://omechu-api.log8.kr",
});

export default apiClient;
