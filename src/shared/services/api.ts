import axios, { type AxiosError, type AxiosInstance } from 'axios'
import { useAuthStore } from '@shared/store'

const apiBaseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/v1'

type ApiErrorPayload = {
  message?: string | string[]
  error?: string
  statusCode?: number
}

export class ApiRequestError extends Error {
  public readonly status?: number
  public readonly payload?: unknown

  constructor(message: string, status?: number, payload?: unknown) {
    super(message)
    this.name = 'ApiRequestError'
    this.status = status
    this.payload = payload
  }
}

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
        const apiError = this.toApiError(err)

        if (apiError.status === 401) {
          useAuthStore.getState().clearAuth()
          this.redirectToLogin()
        }

        return Promise.reject(apiError)
      },
    )
  }

  private toApiError(error: unknown) {
    if (!axios.isAxiosError(error)) {
      return error instanceof Error
        ? new ApiRequestError(error.message)
        : new ApiRequestError('Nao foi possivel completar a requisicao.')
    }

    const axiosError = error as AxiosError<ApiErrorPayload>
    const payload = axiosError.response?.data
    const status = axiosError.response?.status
    const message = this.getErrorMessage(payload, axiosError.message)

    return new ApiRequestError(message, status, payload)
  }

  private getErrorMessage(payload: ApiErrorPayload | undefined, fallback: string) {
    if (Array.isArray(payload?.message)) return payload.message.join(', ')
    return payload?.message ?? payload?.error ?? fallback
  }

  private redirectToLogin() {
    if (typeof window === 'undefined') return
    if (window.location.pathname === '/login') return

    window.location.assign('/login')
  }
}

export const api = new ApiClient().client
