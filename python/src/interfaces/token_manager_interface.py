"""
Interface para gerenciamento de tokens OAuth.

Define o contrato para serviços que gerenciam tokens de acesso.
"""

from abc import ABC, abstractmethod
from typing import Any, Dict, Optional

import pandas as pd


class ITokenManager(ABC):
    """Interface para gerenciamento de tokens OAuth."""

    @abstractmethod
    def get_access_token(self, id: str) -> str:
        """
        Obtém um token de acesso válido para a loja.

        Args:
            id: Identificador da loja
        Returns:
            Token de acesso válido
        Raises:
            ValueError: Se não conseguir obter o token
        """
        pass

    @abstractmethod
    def is_token_invalid(self, validade: str) -> bool:
        """
        Verifica se o token atual é válido.

        Args:
            validade: Data de validade do token
        Returns:
            True se o token é inválido, False caso contrário
        """
        pass

    @abstractmethod
    def refresh_token(self, id: str, cred: pd.Series) -> Dict[str, Any]:
        """
        Atualiza o token de acesso usando o refresh token.

        Args:
            id: Identificador da loja
            cred: Série de credenciais
        Returns:
            Novo token de acesso
        Raises:
            Exception: Se falhar ao atualizar o token
        """
        pass

    @abstractmethod
    def force_refreshing_token(self, id: str) -> str:
        """
        Força a atualização do token de acesso.

        Args:
            id: Identificador da loja

        Returns:
            Novo token de acesso
        """
        pass

    @abstractmethod
    def _obtain_new_token(self, id: str) -> Dict[str, Any]:
        """
        Obtém novo token através do fluxo OAuth.

        Args:
            store: Identificador da loja

        Returns:
            Novo token de acesso
        """
        pass
