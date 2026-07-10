const BASE_URL = "http://localhost:8000"

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  })

  let data = null
  try {
    data = await response.json()
  } catch (parseErr) {
    data = null
  }

  if (!response.ok) {
    const message = data?.detail || "Ocurrió un error"
    throw new Error(message)
  }

  return data
}