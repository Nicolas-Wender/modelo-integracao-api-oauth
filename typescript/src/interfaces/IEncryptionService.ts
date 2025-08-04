/**
 * Interface para o serviço de criptografia.
 * Define o contrato para criptografia e descriptografia de dados.
 */
export interface IEncryptionService {
  /**
   * Criptografa uma string.
   * @param data String a ser criptografada
   * @returns String criptografada em base64
   */
  encrypt(data: string): Buffer

  /**
   * Descriptografa uma string.
   * @param encryptedData String criptografada em base64
   * @returns String original descriptografada
   */
  decrypt(encryptedData: Buffer): string
}
