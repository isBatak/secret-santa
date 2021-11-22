export async function fetcher(...args) {
  const res = await fetch(...args);

  if (res.ok) {
    const data = await res.json();
    return data;
  }

  const error = await res.json();
  throw error;
}
