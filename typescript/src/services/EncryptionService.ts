import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'
import { IEncryptionService } from '../interfaces/IEncryptionService'

/**
 * Serviço de criptografia implementando IEncryptionService.
 * Gerencia a criptografia e descriptografia de dados sensíveis.
 */
export class EncryptionService implements IEncryptionService {
  private readonly key: Buffer
  private readonly algorithm = 'aes-256-gcm'

  constructor() {
    const encryptionKey = process.env.ENCRYPTION_KEY
    if (!encryptionKey) {
      throw new Error('ENCRYPTION_KEY environment variable is required')
    }
    this.key = Buffer.from(encryptionKey, 'base64')
  }

  /**
   * Criptografa uma string.
   * @param data String a ser criptografada
   * @returns Buffer com dados criptografados
   */
  encrypt(data: string): Buffer {
    try {
      if (!data) {
        return Buffer.from('')
      }

      const iv = randomBytes(12)
      const cipher = createCipheriv(this.algorithm, this.key, iv)

      const encrypted = Buffer.concat([
        cipher.update(data, 'utf8'),
        cipher.final()
      ])

      const authTag = cipher.getAuthTag()

      // Combina IV + AuthTag + Dados Criptografados
      return Buffer.concat([iv, authTag, encrypted])
    } catch (error) {
      console.error('Erro ao criptografar dados:', error)
      throw error
    }
  }

  /**
   * Descriptografa uma string.
   * @param encryptedData Buffer com dados criptografados
   * @returns String original descriptografada
   */
  decrypt(encryptedData: Buffer): string {
    try {
      if (!encryptedData.length) {
        return ''
      }

      // Extrai IV, AuthTag e dados criptografados do buffer
      const iv = encryptedData.subarray(0, 12)
      const authTag = encryptedData.subarray(12, 28)
      const data = encryptedData.subarray(28)

      const decipher = createDecipheriv(this.algorithm, this.key, iv)
      decipher.setAuthTag(authTag)

      const decrypted = Buffer.concat([decipher.update(data), decipher.final()])

      return decrypted.toString('utf8')
    } catch (error) {
      console.error('Erro ao descriptografar dados:', error)
      throw error
    }
  }
}
