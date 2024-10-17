import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000/api/v1",
});

export const get = async (endpoint, params = {}, auth = true) => {
  try {
    const response = await api.get(endpoint, {
      params,
      withCredentials: auth,
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const post = async (endpoint, data = {}, auth = true) => {
  try {
    const response = await api.post(endpoint, data, {
      withCredentials: auth,
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const patch = async (endpoint, data = {}, auth = true) => {
  try {
    const response = await api.patch(endpoint, data, {
      withCredentials: auth,
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const del = async (endpoint, params = {}, auth = true) => {
  try {
    const response = await api.delete(endpoint, {
      params,
      withCredentials: auth,
    });
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const handleError = async (error) => {
  console.log("API error :: ", error);

  const { toast } = useToast();
  toast({
    description: "🔴 Something went wrong",
    className:
      "bg-zinc-900 text-white font-semibold text-xl px-6 py-3 rounded-lg shadow-lg border border-zinc-700 transition ease-in-out duration-300 transform hover:scale-105",
  });
};
