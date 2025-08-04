import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { ITokenManager } from '../interfaces/ITokenManager'

type TokenCache = {
  [key: string]: Record<string, any>
}

type ApiResponse = {
  retry: boolean
  refresh_token: boolean
  response: Record<string, any>
}

/**
 * Cliente para comunicação com APIs que usam OAuth.
 */
export class ApiClient {
  private tokenCache: TokenCache = {}
  private readonly axios: AxiosInstance

  constructor(
    private readonly tokenManager: ITokenManager,
    private readonly maxRetries: number = 3,
    private readonly retryDelay: number = 1000
  ) {
    this.axios = axios.create()
  }

  /**
   * Executa requisição GET.
   * @param url URL da requisição
   * @param id Identificador
   * @param headers Headers opcionais
   * @returns Promise com a resposta
   */
  async get(
    url: string,
    id: string,
    headers: Record<string, string> = {}
  ): Promise<Record<string, any>> {
    try {
      const accessToken = await this.tokenManager.getAccessToken(id)
      const requestHeaders = {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
        ...headers
      }

      for (let attempt = 0; attempt < this.maxRetries; attempt++) {
        try {
          const response = await this.axios.get(url, {
            headers: requestHeaders
          })
          const result = this.handleResponse(response)

          if (result.refresh_token) {
            await this.tokenManager.forceRefreshingToken(id)
            continue
          }

          if (!result.retry) {
            return result.response
          }

          await new Promise(resolve => setTimeout(resolve, this.retryDelay))
        } catch (error) {
          if (attempt === this.maxRetries - 1) {
            throw error
          }
          await new Promise(resolve => setTimeout(resolve, this.retryDelay))
        }
      }

      throw new Error('Maximum retry attempts reached')
    } catch (error) {
      console.error(`Erro na requisição GET para ${id}:`, error)
      throw error
    }
  }

  /**
   * Executa requisição POST.
   * @param url URL da requisição
   * @param data Dados do corpo da requisição
   * @param id Identificador
   * @param headers Headers opcionais
   * @returns Promise com a resposta
   */
  async post(
    url: string,
    data: Record<string, any>,
    id: string,
    headers: Record<string, string> = {}
  ): Promise<Record<string, any>> {
    try {
      const accessToken = await this.tokenManager.getAccessToken(id)
      const requestHeaders = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
        ...headers
      }

      for (let attempt = 0; attempt < this.maxRetries; attempt++) {
        try {
          const response = await this.axios.post(url, data, {
            headers: requestHeaders
          })
          const result = this.handleResponse(response)

          if (result.refresh_token) {
            await this.tokenManager.forceRefreshingToken(id)
            continue
          }

          if (!result.retry) {
            return result.response
          }

          await new Promise(resolve => setTimeout(resolve, this.retryDelay))
        } catch (error) {
          if (attempt === this.maxRetries - 1) {
            throw error
          }
          await new Promise(resolve => setTimeout(resolve, this.retryDelay))
        }
      }

      throw new Error('Maximum retry attempts reached')
    } catch (error) {
      console.error(`Erro na requisição POST para ${id}:`, error)
      throw error
    }
  }

  /**
   * Processa a resposta da API.
   * @param response Resposta da requisição
   * @returns Objeto com flags de controle e dados
   */
  private handleResponse(response: AxiosResponse): ApiResponse {
    const status = response.status
    const data = response.data

    if (status >= 200 && status < 300) {
      return { retry: false, refresh_token: false, response: data }
    }

    if (status === 401) {
      console.warn('Resposta 401 - Token pode estar expirado')
      return { retry: true, refresh_token: true, response: data }
    }

    if (status === 429) {
      return { retry: true, refresh_token: false, response: data }
    }

    if (status === 503) {
      console.warn('Resposta 503 - Serviço indisponível')
      return { retry: false, refresh_token: false, response: data }
    }

    return { retry: false, refresh_token: false, response: data }
  }
}
