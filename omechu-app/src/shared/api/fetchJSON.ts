export async function fetchJSON<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    credentials: "include",
    ...options,
  });

  const data = await res.json();

  if (data.resultType !== "SUCCESS") {
    throw new Error(data.error.reason);
  }

  return data.success as T;
}
