"""
Interfaces do pacote Bling.

Este módulo contém todas as interfaces (contratos) que definem
os comportamentos esperados dos componentes do sistema.
"""

from .api_client_interface import IApiClient
from .token_manager_interface import ITokenManager
from .credentials_repository_interface import ICredentialsRepository
from .encryption_service_interface import IEncryptionService
from .bigquery_service_interface import IBigQueryService
from .browser_automation_interface import IBrowserAutomation

__all__ = [
    "IApiClient",
    "ITokenManager",
    "ICredentialsRepository",
    "IEncryptionService",
    "IBigQueryService",
    "IBrowserAutomation",
]
