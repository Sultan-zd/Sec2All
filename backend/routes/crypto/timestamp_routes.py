from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from pydantic import BaseModel
from typing import Optional
import hashlib
import json
import base64
import time
from datetime import datetime
import hmac
import os
from cryptography.hazmat.primitives import serialization, hashes
from cryptography.hazmat.primitives.asymmetric import padding, rsa
from cryptography.exceptions import InvalidSignature

router = APIRouter()

# Generate a key pair for signing timestamps (in production, use secure key storage)
private_key = rsa.generate_private_key(
    public_exponent=65537,
    key_size=2048
)
public_key = private_key.public_key()

class TimestampService:
    def __init__(self):
        self.SECRET_KEY = os.getenv('TIMESTAMP_SECRET_KEY', os.urandom(32))

    def calculate_hash(self, data: bytes) -> str:
        """Calculate SHA-256 hash of data"""
        return hashlib.sha256(data).hexdigest()

    def create_timestamp(self, data_hash: str, timestamp: int) -> bytes:
        """Create a signed timestamp"""
        timestamp_data = f"{data_hash}:{timestamp}".encode()
        signature = private_key.sign(
            timestamp_data,
            padding.PSS(
                mgf=padding.MGF1(hashes.SHA256()),
                salt_length=padding.PSS.MAX_LENGTH
            ),
            hashes.SHA256()
        )
        return signature

    def verify_timestamp(self, data_hash: str, timestamp: int, signature: bytes) -> bool:
        """Verify a timestamp signature"""
        try:
            timestamp_data = f"{data_hash}:{timestamp}".encode()
            public_key.verify(
                signature,
                timestamp_data,
                padding.PSS(
                    mgf=padding.MGF1(hashes.SHA256()),
                    salt_length=padding.PSS.MAX_LENGTH
                ),
                hashes.SHA256()
            )
            return True
        except InvalidSignature:
            return False

    def create_timestamp_token(self, data_hash: str, timestamp: int, signature: bytes) -> str:
        """Create a timestamp token containing all necessary information"""
        token_data = {
            "hash": data_hash,
            "timestamp": timestamp,
            "signature": base64.b64encode(signature).decode()
        }
        return base64.b64encode(json.dumps(token_data).encode()).decode()

    def parse_timestamp_token(self, token: str) -> tuple[str, int, bytes]:
        """Parse a timestamp token"""
        try:
            token_data = json.loads(base64.b64decode(token))
            return (
                token_data["hash"],
                token_data["timestamp"],
                base64.b64decode(token_data["signature"])
            )
        except Exception as e:
            raise ValueError(f"Invalid timestamp token: {str(e)}")

timestamp_service = TimestampService()

@router.post("/create")
async def create_timestamp(
    text: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None)
):
    """Create a timestamp for text or file"""
    try:
        # Ensure at least one input is provided
        if text is None and file is None:
            raise HTTPException(
                status_code=400,
                detail="Either text or file must be provided"
            )

        # Calculate hash of the data
        if file:
            content = await file.read()
            data_hash = timestamp_service.calculate_hash(content)
        else:
            data_hash = timestamp_service.calculate_hash(text.encode())

        # Create timestamp
        current_time = int(time.time())
        signature = timestamp_service.create_timestamp(data_hash, current_time)
        
        # Create timestamp token
        token = timestamp_service.create_timestamp_token(
            data_hash,
            current_time,
            signature
        )

        return {
            "timestamp": current_time,
            "hash": data_hash,
            "token": token,
            "datetime": datetime.fromtimestamp(current_time).isoformat()
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to create timestamp: {str(e)}"
        )

@router.post("/verify")
async def verify_timestamp(
    timestamp: str = Form(...),
    text: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None)
):
    """Verify a timestamp for text or file"""
    try:
        # Parse the timestamp token
        try:
            stored_hash, stored_time, signature = timestamp_service.parse_timestamp_token(timestamp)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))

        # Calculate hash of the current data
        if file:
            content = await file.read()
            current_hash = timestamp_service.calculate_hash(content)
        elif text:
            current_hash = timestamp_service.calculate_hash(text.encode())
        else:
            raise HTTPException(
                status_code=400,
                detail="Either text or file must be provided"
            )

        # Verify the timestamp
        signature_valid = timestamp_service.verify_timestamp(
            stored_hash,
            stored_time,
            signature
        )

        # Check if the data matches
        data_valid = stored_hash == current_hash

        return {
            "valid": signature_valid and data_valid,
            "timestamp": stored_time,
            "hash": stored_hash,
            "current_hash": current_hash,
            "signature_valid": signature_valid,
            "data_valid": data_valid,
            "datetime": datetime.fromtimestamp(stored_time).isoformat()
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to verify timestamp: {str(e)}"
        )

@router.get("/public-key")
async def get_public_key():
    """Get the public key used for timestamp verification"""
    pem = public_key.public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo
    )
    return {
        "public_key": pem.decode(),
        "algorithm": "RSA-PSS-SHA256"
    } 