// Aus der SWR-Doku
// import fetch from 'unfetch'
//
// const fetcher = url => fetch(url).then(r => r.json())
//  return res.json();
// }
// Nachteil: Keine eigenen Header, keine saubere Fehlermeldung


// Setzt automatisch Content-Type: application/json → praktisch für APIs.
// Wenn res.ok === false, wird eine Exception mit verständlicher Fehlermeldung
// geworfen (statt einem stillen JSON-Fehler).
// Lässt zusätzliche Header durch (options?.headers).
import type { components } from "@/app/lib/generated/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
type APIError = components["schemas"]["APIError"];

export async function fetcher<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(BASE_URL+url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });

  let data: unknown;

  try {
    data = await res.json();
  } catch {
    throw new Error("Invalid JSON response");
  }

  if (!res.ok) {
    const error = data as APIError;
    throw new Error(error.detail || "Request failed");
  }

  return data as T;
}