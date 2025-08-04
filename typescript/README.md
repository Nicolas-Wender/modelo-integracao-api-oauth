# Pacote API OAuth TypeScript

Biblioteca para facilitar a integração com APIs que utilizam OAuth 2.0, implementada em TypeScript.

## Recursos

- Gerenciamento automático de tokens OAuth
- Refresh automático de tokens expirados
- Cache de tokens em memória
- Criptografia de dados sensíveis
- Retry automático em falhas de requisição
- Tipagem completa em TypeScript

## Instalação

```bash
npm install pacote-api-oauth
```

## Uso Básico

```typescript
import {
  ApiClient,
  TokenManager,
  EncryptionService,
  BaseCredentialsRepository
} from 'pacote-api-oauth'

// Implemente seu próprio repositório de credenciais
class MyCredentialsRepository extends BaseCredentialsRepository {
  async getCredentials(id: string): Promise<Record<string, any>> {
    // Implemente a busca de credenciais no seu banco de dados
  }

  async saveToken(id: string, token: Record<string, any>): Promise<void> {
    // Implemente a persistência do token no seu banco de dados
  }
}

// Configure as dependências
const encryptionService = new EncryptionService()
const credentialsRepo = new MyCredentialsRepository(encryptionService)
const tokenManager = new TokenManager(credentialsRepo)

// Crie o cliente
const client = new ApiClient(tokenManager)

// Use o cliente para fazer requisições
async function example() {
  try {
    const data = await client.get(
      'https://api.exemplo.com/recurso',
      'ID_DO_CLIENTE'
    )
    console.log(data)
  } catch (error) {
    console.error('Erro:', error)
  }
}
```

## Configuração

### Variáveis de Ambiente

- `ENCRYPTION_KEY`: Chave de 32 bytes em base64 para criptografia (obrigatória)

### Opções do Cliente

```typescript
const client = new ApiClient(
  tokenManager,
  (maxRetries = 3), // Número máximo de tentativas
  (retryDelay = 1000) // Delay entre tentativas em ms
)
```

## Autenticação

O pacote suporta autenticação OAuth 2.0 com:

- Refresh automático de tokens
- Cache em memória
- Fallback para obtenção de novo token
- Criptografia de dados sensíveis

## Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Crie um Pull Request

## Licença

MIT
