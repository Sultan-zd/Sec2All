from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives import hashes, padding
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
# from crypto.Hash import RIPEMD160, Whirlpool
from cryptography.hazmat.primitives.ciphers.aead import ChaCha20Poly1305, AESGCM
from cryptography.hazmat.backends import default_backend
import os
import base64
import hashlib
import urllib.parse


router = APIRouter()

class TextRequest(BaseModel):
    text: str
    password: str
    method: str

class HashRequest(BaseModel):
    text: str
    method: str

class HashVerifyRequest(BaseModel):
    text: str
    method: str
    hash_to_verify: str

class CryptoTextService:
    def __init__(self):
        self.SALT_SIZE = 16
        self.IV_SIZE = 16
        self.ITERATIONS = 100000

    def derive_key(self, password: str, salt: bytes) -> bytes:
        """Generate a key from password using PBKDF2"""
        kdf = PBKDF2HMAC(
            algorithm=hashes.SHA256(),
            length=32,  # 256-bit key
            salt=salt,
            iterations=self.ITERATIONS,
            backend=default_backend()
        )
        return kdf.derive(password.encode())

    # AES-256-CBC
    def encrypt_aes_cbc(self, text: str, key: bytes, iv: bytes) -> bytes:
        padder = padding.PKCS7(128).padder()
        padded_data = padder.update(text.encode()) + padder.finalize()
        
        cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
        encryptor = cipher.encryptor()
        return encryptor.update(padded_data) + encryptor.finalize()

    def decrypt_aes_cbc(self, encrypted_data: bytes, key: bytes, iv: bytes) -> str:
        cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
        decryptor = cipher.decryptor()
        padded_data = decryptor.update(encrypted_data) + decryptor.finalize()
        
        unpadder = padding.PKCS7(128).unpadder()
        data = unpadder.update(padded_data) + unpadder.finalize()
        return data.decode()

    # AES-256-GCM
    def encrypt_aes_gcm(self, text: str, key: bytes) -> tuple[bytes, bytes]:
        aesgcm = AESGCM(key)
        nonce = os.urandom(12)
        data = text.encode()
        ct = aesgcm.encrypt(nonce, data, None)
        return ct, nonce

    def decrypt_aes_gcm(self, encrypted_data: bytes, key: bytes, nonce: bytes) -> str:
        aesgcm = AESGCM(key)
        data = aesgcm.decrypt(nonce, encrypted_data, None)
        return data.decode()

    # ChaCha20-Poly1305
    def encrypt_chacha20(self, text: str, key: bytes) -> tuple[bytes, bytes]:
        chacha = ChaCha20Poly1305(key)
        nonce = os.urandom(12)
        data = text.encode()
        ct = chacha.encrypt(nonce, data, None)
        return ct, nonce

    def decrypt_chacha20(self, encrypted_data: bytes, key: bytes, nonce: bytes) -> str:
        chacha = ChaCha20Poly1305(key)
        data = chacha.decrypt(nonce, encrypted_data, None)
        return data.decode()

    # Camellia-256-CBC
    def encrypt_camellia(self, text: str, key: bytes, iv: bytes) -> bytes:
        padder = padding.PKCS7(128).padder()
        padded_data = padder.update(text.encode()) + padder.finalize()
        
        cipher = Cipher(algorithms.Camellia(key), modes.CBC(iv), backend=default_backend())
        encryptor = cipher.encryptor()
        return encryptor.update(padded_data) + encryptor.finalize()

    def decrypt_camellia(self, encrypted_data: bytes, key: bytes, iv: bytes) -> str:
        cipher = Cipher(algorithms.Camellia(key), modes.CBC(iv), backend=default_backend())
        decryptor = cipher.decryptor()
        padded_data = decryptor.update(encrypted_data) + decryptor.finalize()
        
        unpadder = padding.PKCS7(128).unpadder()
        data = unpadder.update(padded_data) + unpadder.finalize()
        return data.decode()

class HashingService:
    def calculate_hash(self, text: str, method: str) -> str:
        """Calculate hash of text using specified method"""
        data = text.encode('utf-8')
        
        if method == "MD5":
            return hashlib.md5(data).hexdigest()
        elif method == "SHA1":
            return hashlib.sha1(data).hexdigest()
        elif method == "SHA256":
            return hashlib.sha256(data).hexdigest()
        elif method == "SHA384":
            return hashlib.sha384(data).hexdigest()
        elif method == "SHA512":
            return hashlib.sha512(data).hexdigest()
        # elif method == "RIPEMD160":
        #     h = RIPEMD160.new()
        #     h.update(data)
        #     return h.hexdigest()
        # elif method == "WHIRLPOOL":
        #     h = Whirlpool.new()
        #     h.update(data)
        #     return h.hexdigest()
        else:
            raise ValueError(f"Unsupported hash method: {method}")

    def verify_hash(self, text: str, provided_hash: str, method: str) -> tuple[bool, str]:
        """Verify if calculated hash matches provided hash"""
        calculated_hash = self.calculate_hash(text, method)
        return calculated_hash.lower() == provided_hash.lower(), calculated_hash

class EncodingService:
    def url_encode(self, text: str) -> str:
        """URL encode text"""
        try:
            return urllib.parse.quote(text)
        except Exception as e:
            raise ValueError(f"URL encoding failed: {str(e)}")

    def url_decode(self, text: str) -> str:
        """URL decode text"""
        try:
            return urllib.parse.unquote(text)
        except Exception as e:
            raise ValueError(f"URL decoding failed: {str(e)}")

    def base64_encode(self, text: str) -> str:
        """Base64 encode text"""
        try:
            # Convert string to bytes and encode
            text_bytes = text.encode('utf-8')
            encoded = base64.b64encode(text_bytes)
            return encoded.decode('utf-8')
        except Exception as e:
            raise ValueError(f"Base64 encoding failed: {str(e)}")

    def base64_decode(self, text: str) -> str:
        """Base64 decode text"""
        try:
            # Decode base64 and convert back to string
            decoded = base64.b64decode(text)
            return decoded.decode('utf-8')
        except Exception as e:
            raise ValueError(f"Base64 decoding failed: {str(e)}")

    def base64_url_safe_encode(self, text: str) -> str:
        """URL-safe Base64 encode text"""
        try:
            text_bytes = text.encode('utf-8')
            encoded = base64.urlsafe_b64encode(text_bytes)
            return encoded.decode('utf-8')
        except Exception as e:
            raise ValueError(f"URL-safe Base64 encoding failed: {str(e)}")

    def base64_url_safe_decode(self, text: str) -> str:
        """URL-safe Base64 decode text"""
        try:
            decoded = base64.urlsafe_b64decode(text)
            return decoded.decode('utf-8')
        except Exception as e:
            raise ValueError(f"URL-safe Base64 decoding failed: {str(e)}")

crypto_service = CryptoTextService()
hashing_service = HashingService()
encoding_service = EncodingService()

@router.post("/encrypt")
async def encrypt_text(request: TextRequest):
    try:
        # Generate salt and derive key
        salt = os.urandom(crypto_service.SALT_SIZE)
        key = crypto_service.derive_key(request.password, salt)
        
        # Initialize variables
        encrypted_data = None
        iv = None
        nonce = None

        # Encrypt based on method
        if request.method == "AES-256-CBC":
            iv = os.urandom(crypto_service.IV_SIZE)
            encrypted_data = crypto_service.encrypt_aes_cbc(request.text, key, iv)
        elif request.method == "AES-256-GCM":
            encrypted_data, nonce = crypto_service.encrypt_aes_gcm(request.text, key)
            iv = nonce  # Store nonce in iv field
        elif request.method == "CHACHA20-POLY1305":
            encrypted_data, nonce = crypto_service.encrypt_chacha20(request.text, key)
            iv = nonce  # Store nonce in iv field
        elif request.method == "CAMELLIA-256-CBC":
            iv = os.urandom(crypto_service.IV_SIZE)
            encrypted_data = crypto_service.encrypt_camellia(request.text, key, iv)
        else:
            raise HTTPException(status_code=400, detail=f"Unsupported encryption method: {request.method}")

        # Combine salt, IV/nonce, and encrypted data
        final_data = salt + iv + encrypted_data
        
        # Return base64 encoded result
        return {
            "result": base64.b64encode(final_data).decode(),
            "method": request.method
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/decrypt")
async def decrypt_text(request: TextRequest):
    try:
        # Decode base64 input
        encrypted_data = base64.b64decode(request.text)
        
        # Extract salt and IV/nonce
        salt = encrypted_data[:crypto_service.SALT_SIZE]
        iv = encrypted_data[crypto_service.SALT_SIZE:crypto_service.SALT_SIZE + crypto_service.IV_SIZE]
        data = encrypted_data[crypto_service.SALT_SIZE + crypto_service.IV_SIZE:]
        
        # Derive key
        key = crypto_service.derive_key(request.password, salt)
        
        # Decrypt based on method
        if request.method == "AES-256-CBC":
            result = crypto_service.decrypt_aes_cbc(data, key, iv)
        elif request.method == "AES-256-GCM":
            result = crypto_service.decrypt_aes_gcm(data, key, iv)  # iv contains nonce
        elif request.method == "CHACHA20-POLY1305":
            result = crypto_service.decrypt_chacha20(data, key, iv)  # iv contains nonce
        elif request.method == "CAMELLIA-256-CBC":
            result = crypto_service.decrypt_camellia(data, key, iv)
        else:
            raise HTTPException(status_code=400, detail=f"Unsupported decryption method: {request.method}")
        
        return {
            "result": result,
            "method": request.method
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail="Decryption failed. Please check your password and encryption method.") 

@router.post("/hash")
async def hash_text(request: HashRequest):
    """Generate hash for provided text"""
    try:
        result = hashing_service.calculate_hash(request.text, request.method)
        return {
            "hash": result,
            "method": request.method,
            "text_length": len(request.text)
        }
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate hash: {str(e)}"
        )

@router.post("/verify-hash")
async def verify_text_hash(request: HashVerifyRequest):
    """Verify if provided hash matches calculated hash"""
    try:
        match, calculated_hash = hashing_service.verify_hash(
            request.text,
            request.hash_to_verify,
            request.method
        )
        
        return {
            "match": match,
            "calculated_hash": calculated_hash,
            "provided_hash": request.hash_to_verify,
            "method": request.method
        }
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to verify hash: {str(e)}"
        )

@router.get("/hash-methods")
async def get_hash_methods():
    """Get list of supported hash methods"""
    return {
        "methods": [
            {
                "value": "MD5",
                "label": "MD5",
                "description": "128-bit hash (Not recommended for security)",
                "security_level": "Low",
                "output_length": 32
            },
            {
                "value": "SHA1",
                "label": "SHA-1",
                "description": "160-bit hash (Legacy)",
                "security_level": "Medium-Low",
                "output_length": 40
            },
            {
                "value": "SHA256",
                "label": "SHA-256",
                "description": "256-bit hash (Recommended)",
                "security_level": "High",
                "output_length": 64
            },
            {
                "value": "SHA384",
                "label": "SHA-384",
                "description": "384-bit hash",
                "security_level": "Very High",
                "output_length": 96
            },
            {
                "value": "SHA512",
                "label": "SHA-512",
                "description": "512-bit hash (Highest Security)",
                "security_level": "Very High",
                "output_length": 128
            },
            {
                "value": "RIPEMD160",
                "label": "RIPEMD160",
                "description": "160-bit RACE Message Digest",
                "security_level": "Medium-High",
                "output_length": 40
            },
            {
                "value": "WHIRLPOOL",
                "label": "Whirlpool",
                "description": "512-bit cryptographic hash",
                "security_level": "Very High",
                "output_length": 128
            }
        ]
    }

# # Add input validation middleware
# @router.middleware("http")
# async def validate_input(request: Request, call_next):
#     if request.method == "POST":
#         body = await request.json()
#         if "text" in body and len(body["text"]) > 1048576:  # 1MB limit
#             return JSONResponse(
#                 status_code=400,
#                 content={"detail": "Input text too large. Maximum size is 1MB"}
#             )
#     return await call_next(request) 

@router.post("/url/encode")
async def url_encode(request: TextRequest):
    """URL encode text"""
    try:
        if not request.text:
            raise HTTPException(status_code=400, detail="Text cannot be empty")
        
        result = encoding_service.url_encode(request.text)
        return {
            "result": result,
            "original_length": len(request.text),
            "encoded_length": len(result)
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"URL encoding failed: {str(e)}"
        )

@router.post("/url/decode")
async def url_decode(request: TextRequest):
    """URL decode text"""
    try:
        if not request.text:
            raise HTTPException(status_code=400, detail="Text cannot be empty")
        
        result = encoding_service.url_decode(request.text)
        return {
            "result": result,
            "original_length": len(request.text),
            "decoded_length": len(result)
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"URL decoding failed: {str(e)}"
        )

@router.post("/base64/encode")
async def base64_encode(request: TextRequest):
    """Base64 encode text"""
    try:
        if not request.text:
            raise HTTPException(status_code=400, detail="Text cannot be empty")
        
        result = encoding_service.base64_encode(request.text)
        return {
            "result": result,
            "original_length": len(request.text),
            "encoded_length": len(result)
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Base64 encoding failed: {str(e)}"
        )

@router.post("/base64/decode")
async def base64_decode(request: TextRequest):
    """Base64 decode text"""
    try:
        if not request.text:
            raise HTTPException(status_code=400, detail="Text cannot be empty")
        
        result = encoding_service.base64_decode(request.text)
        return {
            "result": result,
            "original_length": len(request.text),
            "decoded_length": len(result)
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Base64 decoding failed: {str(e)}"
        )

@router.post("/base64url/encode")
async def base64url_encode(request: TextRequest):
    """URL-safe Base64 encode text"""
    try:
        if not request.text:
            raise HTTPException(status_code=400, detail="Text cannot be empty")
        
        result = encoding_service.base64_url_safe_encode(request.text)
        return {
            "result": result,
            "original_length": len(request.text),
            "encoded_length": len(result)
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"URL-safe Base64 encoding failed: {str(e)}"
        )

@router.post("/base64url/decode")
async def base64url_decode(request: TextRequest):
    """URL-safe Base64 decode text"""
    try:
        if not request.text:
            raise HTTPException(status_code=400, detail="Text cannot be empty")
        
        result = encoding_service.base64_url_safe_decode(request.text)
        return {
            "result": result,
            "original_length": len(request.text),
            "decoded_length": len(result)
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"URL-safe Base64 decoding failed: {str(e)}"
        )

@router.get("/encoding-info")
async def get_encoding_info():
    """Get information about available encoding methods"""
    return {
        "methods": [
            {
                "id": "url",
                "name": "URL Encoding",
                "description": "Encodes special characters for use in URLs",
                "variants": ["Standard URL Encoding"]
            },
            {
                "id": "base64",
                "name": "Base64 Encoding",
                "description": "Encodes binary data into ASCII characters",
                "variants": ["Standard Base64", "URL-safe Base64"]
            }
        ]
    } 