import { useEffect, useState } from "react";

function OfflineBanner() {
  const [offline, setOffline] = useState(typeof navigator !== "undefined" ? !navigator.onLine : false);
  const [networkError, setNetworkError] = useState(false);

  useEffect(() => {
    const goOffline = () => setOffline(true);
    const goOnline = () => {
      setOffline(false);
      setNetworkError(false);
    };
    const onNetworkError = () => {
      setNetworkError(true);
      window.clearTimeout(window.__studnstaNetTimer);
      window.__studnstaNetTimer = window.setTimeout(() => setNetworkError(false), 8000);
    };

    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    window.addEventListener("studnsta:network-error", onNetworkError);
    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
      window.removeEventListener("studnsta:network-error", onNetworkError);
      window.clearTimeout(window.__studnstaNetTimer);
    };
  }, []);

  if (!offline && !networkError) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 3000,
        background: offline ? "rgba(239, 68, 68, 0.95)" : "rgba(245, 158, 11, 0.95)",
        color: "#fff",
        textAlign: "center",
        padding: "0.65rem 1rem",
        fontWeight: 600,
        fontSize: "0.9rem",
      }}
    >
      {offline
        ? "You are offline. Some features may be unavailable."
        : "Network error — check your connection or start the backend."}
    </div>
  );
}

export default OfflineBanner;
