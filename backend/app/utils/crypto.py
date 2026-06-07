import base64
from cryptography.fernet import Fernet
from django.conf import settings

# Key aus .env oder settings.py laden
FERNET_KEY = settings.FERNET_KEY.encode()  # falls du ihn als String speicherst

def encrypt_signature(signature_bytes: bytes) -> bytes:
    f = Fernet(FERNET_KEY)
    return f.encrypt(signature_bytes)

def decrypt_signature(encrypted_bytes: bytes) -> bytes:
    f = Fernet(FERNET_KEY)
    return f.decrypt(encrypted_bytes)

