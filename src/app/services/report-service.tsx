export async function fetchRso(params?: any) {
  const res = await fetch(
    `/api/rso?start_date=${params.start_date}&end_date=${params.end_date}`
  );

  if (!res.ok) {
    // throw new Error("Failed to fetch data");
    return [];
  }

  const data = await res.json();

  return data?.data;
}
