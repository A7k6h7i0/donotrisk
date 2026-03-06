const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";
const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");

export function buildAssetUrl(photoPath: string) {
  if (!photoPath) return "";
  if (/^https?:\/\//i.test(photoPath)) return photoPath;
  const normalizedPath = photoPath.startsWith("/") ? photoPath : `/${photoPath}`;
  return `${API_ORIGIN}${normalizedPath}`;
}

export async function apiGet<T>(path: string, token?: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    cache: "no-store"
  });
  if (!res.ok) {
    let detail = "";
    try {
      const body = await res.json();
      detail = body.message || body.detail || "";
    } catch {
      detail = "";
    }
    throw new Error(`GET ${path} failed (${res.status})${detail ? `: ${detail}` : ""}`);
  }
  return res.json();
}

export async function apiPost<T>(path: string, payload: unknown, token?: string): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    let detail = "";
    try {
      const body = await res.json();
      detail = body.message || body.detail || "";
    } catch {
      detail = "";
    }
    throw new Error(`POST ${path} failed (${res.status})${detail ? `: ${detail}` : ""}`);
  }
  return res.json();
}

export async function apiPatch<T>(path: string, payload: unknown, token?: string): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    let detail = "";
    try {
      const body = await res.json();
      detail = body.message || body.detail || "";
    } catch {
      detail = "";
    }
    throw new Error(`PATCH ${path} failed (${res.status})${detail ? `: ${detail}` : ""}`);
  }
  return res.json();
}

export async function apiUpload(path: string, file: File, token: string) {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData
  });
  if (!res.ok) {
    let detail = "";
    try {
      const body = await res.json();
      detail = body.message || body.detail || "";
    } catch {
      detail = "";
    }
    throw new Error(`Upload ${path} failed (${res.status})${detail ? `: ${detail}` : ""}`);
  }
  return res.json();
}
