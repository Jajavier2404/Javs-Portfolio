const API_URL = import.meta.env.VITE_API_URL || "";

export const apiFetch = async <T>(path: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    credentials: "include",
  });

  if (!response.ok) {
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const data = await response.json();
      throw new Error(data?.error || "Request failed");
    }
    const message = await response.text();
    throw new Error(message || "Request failed");
  }

  return (await response.json()) as T;
};
