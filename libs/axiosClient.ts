import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { signOut } from "next-auth/react";

const axiosClient = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isCancel(error) || error.code === "ERR_CANCELED") {
      return Promise.reject(error);
    }

    const status = error.response?.status;
    const message = error.response?.data?.error || error.message;

    switch (status) {
      case 401:
        enqueueSnackbar("Сессия истекла. Пожалуйста, войдите снова.", { variant: "warning" });
        signOut();
        break;
      case 403:
        enqueueSnackbar("У вас нет доступа к этому действию.", { variant: "error" });
        break;
      case 404:
        enqueueSnackbar("Ресурс не найден.", { variant: 'info' });
        break;
      case 500:
        enqueueSnackbar("Ошибка сервера. Попробуйте позже.", { variant: "error" });
        break;
      default:
        enqueueSnackbar(message || "Произошла ошибка", { variant: "error" });
        break;
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
