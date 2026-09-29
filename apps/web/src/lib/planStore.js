const KEY = "videoPlan";

export function savePlan(plan) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(plan));
  } catch {
    /* ignore storage errors */
  }
}

export function loadPlan() {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}