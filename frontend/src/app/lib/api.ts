export const API_BASE_URL = "http://localhost:5102";

export interface StoredUser {
  id: number | string;
  name?: string;
  email?: string;
  token: string;
}

export function getStoredUser(): StoredUser {
  const storedUser = localStorage.getItem("user");
  if (!storedUser) {
    throw new Error("Please sign in to continue.");
  }

  let user: Partial<StoredUser>;
  try {
    user = JSON.parse(storedUser) as Partial<StoredUser>;
  } catch {
    throw new Error("Your saved sign-in information is invalid. Please sign in again.");
  }

  if (!user.id || !user.token) {
    throw new Error("Please sign in again to continue.");
  }

  return user as StoredUser;
}

export async function apiRequest<T>(
  path: string,
  token?: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const responseText = await response.text();
    let message = responseText || `Request failed (${response.status}).`;
    try {
      const errorBody = JSON.parse(responseText) as { message?: string; title?: string };
      message = errorBody.message || errorBody.title || message;
    } catch {
      // The API may return a plain-text error message.
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const responseText = await response.text();
  if (!responseText.trim()) {
    return undefined as T;
  }

  return JSON.parse(responseText) as T;
}
