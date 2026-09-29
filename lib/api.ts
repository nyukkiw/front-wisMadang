// File untuk memanggil endpoint backend Laravel (auth)

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

export type ApiPeran = "pelanggan" | "penjual";

export interface ApiPengguna {
  id: number;
  nama: string;
  email: string;
  no_telepon: string | null;
  peran: ApiPeran;
  dibuat_pada: string;
}
export interface RegisterPayload {
  nama: string;
  email: string;
  kata_sandi: string;
  peran: ApiPeran;
  no_telepon?: string;
}

interface AuthResponse {
  pesan: string;
  pengguna: ApiPengguna;
  token: string;
}

interface ApiErrorBody {
  pesan?: string;
  message?: string;
  errors?: Record<string, string[]>;
}

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorBody = body as ApiErrorBody;
    const message = errorBody.pesan ?? errorBody.message ?? "Terjadi kesalahan pada server.";

    throw new ApiError(message, response.status, errorBody.errors);
  }

  return body as T;
}

export async function loginRequest(identifier: string, kataSandi: string) {
  const trimmedIdentifier = identifier.trim();
  const isEmail = trimmedIdentifier.includes("@");

  const response = await fetch(`${API_BASE_URL}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      [isEmail ? "email" : "nama"]: trimmedIdentifier,
      kata_sandi: kataSandi,
    }),
  });

  return handleResponse<AuthResponse>(response);
}



export async function registerRequest(payload: RegisterPayload) {
  const response = await fetch(`${API_BASE_URL}/api/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });

  return handleResponse<AuthResponse>(response);
}
