from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
from typing import Optional
import hashlib
import base64
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import rsa, padding, utils
from cryptography.exceptions import InvalidSignature
from cryptography.hazmat.backends import default_backend

router = APIRouter()

class SignatureService:
    def __init__(self):
        self.KEY_SIZE = 2048
        self.PUBLIC_EXPONENT = 65537
        self.HASH_ALGORITHM = hashes.SHA256()
        self.PADDING = padding.PSS(
            mgf=padding.MGF1(self.HASH_ALGORITHM),
            salt_length=padding.PSS.MAX_LENGTH
        )

    def generate_key_pair(self) -> tuple[str, str]:
        """Generate a new RSA key pair"""
        private_key = rsa.generate_private_key(
            public_exponent=self.PUBLIC_EXPONENT,
            key_size=self.KEY_SIZE,
            backend=default_backend()
        )
        
        # Serialize private key
        private_pem = private_key.private_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PrivateFormat.PKCS8,
            encryption_algorithm=serialization.NoEncryption()
        )
        
        # Serialize public key
        public_pem = private_key.public_key().public_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PublicFormat.SubjectPublicKeyInfo
        )
        
        return private_pem.decode(), public_pem.decode()

    def load_private_key(self, pem_data: str) -> rsa.RSAPrivateKey:
        """Load a private key from PEM format"""
        try:
            return serialization.load_pem_private_key(
                pem_data.encode(),
                password=None,
                backend=default_backend()
            )
        except Exception as e:
            raise ValueError(f"Invalid private key: {str(e)}")

    def load_public_key(self, pem_data: str) -> rsa.RSAPublicKey:
        """Load a public key from PEM format"""
        try:
            return serialization.load_pem_public_key(
                pem_data.encode(),
                backend=default_backend()
            )
        except Exception as e:
            raise ValueError(f"Invalid public key: {str(e)}")

    def calculate_hash(self, data: bytes) -> bytes:
        """Calculate hash of data"""
        hasher = hashes.Hash(self.HASH_ALGORITHM)
        hasher.update(data)
        return hasher.finalize()

    def sign_data(self, private_key: rsa.RSAPrivateKey, data: bytes) -> str:
        """Sign data with private key"""
        try:
            signature = private_key.sign(
                data,
                self.PADDING,
                utils.Prehashed(self.HASH_ALGORITHM)
            )
            return base64.b64encode(signature).decode()
        except Exception as e:
            raise ValueError(f"Signing failed: {str(e)}")

    def verify_signature(
        self, 
        public_key: rsa.RSAPublicKey, 
        signature: str, 
        data: bytes
    ) -> bool:
        """Verify signature with public key"""
        try:
            signature_bytes = base64.b64decode(signature)
            public_key.verify(
                signature_bytes,
                data,
                self.PADDING,
                utils.Prehashed(self.HASH_ALGORITHM)
            )
            return True
        except InvalidSignature:
            return False
        except Exception as e:
            raise ValueError(f"Verification failed: {str(e)}")

signature_service = SignatureService()

@router.post("/generate-keys")
async def generate_keys():
    """Generate a new RSA key pair"""
    try:
        private_key, public_key = signature_service.generate_key_pair()
        return {
            "private_key": private_key,
            "public_key": public_key
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Key generation failed: {str(e)}"
        )

@router.post("/sign")
async def sign_data(
    private_key: str = Form(...),
    text: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None)
):
    """Sign text or file data"""
    try:
        # Ensure at least one input is provided
        if text is None and file is None:
            raise HTTPException(
                status_code=400,
                detail="Either text or file must be provided"
            )

        # Load private key
        try:
            key = signature_service.load_private_key(private_key)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))

        # Calculate hash of the data
        if file:
            content = await file.read()
            data_hash = signature_service.calculate_hash(content)
        else:
            data_hash = signature_service.calculate_hash(text.encode())

        # Sign the hash
        signature = signature_service.sign_data(key, data_hash)

        return {
            "signature": signature,
            "hash": data_hash.hex()
        }

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Signing failed: {str(e)}"
        )

@router.post("/verify")
async def verify_signature_route(
    public_key: str = Form(...),
    signature: str = Form(...),
    text: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None)
):
    """Verify signature for text or file data"""
    try:
        # Ensure at least one input is provided
        if text is None and file is None:
            raise HTTPException(
                status_code=400,
                detail="Either text or file must be provided"
            )

        # Load public key
        try:
            key = signature_service.load_public_key(public_key)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))

        # Calculate hash of the data
        if file:
            content = await file.read()
            data_hash = signature_service.calculate_hash(content)
        else:
            data_hash = signature_service.calculate_hash(text.encode())

        # Verify the signature
        is_valid = signature_service.verify_signature(key, signature, data_hash)

        return {
            "valid": is_valid,
            "hash": data_hash.hex()
        }

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Verification failed: {str(e)}"
        )

@router.get("/algorithms")
async def get_supported_algorithms():
    """Get list of supported signature algorithms"""
    return {
        "algorithms": [
            {
                "name": "RSA-PSS",
                "key_size": signature_service.KEY_SIZE,
                "hash_algorithm": "SHA-256",
                "padding": "PSS with MGF1",
                "recommended": True
            }
        ]
    } 