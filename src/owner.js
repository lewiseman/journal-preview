import { useSyncExternalStore } from "react";

/* The name written on the book's cover. Kept in this browser only. */

const KEY = "journal-owner";
const listeners = new Set();

let owner = "";
try {
  owner = localStorage.getItem(KEY) ?? "";
} catch {
  /* storage blocked: the name just won't persist */
}

export function setOwner(value) {
  owner = value.slice(0, 24);
  try {
    localStorage.setItem(KEY, owner);
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}

const subscribe = (l) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export const useOwner = () => useSyncExternalStore(subscribe, () => owner);
