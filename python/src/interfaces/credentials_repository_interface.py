"""
Interface para repositório de credenciais.

Define o contrato para persistência de credenciais.
"""

from abc import ABC, abstractmethod
from typing import Any, Dict

import pandas as pd


class ICredentialsRepository(ABC):
    """Interface para repositório de credenciais."""

    @abstractmethod
    def get_credentials(self, id: str) -> Dict[str, Any]:
        """
        Obtém as credenciais da loja pelo identificador.

        Args:
            id: Identificador da loja
        Returns:
            DataFrame com as credenciais
        """
        pass

    @abstractmethod
    def save_token(self, id: str, token: Dict[str, Any]) -> None:
        """
        Salva o token para a loja especificada.

        Args:
            id: Identificador da loja
            token: Dados do token (access_token, refresh_token, validade)
        """
        pass
