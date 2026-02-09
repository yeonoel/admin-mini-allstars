export const apiFetch = async (url: string, options?: RequestInit) => {
  const res = await fetch(url, options);

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || "API Error");
  }

  return res.json();
};
