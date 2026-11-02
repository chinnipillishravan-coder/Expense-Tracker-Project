const USERS_KEY = "pennywise.users";
const SESSION_KEY = "pennywise.session";

export const categories = [
  { name: "Food & drink", icon: "utensils", color: "#f39b67" },
  { name: "Transport", icon: "car", color: "#7f8df5" },
  { name: "Shopping", icon: "shopping-bag", color: "#d68bd8" },
  { name: "Bills", icon: "receipt", color: "#6bbca7" },
  { name: "Health", icon: "heart-pulse", color: "#ed7d92" },
  { name: "Entertainment", icon: "sparkles", color: "#e7b84f" },
  { name: "Home", icon: "house", color: "#87a2d8" },
  { name: "Other", icon: "circle-ellipsis", color: "#99a1ad" },
];

export function getUsers() {
  try {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
    return Array.isArray(users) ? users : [];
  } catch (error) {
    console.error("Could not read saved accounts.", error);
    return [];
  }
}

export function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
  } catch (error) {
    console.error("Could not read the current session.", error);
    return null;
  }
}

export function saveSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ email: user.email }));
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function getUserData(email, key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(`pennywise.${email}.${key}`) || "null");
    return value ?? fallback;
  } catch (error) {
    console.error(`Could not read ${key} data.`, error);
    return fallback;
  }
}

export function saveUserData(email, key, value) {
  localStorage.setItem(`pennywise.${email}.${key}`, JSON.stringify(value));
}

export async function hashPassword(password, salt) {
  if (!globalThis.crypto?.subtle) {
    throw new Error("Secure password storage requires HTTPS or localhost.");
  }
  const encoder = new TextEncoder();
  const passwordKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: encoder.encode(salt), iterations: 100000, hash: "SHA-256" },
    passwordKey,
    256,
  );
  return Array.from(new Uint8Array(bits), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function makeId() {
  return globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
