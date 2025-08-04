import { ICredentialsRepository } from '../interfaces/ICredentialsRepository'
import { IEncryptionService } from '../interfaces/IEncryptionService'

/**
 * Repositório de credenciais.
 * Esta é uma implementação base que deve ser estendida para
 * integrar com seu banco de dados específico.
 */
export abstract class BaseCredentialsRepository
  implements ICredentialsRepository
{
  constructor(protected readonly encryptionService: IEncryptionService) {}

  /**
   * Obtém credenciais do banco de dados.
   * @param id Identificador
   * @returns Promise com credenciais
   */
  abstract getCredentials(id: string): Promise<Record<string, any>>

  /**
   * Salva token no banco de dados.
   * @param id Identificador
   * @param token Token a ser salvo
   */
  abstract saveToken(id: string, token: Record<string, any>): Promise<void>

  /**
   * Criptografa dados sensíveis.
   * @param data Dados a criptografar
   * @returns Dados criptografados
   */
  protected encryptSensitiveData(data: string): string {
    const encrypted = this.encryptionService.encrypt(data)
    return encrypted.toString('base64')
  }

  /**
   * Descriptografa dados sensíveis.
   * @param data Dados criptografados
   * @returns Dados descriptografados
   */
  protected decryptSensitiveData(data: string): string {
    const buffer = Buffer.from(data, 'base64')
    return this.encryptionService.decrypt(buffer)
  }
}
