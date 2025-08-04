from .factories.factory import Factory

# Instancia a factory e expõe o cliente já criado
client = Factory().create_client()

__all__ = ["client"]
