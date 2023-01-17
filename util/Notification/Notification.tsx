import React from "react";
import { toast } from "react-toastify";
import { injectStyle } from "react-toastify/dist/inject-style";
import styles from "./Notifications.module.css";

if (typeof window !== "undefined") {
  injectStyle();
}

export const notifyError = (message: string, id: string) =>
  toast(<p style={{ fontSize: 16 }}>{message}</p>, {
    toastId: id,
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    rtl: false,
    pauseOnFocusLoss: true,
    draggable: true,
    pauseOnHover: true,
    type: "error",
  });

export const notifySuccess = (message: string) =>{
  toast.dismiss();
  toast(<p className={styles["toast-message"]}>{message}</p>, {
    position: "top-right",
    autoClose: 3000,
    closeButton: false,
    hideProgressBar: true,
    closeOnClick: true,
    rtl: false,
    pauseOnFocusLoss: true,
    draggable: true,
    pauseOnHover: true,
    type: "success",
    bodyClassName: styles["toast-body"],
    style: {
      background: "#E7F3ED",
      boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
      minHeight: "0px",
      height: "40px",
    }
  });
}
