import fetch from 'node-fetch';

/**
 * API response interface
 */
export interface ApiResponse<T = any> {
  status: number;
  data: T;
  headers: Record<string, string>;
}

/**
 * Options for API requests
 */
export interface RequestOptions {
  headers?: Record<string, string>;
  timeout?: number;
}

/**
 * API Client for making HTTP requests
 */
export class ApiClient {
  private baseUrl: string;
  private defaultOptions: RequestOptions;
  private authToken: string | null = null;

  /**
   * Creates an instance of ApiClient
   * @param baseUrl - Base URL for all API requests
   * @param defaultOptions - Default options for requests
   */
  constructor(baseUrl: string, defaultOptions: RequestOptions = {}) {
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    this.defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      ...defaultOptions,
    };
  }

  /**
   * Sets the authentication token for subsequent requests
   * @param token - Authentication token
   */
  setAuthToken(token: string): void {
    this.authToken = token;
  }

  /**
   * Clears the authentication token
   */
  clearAuthToken(): void {
    this.authToken = null;
  }

  /**
   * Makes a GET request
   * @param path - Path to append to the base URL
   * @param options - Request options
   * @returns API response
   */
  async get<T = any>(path: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    return this.request<T>('GET', path, undefined, options);
  }

  /**
   * Makes a POST request
   * @param path - Path to append to the base URL
   * @param body - Request body
   * @param options - Request options
   * @returns API response
   */
  async post<T = any>(path: string, body?: any, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    return this.request<T>('POST', path, body, options);
  }

  /**
   * Makes a PUT request
   * @param path - Path to append to the base URL
   * @param body - Request body
   * @param options - Request options
   * @returns API response
   */
  async put<T = any>(path: string, body?: any, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', path, body, options);
  }

  /**
   * Makes a PATCH request
   * @param path - Path to append to the base URL
   * @param body - Request body
   * @param options - Request options
   * @returns API response
   */
  async patch<T = any>(path: string, body?: any, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    return this.request<T>('PATCH', path, body, options);
  }

  /**
   * Makes a DELETE request
   * @param path - Path to append to the base URL
   * @param options - Request options
   * @returns API response
   */
  async delete<T = any>(path: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', path, undefined, options);
  }

  /**
   * Makes an HTTP request
   * @param method - HTTP method
   * @param path - Path to append to the base URL
   * @param body - Request body
   * @param options - Request options
   * @returns API response
   */
private async request<T = any>(
  method: string,
  path: string,
  body?: any,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const url = `${this.baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
  const headers = {
    ...this.defaultOptions.headers,
    ...options.headers,
  };

  // Add auth token if available
  if (this.authToken) {
    headers['Cookie'] = `token=${this.authToken}`;
  }

  // Create the request options object with the correct type
  const requestOptions: import('node-fetch').RequestInit = {
    method,
    headers,
    // Fix the body property by explicitly setting it only when defined
    ...(body ? { body: JSON.stringify(body) } : {})
  };

  try {
    const response = await fetch(url, requestOptions);
    const responseHeaders: Record<string, string> = {};
    
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    let data: T;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json() as T;
    } else {
      // Handle non-JSON responses
      const text = await response.text();
      try {
        data = JSON.parse(text) as T;
      } catch {
        data = text as unknown as T;
      }
    }

    return {
      status: response.status,
      data,
      headers: responseHeaders,
    };
  } catch (error) {
    console.error(`API Request Error: ${method} ${url}`, error);
    throw error;
  }
}
}