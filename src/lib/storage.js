import { SEED } from "./seed.js";

const KEY = "trackr.applications.v1";

export function loadApplications() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return SEED;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : SEED;
  } catch {
    return SEED;
  }
}

export function saveApplications(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
}