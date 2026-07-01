import axios, { type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@shared/store'
import { unwrap, type ApiEnvelope } from './apiResponse'
import { isLocalAdminSession } from '@modules/auth/utils/localAuth'

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

/** Registered by App.tsx so the Axios interceptor can redirect without a hard reload */
export function registerLoginNavigator(fn: () => void) {
  _navigateToLogin = fn
}
let _navigateToLogin: (() => void) | null = null

class ApiClient {
  public readonly client: AxiosInstance
  private refreshPromise: Promise<string | undefined> | null = null
  private redirecting = false

  constructor() {
    this.client = axios.create({
      baseURL: this.normalizeBaseUrl(apiBaseUrl),
      headers: { 'Content-Type': 'application/json' },
    })
    this.setupInterceptors()
  }

  private normalizeBaseUrl(url: string) {
    return url.endsWith('/api/v1') ? url : `${url.replace(/\/$/, '')}/api/v1`
  }

  private setupInterceptors() {
    this.client.interceptors.request.use((config) => {
      const token = useAuthStore.getState().accessToken
      if (token) config.headers.Authorization = `Bearer ${token}`
      return config
    })

    this.client.interceptors.response.use(
      (res) => res,
      async (err: AxiosError) => {
        const apiError = this.toApiError(err)
        const config = err.config as (InternalAxiosRequestConfig & { _isRetry?: boolean }) | undefined

        // _isRetry prevents the retried request from re-entering this branch and looping infinitely
        if (apiError.status === 401 && !config?._isRetry) {
          try {
            const newToken = await this.refreshBoraLiToken()
            if (newToken && config) {
              config.headers.Authorization = `Bearer ${newToken}`
              config._isRetry = true
              return this.client(config)
            }
          } catch {
            // Refresh failed — fall through to clear auth
          }

          // Clear the local token — ProtectedRoute's reactive subscription will render
          // <Navigate to="/login"> automatically. Calling redirectToLogin() here would
          // create a double-redirect race with ProtectedRoute's own navigation.
          if (!isLocalAdminSession(useAuthStore.getState().accessToken)) {
            useAuthStore.getState().clearAuth()
          }
        }

        return Promise.reject(apiError)
      },
    )
  }

  /** Exchanges the stored BoraLi refresh token for a new access token. Deduplicates concurrent calls. */
  private refreshBoraLiToken(): Promise<string | undefined> {
    if (this.refreshPromise) return this.refreshPromise

    this.refreshPromise = (async () => {
      try {
        const { refreshToken } = useAuthStore.getState()
        if (!refreshToken) return undefined

        // Use bare axios to avoid re-entering the interceptor
        type TokenPair = { accessToken: string; refreshToken: string }
        const response = await axios.post<TokenPair | ApiEnvelope<TokenPair>>(
          `${this.client.defaults.baseURL}/auth/refresh`,
          { refreshToken },
          { headers: { 'Content-Type': 'application/json' } },
        )
        const { accessToken, refreshToken: newRefreshToken } = unwrap<TokenPair>(response)
        const user = useAuthStore.getState().user
        if (user) useAuthStore.getState().setAuth(user, accessToken, newRefreshToken)
        return accessToken
      } catch {
        return undefined
      } finally {
        this.refreshPromise = null
      }
    })()

    return this.refreshPromise
  }

  private redirectToLogin() {
    if (typeof window === 'undefined') return
    if (window.location.pathname === '/login') return
    if (this.redirecting) return
    this.redirecting = true

    if (_navigateToLogin) {
      _navigateToLogin()
    } else {
      window.location.assign('/login')
    }

    setTimeout(() => { this.redirecting = false }, 2000)
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
}

export const api = new ApiClient().client
