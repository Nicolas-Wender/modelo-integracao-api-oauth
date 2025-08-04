import { ICredentialsRepository } from '../interfaces/ICredentialsRepository'
import { ITokenManager } from '../interfaces/ITokenManager'

/**
 * Gerenciador de tokens OAuth com cache e refresh automático.
 */
export class TokenManager implements ITokenManager {
  private tokenCache: Record<string, Record<string, any>> = {}

  constructor(private readonly credentialsRepository: ICredentialsRepository) {}

  /**
   * Obtém token de acesso válido.
   * @param id Identificador
   * @returns Promise com token válido
   */
  async getAccessToken(id: string): Promise<string> {
    try {
      // Verifica cache primeiro
      const cached = this.tokenCache[id]
      if (cached && this.isTokenValid(cached.validade)) {
        return cached.access_token
      }

      // Se não tem no cache ou está expirado, busca do repositório
      const stored = await this.getTokenInRepository(id)

      // Se tem token armazenado e é válido, atualiza cache e retorna
      if (stored && this.isTokenValid(stored.validade)) {
        this.tokenCache[id] = stored
        return stored.access_token
      }

      // Se tem refresh token, tenta atualizar
      if (stored?.refresh_token) {
        const refreshed = await this.refreshToken(id, stored)
        return refreshed.access_token
      }

      // Se nada funcionar, obtém novo token
      const newToken = await this._obtainNewToken(id)
      await this.credentialsRepository.saveToken(id, newToken)
      this.tokenCache[id] = newToken
      return newToken.access_token
    } catch (error) {
      console.error(`Erro ao obter access token para ${id}:`, error)
      throw error
    }
  }

  /**
   * Obtém token do repositório.
   * @param id Identificador
   * @returns Promise com o token
   */
  async getTokenInRepository(id: string): Promise<Record<string, any>> {
    try {
      const credentials = await this.credentialsRepository.getCredentials(id)
      return credentials
    } catch (error) {
      console.error(`Erro ao obter token do repositório para ${id}:`, error)
      throw error
    }
  }

  /**
   * Verifica se o token é válido.
   * @param validity Data de validade
   * @returns true se válido
   */
  isTokenValid(validity: string): boolean {
    try {
      if (!validity) return false
      const validUntil = new Date(validity).getTime()
      const now = new Date().getTime()
      return validUntil > now
    } catch {
      return false
    }
  }

  /**
   * Atualiza token usando refresh token.
   * @param id Identificador
   * @param cred Credenciais atuais
   * @returns Promise com novo token
   */
  async refreshToken(
    id: string,
    cred: Record<string, any>
  ): Promise<Record<string, any>> {
    try {
      // Implementar lógica de refresh específica da sua API
      throw new Error('Método refreshToken não implementado')
    } catch (error) {
      console.error(`Erro ao atualizar token para ${id}:`, error)
      throw error
    }
  }

  /**
   * Força atualização do token.
   * @param id Identificador
   * @returns Promise com novo token
   */
  async forceRefreshingToken(id: string): Promise<string> {
    try {
      const stored = await this.getTokenInRepository(id)
      const refreshed = await this.refreshToken(id, stored)
      await this.credentialsRepository.saveToken(id, refreshed)
      this.tokenCache[id] = refreshed
      return refreshed.access_token
    } catch (error) {
      console.error(`Erro ao forçar atualização do token para ${id}:`, error)
      throw error
    }
  }

  /**
   * Obtém novo token via OAuth.
   * @param id Identificador
   * @returns Promise com novo token
   */
  async _obtainNewToken(id: string): Promise<Record<string, any>> {
    // Implementar lógica de obtenção de novo token específica da sua API
    throw new Error('Método _obtainNewToken não implementado')
  }
}
