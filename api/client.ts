import axios from "axios";
import { API_URL } from "~/constants/api";

const client = axios.create({
  baseURL: API_URL,
});

export default client;
