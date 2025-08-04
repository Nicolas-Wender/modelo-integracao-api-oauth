/**
 * Interface para repositório de credenciais.
 * Define o contrato para persistência de credenciais.
 */
export interface ICredentialsRepository {
  /**
   * Obtém as credenciais pelo identificador.
   * @param id Identificador
   * @returns Promise com os dados das credenciais
   */
  getCredentials(id: string): Promise<Record<string, any>>

  /**
   * Salva o token para o identificador especificado.
   * @param id Identificador
   * @param token Dados do token (access_token, refresh_token, validade)
   * @returns Promise void
   */
  saveToken(id: string, token: Record<string, any>): Promise<void>
}
