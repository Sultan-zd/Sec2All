from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives import hashes, padding
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives.ciphers.aead import ChaCha20Poly1305, AESGCM
import os
import base64
import hashlib
# from crypto.Hash import RIPEMD160  # Using PyCryptodome for RIPEMD160

router = APIRouter()

class CryptoService:
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
    def encrypt_aes_cbc(self, data: bytes, key: bytes, iv: bytes) -> bytes:
        padder = padding.PKCS7(128).padder()
        padded_data = padder.update(data) + padder.finalize()
        
        cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
        encryptor = cipher.encryptor()
        return encryptor.update(padded_data) + encryptor.finalize()

    def decrypt_aes_cbc(self, data: bytes, key: bytes, iv: bytes) -> bytes:
        cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
        decryptor = cipher.decryptor()
        padded_data = decryptor.update(data) + decryptor.finalize()
        
        unpadder = padding.PKCS7(128).unpadder()
        return unpadder.update(padded_data) + unpadder.finalize()

    # AES-256-GCM
    def encrypt_aes_gcm(self, data: bytes, key: bytes) -> tuple[bytes, bytes, bytes]:
        aesgcm = AESGCM(key)
        nonce = os.urandom(12)
        ct = aesgcm.encrypt(nonce, data, None)
        return ct, nonce, b""  # No IV needed for GCM

    def decrypt_aes_gcm(self, data: bytes, key: bytes, nonce: bytes) -> bytes:
        aesgcm = AESGCM(key)
        return aesgcm.decrypt(nonce, data, None)

    # AES-256-CTR
    def encrypt_aes_ctr(self, data: bytes, key: bytes, nonce: bytes) -> bytes:
        cipher = Cipher(algorithms.AES(key), modes.CTR(nonce), backend=default_backend())
        encryptor = cipher.encryptor()
        return encryptor.update(data) + encryptor.finalize()

    def decrypt_aes_ctr(self, data: bytes, key: bytes, nonce: bytes) -> bytes:
        cipher = Cipher(algorithms.AES(key), modes.CTR(nonce), backend=default_backend())
        decryptor = cipher.decryptor()
        return decryptor.update(data) + decryptor.finalize()

    # ChaCha20-Poly1305
    def encrypt_chacha20(self, data: bytes, key: bytes) -> tuple[bytes, bytes, bytes]:
        chacha = ChaCha20Poly1305(key)
        nonce = os.urandom(12)
        ct = chacha.encrypt(nonce, data, None)
        return ct, nonce, b""

    def decrypt_chacha20(self, data: bytes, key: bytes, nonce: bytes) -> bytes:
        chacha = ChaCha20Poly1305(key)
        return chacha.decrypt(nonce, data, None)

    # Camellia-256-CBC
    def encrypt_camellia(self, data: bytes, key: bytes, iv: bytes) -> bytes:
        padder = padding.PKCS7(128).padder()
        padded_data = padder.update(data) + padder.finalize()
        
        cipher = Cipher(algorithms.Camellia(key), modes.CBC(iv), backend=default_backend())
        encryptor = cipher.encryptor()
        return encryptor.update(padded_data) + encryptor.finalize()

    def decrypt_camellia(self, data: bytes, key: bytes, iv: bytes) -> bytes:
        cipher = Cipher(algorithms.Camellia(key), modes.CBC(iv), backend=default_backend())
        decryptor = cipher.decryptor()
        padded_data = decryptor.update(data) + decryptor.finalize()
        
        unpadder = padding.PKCS7(128).unpadder()
        return unpadder.update(padded_data) + unpadder.finalize()

    def calculate_hash(self, data: bytes, method: str) -> str:
        """Calculate hash of data using specified method"""
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
        elif method == "WHIRLPOOL":
            h = hashlib.new('whirlpool')
            h.update(data)
            return h.hexdigest()
        else:
            raise ValueError(f"Unsupported hash method: {method}")

    def verify_hash(self, data: bytes, provided_hash: str, method: str) -> bool:
        """Verify if the calculated hash matches the provided hash"""
        calculated_hash = self.calculate_hash(data, method)
        return calculated_hash.lower() == provided_hash.lower()

crypto_service = CryptoService()

@router.post("/encrypt")
async def encrypt_file(
    file: UploadFile = File(...),
    password: str = Form(...),
    method: str = Form(...)
):
    try:
        content = await file.read()
        salt = os.urandom(crypto_service.SALT_SIZE)
        key = crypto_service.derive_key(password, salt)
        
        # Initialize variables
        encrypted_data = None
        iv = None
        nonce = None

        # Encrypt based on method
        if method == "AES-256-CBC":
            iv = os.urandom(crypto_service.IV_SIZE)
            encrypted_data = crypto_service.encrypt_aes_cbc(content, key, iv)
        elif method == "AES-256-GCM":
            encrypted_data, nonce, _ = crypto_service.encrypt_aes_gcm(content, key)
            iv = nonce  # Store nonce in iv field
        elif method == "AES-256-CTR":
            iv = os.urandom(16)  # Use as nonce
            encrypted_data = crypto_service.encrypt_aes_ctr(content, key, iv)
        elif method == "CHACHA20-POLY1305":
            encrypted_data, nonce, _ = crypto_service.encrypt_chacha20(content, key)
            iv = nonce  # Store nonce in iv field
        elif method == "CAMELLIA-256-CBC":
            iv = os.urandom(crypto_service.IV_SIZE)
            encrypted_data = crypto_service.encrypt_camellia(content, key, iv)
        else:
            raise HTTPException(status_code=400, detail=f"Unsupported encryption method: {method}")

        # Combine salt, IV/nonce, and encrypted data
        final_data = salt + iv + encrypted_data
        
        return {
            "filename": f"{file.filename}.{method.lower()}.txt",
            "content": base64.b64encode(final_data).decode(),
            "method": method
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/decrypt")
async def decrypt_file(
    file: UploadFile = File(...),
    password: str = Form(...),
    method: str = Form(...)
):
    try:
        encrypted_content = await file.read()
        
        # Extract salt and IV/nonce
        salt = encrypted_content[:crypto_service.SALT_SIZE]
        iv = encrypted_content[crypto_service.SALT_SIZE:crypto_service.SALT_SIZE + crypto_service.IV_SIZE]
        encrypted_data = encrypted_content[crypto_service.SALT_SIZE + crypto_service.IV_SIZE:]
        
        key = crypto_service.derive_key(password, salt)
        
        # Decrypt based on method
        if method == "AES-256-CBC":
            decrypted_data = crypto_service.decrypt_aes_cbc(encrypted_data, key, iv)
        elif method == "AES-256-GCM":
            decrypted_data = crypto_service.decrypt_aes_gcm(encrypted_data, key, iv)  # iv contains nonce
        elif method == "AES-256-CTR":
            decrypted_data = crypto_service.decrypt_aes_ctr(encrypted_data, key, iv)
        elif method == "CHACHA20-POLY1305":
            decrypted_data = crypto_service.decrypt_chacha20(encrypted_data, key, iv)  # iv contains nonce
        elif method == "CAMELLIA-256-CBC":
            decrypted_data = crypto_service.decrypt_camellia(encrypted_data, key, iv)
        else:
            raise HTTPException(status_code=400, detail=f"Unsupported decryption method: {method}")
        
        return {
            "filename": file.filename.replace(f".{method.lower()}.txt", ""),
            "content": base64.b64encode(decrypted_data).decode()
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 

@router.post("/hash")
async def hash_file(
    file: UploadFile = File(...),
    method: str = Form(...)
):
    try:
        # Read file content
        content = await file.read()

        # Calculate hash
        file_hash = crypto_service.calculate_hash(content, method)

        return {
            "filename": file.filename,
            "method": method,
            "hash": file_hash,
            "size": len(content)
        }
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to calculate hash: {str(e)}"
        )

@router.post("/verify-hash")
async def verify_file_hash(
    file: UploadFile = File(...),
    hash_to_verify: str = Form(...),
    method: str = Form(...)
):
    try:
        # Read file content
        content = await file.read()

        # Calculate and verify hash
        calculated_hash = crypto_service.calculate_hash(content, method)
        match = calculated_hash.lower() == hash_to_verify.lower()

        return {
            "filename": file.filename,
            "method": method,
            "match": match,
            "calculated_hash": calculated_hash,
            "provided_hash": hash_to_verify,
            "size": len(content)
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
    return {
        "methods": [
            {
                "value": "MD5",
                "label": "MD5",
                "description": "128-bit hash (Not recommended for security)",
                "security_level": "Low"
            },
            {
                "value": "SHA1",
                "label": "SHA-1",
                "description": "160-bit hash (Legacy)",
                "security_level": "Medium-Low"
            },
            {
                "value": "SHA256",
                "label": "SHA-256",
                "description": "256-bit hash (Recommended)",
                "security_level": "High"
            },
            {
                "value": "SHA384",
                "label": "SHA-384",
                "description": "384-bit hash",
                "security_level": "Very High"
            },
            {
                "value": "SHA512",
                "label": "SHA-512",
                "description": "512-bit hash (Highest Security)",
                "security_level": "Very High"
            },
            {
                "value": "RIPEMD160",
                "label": "RIPEMD160",
                "description": "160-bit RACE Integrity Primitives Evaluation Message Digest",
                "security_level": "Medium-High"
            },
            {
                "value": "WHIRLPOOL",
                "label": "Whirlpool",
                "description": "512-bit hash designed by Vincent Rijmen",
                "security_level": "Very High"
            }
        ]
    }

@router.post("/hash-batch")
async def hash_multiple_files(
    files: list[UploadFile] = File(...),
    method: str = Form(...)
):
    try:
        results = []
        for file in files:
            content = await file.read()
            file_hash = crypto_service.calculate_hash(content, method)
            results.append({
                "filename": file.filename,
                "hash": file_hash,
                "size": len(content)
            })

        return {
            "method": method,
            "results": results
        }
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process files: {str(e)}"
        )

