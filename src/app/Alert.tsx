"use client";
import { createContext, useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdCheckCircle, MdError, MdWarning, MdClose } from "react-icons/md";

const AlertContext = createContext(null);

export const AlertProvider = ({ children } : any) => {
  const [alert, setAlert] = useState({ message: "", type: "", action : null });

  const showAlert = (
    typeOrTitle: "success" | "error" | "warning" | string,
    message: string | object,
    action?: () => void
  ) => {
    let formattedMessage = "";

    if (typeof message === "object" && message !== null) {
      const errorData = (message as any).data ?? message;
      if (typeof errorData === "object") {
        formattedMessage = Object.entries(errorData)
          .map(([field, messages]) => {
            if (Array.isArray(messages)) {
              return `${field}: ${messages.join(", ")}`;
            }
            return `${field}: ${messages}`;
          })
          .join("\n");
      } else {
        formattedMessage = (message as any).msg || "An error occurred.";
      }
    } else if (typeof message === "string") {
      try {
        const parsed = JSON.parse(message);
        return showAlert(typeOrTitle, parsed, action);
      } catch {
        formattedMessage = message;
      }
    }

    setAlert({ message: formattedMessage, type: typeOrTitle, action: action ?? null });

    if (!action) {
      setTimeout(() => {
        setAlert({ message: "", type: "", action: null });
      }, 5000);
    }
  };

  const closeAlert = () => {
    setAlert({ message: "", type: "", action: null });
  };

  const getAlertStyles = (type: string, hasAction: boolean) => {
    if (hasAction) {
      return {
        gradient: "bg-Primary",
        border: "border-Primary/30",
        shadow: "0 20px 40px #297c8f59, 0 0 0 1px #297c8f79",
        iconBg: "bg-white/20",
        pulseBg: "bg-white"
      };
    }
    switch (type) {
      case "success":
        return {
          gradient: "bg-gradient-to-r from-green-500/90 to-emerald-600/90",
          border: "border-green-400/30",
          shadow: "0 20px 40px rgba(34, 197, 94, 0.3), 0 0 0 1px rgba(34, 197, 94, 0.1)",
          iconBg: "bg-green-400/20",
          pulseBg: "bg-green-300"
        };
      case "warning":
        return {
          gradient: "bg-gradient-to-r from-amber-500/90 to-orange-600/90",
          border: "border-amber-400/30",
          shadow: "0 20px 40px rgba(245, 158, 11, 0.3), 0 0 0 1px rgba(245, 158, 11, 0.1)",
          iconBg: "bg-amber-400/20",
          pulseBg: "bg-amber-300"
        };
      case "error":
      default:
        return {
          gradient: "bg-gradient-to-r from-red-500/90 to-rose-600/90",
          border: "border-red-400/30",
          shadow: "0 20px 40px rgba(239, 68, 68, 0.3), 0 0 0 1px rgba(239, 68, 68, 0.1)",
          iconBg: "bg-red-400/20",
          pulseBg: "bg-red-300"
        };
    }
  };

  const getAlertTitle = (type: string, hasAction: boolean) => {
    if (hasAction) return type;
    switch (type) {
      case "success": return "Success!";
      case "warning": return "Warning!";
      case "error":
      default: return "Error!";
    }
  };

  const getAlertIcon = (type: string, hasAction: boolean) => {
    if (hasAction) return null;
    switch (type) {
      case "success": return <MdCheckCircle size={24} className="text-white drop-shadow-sm" />;
      case "warning": return <MdWarning size={24} className="text-white drop-shadow-sm" />;
      case "error":
      default: return <MdError size={24} className="text-white drop-shadow-sm" />;
    }
  };

  const hasAction = !!alert.action;
  const styles = getAlertStyles(alert.type, hasAction);

  return (
    <AlertContext.Provider value={{ alert, showAlert }}>
      <AnimatePresence>
        {alert.message && (
          <>
            {hasAction && (
              <motion.div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[999]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            )}

            <motion.div
              initial={{ opacity: 0, y: -100, scale: 0.8, rotateX: -15 }}
              animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, y: -50, scale: 0.9, transition: { duration: 0.2, ease: "easeIn" } }}
              transition={{ type: "spring", damping: 20, stiffness: 300, duration: 0.6 }}
              className="fixed top-6 right-6 w-full max-w-md z-50 px-4"
            >
              <motion.div
                initial={{ boxShadow: "0 0 0 rgba(0,0,0,0)" }}
                animate={{ boxShadow: styles.shadow }}
                className={`relative overflow-hidden rounded-2xl backdrop-blur-sm border ${styles.gradient} ${styles.border}`}
              >
                <div className="relative p-4">
                  <div className="flex items-start gap-3">
                    {getAlertIcon(alert.type, hasAction) && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                        className="flex-shrink-0 mt-0.5"
                      >
                        <div className={`relative p-1 rounded-full ${styles.iconBg}`}>
                          {getAlertIcon(alert.type, hasAction)}
                          <motion.div
                            animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className={`absolute inset-0 rounded-full ${styles.pulseBg}`}
                          />
                        </div>
                      </motion.div>
                    )}

                    <div className="flex-1 min-w-0">
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <h4 className="text-white font-bold text-lg mb-1 drop-shadow-sm">
                          {getAlertTitle(alert.type, hasAction)}
                        </h4>
                        <p className="text-white/95 text-sm leading-relaxed whitespace-pre-line font-medium drop-shadow-sm">
                          {alert.message}
                        </p>
                      </motion.div>
                    </div>

                    {!hasAction && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
                        whileTap={{ scale: 0.9 }}
                        onClick={closeAlert}
                        className="flex-shrink-0 p-1.5 rounded-full transition-colors duration-200 hover:bg-white/10"
                      >
                        <MdClose size={18} className="text-white/80 hover:text-white" />
                      </motion.button>
                    )}
                  </div>

                  {hasAction && (
                    <div className="mt-4 flex justify-end gap-2">
                      <button
                        className="px-3 py-1.5 rounded-lg bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition"
                        onClick={closeAlert}
                      >
                        Cancel
                      </button>
                      <button
                        className="px-3 py-1.5 rounded-lg bg-white text-sm font-bold text-gray-800 hover:bg-gray-100 transition"
                        onClick={() => {
                          alert.action?.();
                          closeAlert();
                        }}
                      >
                        Confirm
                      </button>
                    </div>
                  )}

                  {!hasAction && (
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 5, ease: "linear" }}
                      className="absolute bottom-0 left-0 h-1 bg-white/30 origin-left"
                      style={{ width: "100%" }}
                    />
                  )}
                </div>

                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                />
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => useContext(AlertContext);
