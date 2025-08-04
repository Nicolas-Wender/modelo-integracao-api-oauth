"""
Cliente  refatorado seguindo princípios SOLID.

Esta é a nova implementação do cliente  que segue os princípios SOLID
e usa Design Patterns para uma arquitetura mais limpa e testável.
"""

import json
import time
from typing import Any, Dict, Optional

import requests

from src.services.tratamento_de_resposta import tratamento_de_resposta

from ..interfaces.token_manager_interface import ITokenManager
from ..utils.log import log


class Client:
    """
    Cliente principal da API  refatorado.

    Implementa:
    - Single Responsibility: Apenas coordena chamadas de API
    - Open/Closed: Extensível via interfaces
    - Liskov Substitution: Usa interfaces para dependencies
    - Interface Segregation: Usa interfaces específicas
    - Dependency Inversion: Depende de abstrações, não implementações
    """

    def __init__(
        self,
        token_manager: ITokenManager,
        max_retries: int,
        retry_delay: float,
    ):
        """
        Inicializa o cliente .

        Args:
            token_manager: Gerenciador de tokens
            api_client: Cliente HTTP para requisições
        """
        self._token_manager = token_manager
        self._max_retries = max_retries
        self._retry_delay = retry_delay

    def get(
        self, url: str, id: str, headers: Optional[Dict[str, str]] = None
    ) -> Dict[str, Any]:
        """
        Executa requisição GET na API .
        """
        try:
            access_token = self._token_manager.get_access_token(id)

            headers = {
                "Accept": "application/json",
                "Authorization": f"Bearer {access_token}",
            }
            for attempt in range(self._max_retries):
                response = requests.get(url, headers=headers)
                result = tratamento_de_resposta(response)

                if not result["retry"]:
                    return result["response"]
                if not result["refresh_token"]:
                    time.sleep(self._retry_delay)
                    continue
                if result["refresh_token"]:
                    access_token = self._token_manager.force_refreshing_token(id)

                return result["response"]
            return result["response"] if result else {}

        except Exception as e:
            log.error(f"Erro na requisição GET para {id}: {e}")
            raise

    def post(
        self,
        url: str,
        data: Dict[str, Any],
        id: str,
        headers: Optional[Dict[str, str]] = None,
    ) -> Dict[str, Any]:
        """
        Executa requisição POST na API .
        """
        try:
            access_token = self._token_manager.get_access_token(id)

            headers = {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": f"Bearer {access_token}",
            }
            payload = json.dumps(data)
            for attempt in range(self._max_retries):
                response = requests.post(url, headers=headers, data=payload)
                result = tratamento_de_resposta(response)

                if result["finished"]:
                    return result["response"]
                if result["retry"]:
                    time.sleep(self._retry_delay)
                    continue
                return result["response"]
            return result["response"] if result else {}

        except Exception as e:
            log.error(f"Erro na requisição GET para {id}: {e}")
            raise
