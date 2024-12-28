export interface Toast {
  id: number;
  type: "success" | "error" | "loading" | "info";
  message: string;
  closable?: boolean;
}

export const useToast = () => {
  const toasts = useState<Toast[]>("toasts", () => []);

  const addToast = (
    type: "success" | "error" | "loading" | "info",
    message: string,
    closable = false
  ) => {
    const toast = {
      id: Date.now(),
      type,
      message,
      closable,
    };

    toasts.value = [...toasts.value, toast];

    // Only auto remove non-loading and non-closable toasts
    if (type !== "loading" && !closable) {
      setTimeout(() => {
        removeToast(toast.id);
      }, 3000);
    }

    return toast.id;
  };

  const removeToast = (id: number) => {
    const index = toasts.value.findIndex(t => t.id === id);
    if (index !== -1) {
      const newToasts = [...toasts.value];
      newToasts.splice(index, 1);
      toasts.value = newToasts;
    }
  };

  return {
    toasts,
    success: (message: string) => addToast("success", message),
    error: (message: string, closable?: boolean) => addToast("error", message, closable),
    loading: (message: string, closable = false) => addToast("loading", message, closable),
    info: (message: string) => addToast("info", message),
    remove: removeToast,
  };
};
