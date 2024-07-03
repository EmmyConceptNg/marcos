import { Zoom, toast } from "react-toastify";

export const notify = (message, type) => {
  const notifyObject = {
    info: () =>
      toast.info(message, {
        position: "top-right",
        autoClose: 2000,
        toastId: "01",
        transition: Zoom,
      }),

    success: () =>
      toast.success(message, {
        position: "top-right",
        autoClose: 2000,
        toastId: "02",
        transition: Zoom,
      }),

    warn: () =>
      toast.warn(message, {
        position: "top-right",
        autoClose: 2000,
        toastId: "03",
        transition: Zoom,
      }),

    error: () =>
      toast.error(message, {
        position: "top-right",
        autoClose: 4000,
        toastId: "04",
        transition: Zoom,
      }),
  }[type]();
};




