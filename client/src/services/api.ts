/** Shared, typed HTTP boundary for a future LMS API integration.
 * The current screens intentionally use local demo data and do not call it.
 */
export type ApiErrorKind = 'unauthorized' | 'network' | 'http';

export class ApiError extends Error {
  constructor(message: string, readonly kind: ApiErrorKind, readonly status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

const baseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '');

export async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!baseUrl) throw new ApiError('The LMS API is not configured.', 'network');
  let response: Response;
  try {
    response = await fetch(`${baseUrl}${path.startsWith('/') ? path : `/${path}`}`, {
      ...init,
      headers: { ...(init.body ? { 'Content-Type': 'application/json' } : {}), ...init.headers },
    });
  } catch {
    throw new ApiError('Could not reach the LMS API.', 'network');
  }
  if (response.status === 401) throw new ApiError('Sign in is required.', 'unauthorized', 401);
  if (!response.ok) throw new ApiError('The LMS API request failed.', 'http', response.status);
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export interface AuthService {
  signIn(email: string, password: string): Promise<{ access: string; refresh?: string }>;
  register(input: { name: string; email: string; password: string }): Promise<{ id: string }>;
  requestPasswordReset(email: string): Promise<void>;
}

export interface CourseService {
  list(query?: { search?: string; category?: string }): Promise<{ items: unknown[]; total: number }>;
  get(courseId: string): Promise<unknown>;
}
