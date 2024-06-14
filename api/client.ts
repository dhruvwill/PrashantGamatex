import axios from "axios";
import { API_URL } from "~/constants/api";

const client = axios.create({
  baseURL: API_URL, // Replace with your backend API URL
});

export default client;
