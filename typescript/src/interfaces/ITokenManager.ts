/**
 * Interface para gerenciamento de tokens OAuth.
 * Define o contrato para serviços que gerenciam tokens de acesso.
 */
export interface ITokenManager {
  /**
   * Obtém um token de acesso válido.
   * @param id Identificador
   * @returns Promise com o token de acesso válido
   * @throws Error se não conseguir obter o token
   */
  getAccessToken(id: string): Promise<string>

  /**
   * Obtém o token armazenado no repositório de credenciais.
   * @param id Identificador
   * @returns Promise com o token armazenado
   */
  getTokenInRepository(id: string): Promise<Record<string, any>>

  /**
   * Verifica se o token atual é válido.
   * @param validity Data de validade do token
   * @returns true se o token é válido, false caso contrário
   */
  isTokenValid(validity: string): boolean

  /**
   * Atualiza o token de acesso usando o refresh token.
   * @param id Identificador
   * @param cred Credenciais atuais
   * @returns Promise com o novo token de acesso
   * @throws Error se falhar ao atualizar o token
   */
  refreshToken(
    id: string,
    cred: Record<string, any>
  ): Promise<Record<string, any>>

  /**
   * Força a atualização do token de acesso.
   * @param id Identificador
   * @returns Promise com o novo token de acesso
   */
  forceRefreshingToken(id: string): Promise<string>

  /**
   * Obtém novo token através do fluxo OAuth.
   * @param id Identificador
   * @returns Promise com o novo token de acesso
   */
  _obtainNewToken(id: string): Promise<Record<string, any>>
}
