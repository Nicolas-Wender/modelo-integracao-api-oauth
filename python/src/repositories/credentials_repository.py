"""
Repositório de credenciais implementando ICredentialsRepository.

Gerencia a persistência de credenciais no BigQuery.
"""

from typing import Any, Dict

from src.interfaces.encryption_service_interface import IEncryptionService

from ..interfaces.credentials_repository_interface import ICredentialsRepository
from ..utils.log import log


class CredentialsRepository(ICredentialsRepository):
    """Repositório de credenciais no BigQuery."""

    def __init__(self, encryption_service: IEncryptionService):
        """
        Inicializa o repositório de credenciais.

        Args:
            encryption_service: Serviço de criptografia
        """

        self._encryption_service = encryption_service

    def get_credentials(self, id: str) -> Dict[str, Any]:
        "requisita os dados na tabela, utilizando o service do bd especificado"
        "deve retornar a linha com o id especificado"
        return {}

    def save_token(self, id: str, token: Dict[str, Any]) -> None:
        "salva o token na tabela, utilizando o service do bd especificado"
        "deve salvar na linha com o id especificado"
        "access_token, refresh_token e validade"
