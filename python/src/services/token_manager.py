"""
Gerenciador de tokens implementando ITokenManager.

Gerencia tokens OAuth com cache e refresh automático.
"""

from datetime import datetime
from typing import Any, Dict

import pandas as pd

from ..interfaces.credentials_repository_interface import ICredentialsRepository
from ..interfaces.token_manager_interface import ITokenManager
from ..utils.log import log


class TokenManager(ITokenManager):
    """Gerenciador de tokens OAuth com cache e refresh automático."""

    def __init__(
        self,
        credentials_repository: ICredentialsRepository,
    ):
        """
        Inicializa o gerenciador de tokens.

        Args:
            credentials_repository: Repositório de credenciais
        """
        self._credentials_repository = credentials_repository
        self._token_cache: Dict[str, Dict[str, Any]] = {}

    def get_access_token(self, id: str) -> str:
        """
        Obtém token de acesso válido para a loja.

        Args:
            id: Identificador da loja

        Returns:
            Token de acesso válido
        """

        try:
            # Verifica cache primeiro, Se não estiver no cache, busca no repositório
            if id in self._token_cache:
                cred = self._token_cache[id]
            else:
                cred = self.get_token_in_repository(id)
                cred = {
                    "access_token": cred["access_token"],
                    "refresh_token": cred["refresh_token"],
                    "validade": cred["validade"],
                }

            if not self.is_token_valid(cred.get("validade", "")):
                cred = self.refresh_token(id, cred)
                self._credentials_repository.save_token(id, cred)

            self._token_cache[id] = cred

            return self._token_cache[id]["access_token"]

        except Exception as e:
            log.error(f"Erro ao obter token para {id}: {e}")
            raise

    def get_token_in_repository(self, id: str) -> pd.Series:
        """
        Obtém o token armazenado no repositório de credenciais.

        Args:
            id: Identificador da loja

        Returns:
            Series com o token armazenado
        """
        try:
            credentials_df = self._credentials_repository.get_credentials(id)

            # verifica se as credenciais foram encontradas
            if credentials_df.empty:
                log.warning(f"Credenciais não encontradas para {id}")
                cred = self._obtain_new_token(id)
                self._credentials_repository.save_token(id, cred)
                credentials_df = pd.DataFrame([cred])

            cred = credentials_df.iloc[0]

            # Verifica se as credenciais estão presentes e válidas
            if (
                not cred.get("access_token")
                or cred.get("access_token") == ""
                or not cred.get("refresh_token")
                or cred.get("refresh_token") == ""
            ):
                log.info(
                    f"Token expirado ou não encontrado para {id}, obtendo novo token"
                )
                cred = self._obtain_new_token(id)
                self._credentials_repository.save_token(id, cred)
                cred = credentials_df.iloc[0]

            return cred
        except Exception as e:
            log.error(f"Erro ao obter token para {id}: {e}")
            raise

    def is_token_valid(self, validade: str) -> bool:
        """
        Verifica se o token da loja é válido.

        Args:
            store: Identificador da loja

        Returns:
            True se o token for válido
        """
        try:
            if not validade or validade == "":
                return False

            expiration = pd.to_datetime(validade)
            return datetime.now() > expiration

        except Exception:
            return False

    def refresh_token(self, id: str, cred: Dict[str, Any]) -> Dict[str, Any]:
        """
        Atualiza token usando refresh_token.

        Args:
            store: Identificador da loja

        Returns:
            Novo token de acesso
        """

        try:
            return {"access_token": "", "refresh_token": "", "validade": ""}

        except Exception as e:
            log.error(f"Erro ao fazer refresh do token para {id}: {e}")
            return self._obtain_new_token(id)

    def force_refreshing_token(self, id: str) -> str:
        """
        Força a atualização do token de acesso.

        Args:
            id: Identificador da loja

        Returns:
            Novo token de acesso
        """
        try:
            if id in self._token_cache:
                cred = self._token_cache[id]
            else:
                cred = self.get_token_in_repository(id)
                cred = {
                    "access_token": cred["access_token"],
                    "refresh_token": cred["refresh_token"],
                    "validade": cred["validade"],
                }

            cred = self.refresh_token(id, cred)
            self._credentials_repository.save_token(id, cred)
            return cred["access_token"]

        except Exception as e:
            log.error(f"Erro ao forçar refresh do token para {id}: {e}")
            raise

    def _obtain_new_token(self, id: str) -> Dict[str, Any]:
        """
        Obtém novo token através do fluxo OAuth.

        Args:
            store: Identificador da loja

        Returns:
            Novo token de acesso
        """
        return {"access_token": "", "refresh_token": "", "validade": ""}
