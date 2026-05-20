import axios, { type AxiosInstance } from 'axios'
import { useAuthStore } from '@shared/store'

const apiBaseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/v1'

class ApiClient {
  public readonly client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: this.normalizeBaseUrl(apiBaseUrl),
      headers: { 'Content-Type': 'application/json' },
    })

    this.setupInterceptors()
  }

  private normalizeBaseUrl(baseUrl: string) {
    return baseUrl.endsWith('/api/v1') ? baseUrl : `${baseUrl.replace(/\/$/, '')}/api/v1`
  }

  private setupInterceptors() {
    this.client.interceptors.request.use((config) => {
      const token = useAuthStore.getState().accessToken
      if (token) config.headers.Authorization = `Bearer ${token}`
      return config
    })

    this.client.interceptors.response.use(
      (res) => res,
      (err) => {
        if (err.response?.status === 401) {
          useAuthStore.getState().clearAuth()
        }
        return Promise.reject(err)
      },
    )
  }
}

export const api = new ApiClient().client
