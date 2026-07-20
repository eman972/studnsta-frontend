/** Feature 24: i18n skeleton */
const strings = {
  en: {
    appName: "Studnsta",
    dashboard: "Dashboard",
    connect: "Connect",
    notes: "Study Notes",
    progress: "My Progress",
    settings: "Settings",
  },
  ur: {
    appName: "Studnsta",
    dashboard: "ڈیش بورڈ",
    connect: "کنیکٹ",
    notes: "نوٹس",
    progress: "پیش رفت",
    settings: "ترتیبات",
  },
};

export function t(key, locale = "en") {
  return strings[locale]?.[key] || strings.en[key] || key;
}

export function getLocale() {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user.locale || localStorage.getItem("locale") || "en";
  } catch {
    return "en";
  }
}

export default strings;
