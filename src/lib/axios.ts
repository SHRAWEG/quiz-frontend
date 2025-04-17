// api.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { getCookie } from 'cookies-next/client';

// Standard response format
export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
}

// Custom error class with typed error data
export class ApiError<T = any> extends Error {
  constructor(
    public status: number,
    public data: T,
    message?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

class ApiClient {
  private axiosInstance: AxiosInstance;

  constructor(baseURL: string) {
    this.axiosInstance = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = getCookie('token');
        if (token) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: AxiosError) => Promise.reject(error)
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response.data.data,
      (error: AxiosError) => {
        if (error.response) {
          return Promise.reject(
            new ApiError(
              error.response.status,
              error.response.data,
              error.message
            )
          );
        }
        return Promise.reject(error);
      }
    );
  }

  // GET with typed response
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.axiosInstance.get(url, config);
  }

  // POST with typed request and response
  public async post<T, U = any>(
    url: string,
    data?: U,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.axiosInstance.post(url, data, config);
  }

  // PUT with typed request and response
  public async put<T, U = any>(
    url: string,
    data?: U,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.axiosInstance.put(url, data, config);
  }

  // PATCH with typed request and response
  public async patch<T, U = any>(
    url: string,
    data?: U,
    config?: AxiosRequestConfig
  ): Promise<T> {
    return this.axiosInstance.patch(url, data, config);
  }

  // DELETE with optional request body and typed response
  public async delete<T, U = any>(
    url: string,
    data?: U,
    config?: AxiosRequestConfig
  ): Promise<T> {
    // Axios delete doesn't typically include a body, but some APIs support it
    const deleteConfig = { ...config, data };
    return this.axiosInstance.delete(url, deleteConfig);
  }
}

export const apiClient = new ApiClient(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api');