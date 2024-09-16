import { Zoom, toast } from "react-toastify";

export const notify = (message, type) => {
  const toastOptions = {
    position: "top-right",
    autoClose: 1000,
    transition: Zoom,
  };

  const notifyObject = {
    info: () => toast.info(message, { ...toastOptions }),
    success: () => toast.success(message, { ...toastOptions }),
    warn: () => toast.warn(message, { ...toastOptions }),
    error: () => toast.error(message, { ...toastOptions }),
  };

  if (notifyObject[type]) {
    notifyObject[type](); // Call the specific notification
  } else {
    console.error("Invalid notification type provided.");
  }
};
