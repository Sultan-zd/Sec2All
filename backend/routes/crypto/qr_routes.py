from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import qrcode
from qrcode.constants import ERROR_CORRECT_L, ERROR_CORRECT_M, ERROR_CORRECT_Q, ERROR_CORRECT_H
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives import padding
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.backends import default_backend
import base64
import io
import os

router = APIRouter()

class QRRequest(BaseModel):
    text: str
    encryption_key: str
    size: int = 300
    error_correction: str = 'M'

class QRDecryptRequest(BaseModel):
    encrypted_data: str
    encryption_key: str

class SecureQRService:
    def __init__(self):
        self.SALT_SIZE = 16
        self.IV_SIZE = 16
        self.ITERATIONS = 100000
        self.ERROR_CORRECTION_LEVELS = {
            'L': ERROR_CORRECT_L,
            'M': ERROR_CORRECT_M,
            'Q': ERROR_CORRECT_Q,
            'H': ERROR_CORRECT_H
        }

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

    def encrypt_data(self, text: str, key: str) -> tuple[str, bytes, bytes]:
        """Encrypt data with AES-256-CBC"""
        # Generate salt and IV
        salt = os.urandom(self.SALT_SIZE)
        iv = os.urandom(self.IV_SIZE)
        
        # Derive key from password
        key = self.derive_key(key, salt)
        
        # Pad the data
        padder = padding.PKCS7(128).padder()
        padded_data = padder.update(text.encode()) + padder.finalize()
        
        # Encrypt the data
        cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
        encryptor = cipher.encryptor()
        encrypted_data = encryptor.update(padded_data) + encryptor.finalize()
        
        # Combine salt, IV, and encrypted data
        final_data = salt + iv + encrypted_data
        
        # Encode as base64
        return base64.b64encode(final_data).decode(), salt, iv

    def decrypt_data(self, encrypted_text: str, key: str) -> str:
        """Decrypt data with AES-256-CBC"""
        try:
            # Decode base64
            encrypted_data = base64.b64decode(encrypted_text)
            
            # Extract salt, IV, and encrypted data
            salt = encrypted_data[:self.SALT_SIZE]
            iv = encrypted_data[self.SALT_SIZE:self.SALT_SIZE + self.IV_SIZE]
            data = encrypted_data[self.SALT_SIZE + self.IV_SIZE:]
            
            # Derive key from password
            key = self.derive_key(key, salt)
            
            # Decrypt the data
            cipher = Cipher(algorithms.AES(key), modes.CBC(iv), backend=default_backend())
            decryptor = cipher.decryptor()
            padded_data = decryptor.update(data) + decryptor.finalize()
            
            # Unpad the data
            unpadder = padding.PKCS7(128).unpadder()
            original_data = unpadder.update(padded_data) + unpadder.finalize()
            
            return original_data.decode()
        except Exception as e:
            raise ValueError(f"Decryption failed: {str(e)}")

    def generate_qr_code(self, data: str, size: int, error_correction: str) -> bytes:
        """Generate QR code image"""
        try:
            qr = qrcode.QRCode(
                version=None,
                error_correction=self.ERROR_CORRECTION_LEVELS.get(
                    error_correction, 
                    ERROR_CORRECT_M
                ),
                box_size=10,
                border=4,
            )
            qr.add_data(data)
            qr.make(fit=True)

            # Create QR code image
            img = qr.make_image(fill_color="black", back_color="white")
            
            # Resize image
            img = img.resize((size, size))
            
            # Convert to bytes
            img_byte_arr = io.BytesIO()
            img.save(img_byte_arr, format='PNG')
            img_byte_arr = img_byte_arr.getvalue()
            
            return img_byte_arr
        except Exception as e:
            raise ValueError(f"QR code generation failed: {str(e)}")

qr_service = SecureQRService()

@router.post("/generate")
async def generate_secure_qr(request: QRRequest):
    """Generate an encrypted QR code"""
    try:
        # Validate input
        if not request.text:
            raise HTTPException(status_code=400, detail="Text cannot be empty")
        if not request.encryption_key:
            raise HTTPException(status_code=400, detail="Encryption key cannot be empty")
        if request.size < 100 or request.size > 1000:
            raise HTTPException(status_code=400, detail="Size must be between 100 and 1000")
        if request.error_correction not in qr_service.ERROR_CORRECTION_LEVELS:
            raise HTTPException(status_code=400, detail="Invalid error correction level")

        # Encrypt the data
        encrypted_data, salt, iv = qr_service.encrypt_data(
            request.text,
            request.encryption_key
        )

        # Generate QR code
        qr_image = qr_service.generate_qr_code(
            encrypted_data,
            request.size,
            request.error_correction
        )

        # Convert QR code to base64 for frontend display
        qr_image_base64 = f"data:image/png;base64,{base64.b64encode(qr_image).decode()}"

        return {
            "qr_image": qr_image_base64,
            "encrypted_data": encrypted_data,
            "size": request.size,
            "error_correction": request.error_correction
        }

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate QR code: {str(e)}"
        )

@router.post("/decrypt")
async def decrypt_qr_data(request: QRDecryptRequest):
    """Decrypt QR code data"""
    try:
        # Validate input
        if not request.encrypted_data:
            raise HTTPException(status_code=400, detail="Encrypted data cannot be empty")
        if not request.encryption_key:
            raise HTTPException(status_code=400, detail="Decryption key cannot be empty")

        # Decrypt the data
        decrypted_text = qr_service.decrypt_data(
            request.encrypted_data,
            request.encryption_key
        )

        return {
            "decrypted_text": decrypted_text
        }

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to decrypt data: {str(e)}"
        )

@router.get("/error-correction-levels")
async def get_error_correction_levels():
    """Get available error correction levels"""
    return {
        "levels": [
            {
                "value": "L",
                "label": "Low (7%)",
                "description": "Best for clean environments"
            },
            {
                "value": "M",
                "label": "Medium (15%)",
                "description": "Balanced choice (Recommended)"
            },
            {
                "value": "Q",
                "label": "Quartile (25%)",
                "description": "For poor lighting conditions"
            },
            {
                "value": "H",
                "label": "High (30%)",
                "description": "For damaged or obscured codes"
            }
        ]
    } 