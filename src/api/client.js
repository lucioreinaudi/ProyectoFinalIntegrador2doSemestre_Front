const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Error con el status HTTP y el mensaje que mando el back (si vino).
// Los componentes pueden usar error.status para decidir que mostrar
// (401 en login, 409 en registro, etc.).
export class ApiError extends Error {
    constructor(status, message) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
    }
}

async function request(path, options = {}) {
    const response = await fetch(`${BASE_URL}${path}`, {
        headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
        ...options,
    });

    const texto = await response.text();
    let data = null;
    if (texto) {
        try {
            data = JSON.parse(texto);
        } catch {
            data = null;
        }
    }

    if (!response.ok) {
        const mensaje = data?.detail || data?.message || texto || `Error ${response.status}`;
        throw new ApiError(response.status, mensaje);
    }

    return data;
}

export const api = {
    get: (path) => request(path, { method: 'GET' }),
    post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
    put: (path, body) => request(path, { method: 'PUT', body: JSON.stringify(body) }),
    delete: (path) => request(path, { method: 'DELETE' }),
};
