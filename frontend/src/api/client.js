const BASE_URL = "http://localhost:80000";

export async function apiRequest(path, options = {}) {
    const reponse = await fetch(`${BASE_URL}${path}`,{
        ...options,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    })

    let data = null
    try {
        data = await reponse.json()
    } catch {
        data = null
    }

    if (!reponse.ok) {
        const message  = data?.message || "Ocurrio un error"
        throw new Error(message)
    }

    return data
}