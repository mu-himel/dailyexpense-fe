const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api/v1";

export type QueryParams = Record<
  string,
  string | number | boolean | null | undefined
>;

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  query?: QueryParams;
  body?: unknown;
  signal?: AbortSignal;
};

export class ApiError extends Error {
  readonly status: number;
  readonly url: string;

  constructor(message: string, status: number, url: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.url = url;
  }
}

export function buildApiUrl(endpoint: string, query?: QueryParams) {
  const base = API_BASE_URL.replace(/\/+$/, "");
  const path = endpoint.replace(/^\/+/, "");
  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(query ?? {})) {
    if (value === undefined || value === null || value === "") continue;
    search.set(key, String(value));
  }

  const queryString = search.toString();
  return queryString ? `${base}/${path}?${queryString}` : `${base}/${path}`;
}

async function readErrorMessage(response: Response) {
  try {
    const payload: unknown = await response.json();

    if (typeof payload === "string") return payload;

    if (payload && typeof payload === "object" && "message" in payload) {
      const message = (payload as { message?: unknown }).message;
      if (typeof message === "string") return message;
    }
  } catch {
    // The error body was not JSON; fall back to the status text.
  }

  return response.statusText || `Request failed with status ${response.status}`;
}

async function request<T>(
  endpoint: string,
  { method = "GET", query, body, signal }: RequestOptions = {},
): Promise<T> {
  const hasBody = body !== undefined;

  const response = await fetch(buildApiUrl(endpoint, query), {
    method,
    signal,
    headers: {
      Accept: "application/json",
      ...(hasBody ? { "Content-Type": "application/json" } : {}),
    },
    ...(hasBody ? { body: JSON.stringify(body) } : {}),
  });

  if (!response.ok) {
    throw new ApiError(
      await readErrorMessage(response),
      response.status,
      response.url,
    );
  }

  if (response.status === 204 || response.status === 205) {
    return undefined as T;
  }

  const responseBody = await response.text();

  if (responseBody.trim() === "") {
    return undefined as T;
  }

  try {
    return JSON.parse(responseBody) as T;
  } catch {
    throw new ApiError(
      "The server returned an invalid JSON response.",
      response.status,
      response.url,
    );
  }
}

export const api = {
  get<T>(endpoint: string, query?: QueryParams, signal?: AbortSignal) {
    return request<T>(endpoint, { query, signal });
  },

  post<T>(
    endpoint: string,
    body?: unknown,
    query?: QueryParams,
    signal?: AbortSignal,
  ) {
    return request<T>(endpoint, { method: "POST", body, query, signal });
  },
};
