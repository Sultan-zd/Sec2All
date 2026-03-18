from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Request
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from datetime import datetime as dt
import sqlite3
import shortuuid
import os
from dotenv import load_dotenv
import hashlib
from cryptography import x509
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.exceptions import InvalidKey
import OpenSSL
import re
from sign import process_csr  # Import the signing function
from routes.crypto import file_routes, text_routes, timestamp_routes, signature_routes, qr_routes, media_routes
from pathlib import Path

# Load environment variables
load_dotenv()

# Configuration
BASE_DIR = Path(__file__).resolve().parent
DATABASE_URL = os.getenv('DATABASE_URL', 'sqlite:///applications.db')
UPLOADS_DIR = os.getenv('UPLOADS_DIR', os.path.join(BASE_DIR, 'uploads'))
CLIENT_DIR = os.path.join(UPLOADS_DIR, 'clients')
MAX_UPLOAD_SIZE = int(os.getenv('MAX_UPLOAD_SIZE', 10485760))  # 10MB default
ALLOWED_EXTENSIONS = os.getenv('ALLOWED_EXTENSIONS', '["csr", "pem", "crt", "key"]')

# Ensure upload directories exist
os.makedirs(UPLOADS_DIR, exist_ok=True)
os.makedirs(CLIENT_DIR, exist_ok=True)

app = FastAPI()

# Allow CORS for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount the crypto routes
app.include_router(
    file_routes.router,
    prefix="/api/crypto/file",
    tags=["crypto"]
)

app.include_router(
    text_routes.router,
    prefix="/api/crypto/text",
    tags=["text"]
)

app.include_router(
    timestamp_routes.router,
    prefix="/api/crypto/timestamp",
    tags=["timestamp"]
)

app.include_router(
    signature_routes.router, 
    prefix="/api/crypto/signature", 
    tags=["signature"]
)

app.include_router(
    qr_routes.router, 
    prefix="/api/crypto/qr", 
    tags=["qr"]
)

app.include_router(
    media_routes.router, 
    prefix="/api/crypto/media", 
    tags=["media"]
)


# Create SQLite database and tables
def get_db_path():
    """Extract SQLite database path from DATABASE_URL"""
    if DATABASE_URL.startswith('sqlite:///'):
        return DATABASE_URL[10:]
    return 'applications.db'  # fallback

def get_db_connection():
    """Get a database connection using environment configuration"""
    db_path = get_db_path()
    return sqlite3.connect(db_path)

def init_db():
    """Initialize the database with required tables"""
    conn = get_db_connection()
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS applications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            tracking_id TEXT UNIQUE,
            full_name TEXT,
            email TEXT,
            phone TEXT,
            organization TEXT,
            domain_name TEXT,
            additional_domains TEXT,
            org_name TEXT,
            business_reg_num TEXT,
            registered_address TEXT,
            city TEXT,
            country TEXT,
            contact_name TEXT,
            contact_email TEXT,
            contact_phone TEXT,
            csr_file_path TEXT UNIQUE,
            submission_date TEXT,
            status TEXT DEFAULT 'pending',
            status_reason TEXT,
            certificate_path TEXT,
            last_updated TEXT
        )
    ''')
    conn.commit()
    conn.close()

# Initialize database on startup
init_db()

def generate_tracking_id():
    # Generate a short, human-readable ID
    return f"CERT-{shortuuid.ShortUUID().random(length=8).upper()}"

def generate_unique_filename(tracking_id: str, original_filename: str) -> str:
    # Get the file extension from the original filename
    _, file_extension = os.path.splitext(original_filename)
    
    # Generate timestamp
    timestamp = dt.now().strftime("%Y%m%d_%H%M%S")
    
    # Create a unique filename using tracking_id and timestamp
    unique_filename = f"{tracking_id}_{timestamp}{file_extension}"
    
    return unique_filename

def validate_file(file: UploadFile) -> bool:
    """Validate file size and extension"""
    try:
        # Check file extension
        ext = file.filename.split('.')[-1].lower()
        allowed_extensions = eval(ALLOWED_EXTENSIONS)  # Convert string to list
        if ext not in allowed_extensions:
            raise HTTPException(
                status_code=400,
                detail=f"File extension not allowed. Allowed extensions are: {', '.join(allowed_extensions)}"
            )
        
        # Check file size
        file.file.seek(0, 2)  # Seek to end of file
        size = file.file.tell()
        file.file.seek(0)  # Reset file pointer
        
        if size > MAX_UPLOAD_SIZE:
            raise HTTPException(
                status_code=400,
                detail=f"File too large. Maximum size is {MAX_UPLOAD_SIZE / 1024 / 1024}MB"
            )
            
        return True
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

def save_application(data: dict, csr_file_path: str, tracking_id: str) -> bool:
    conn = get_db_connection()
    c = conn.cursor()
    
    try:
        c.execute('''
            INSERT INTO applications (
                tracking_id, full_name, email, phone, organization,
                domain_name, additional_domains, org_name, business_reg_num,
                registered_address, city, country, contact_name,
                contact_email, contact_phone, csr_file_path, submission_date
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            tracking_id, data['fullName'], data['email'], data['phone'],
            data['organization'], data['domainName'], data['additionalDomains'],
            data['orgName'], data['businessRegNum'], data['registeredAddress'],
            data['city'], data['country'], data['contactName'],
            data['contactEmail'], data['contactPhone'], csr_file_path,
            dt.now().strftime("%Y-%m-%d %H:%M:%S")
        ))
        conn.commit()
        return True
    except sqlite3.IntegrityError as e:
        print(f"Database error: {e}")
        return False
    finally:
        conn.close()

def verify_csr(csr_content: bytes) -> dict:
    """
    Verify if the CSR file is valid and extract its information.
    Returns a dictionary with validation results and CSR details.
    """
    try:
        # Try to load the CSR using cryptography
        csr = x509.load_pem_x509_csr(csr_content)
        
        # Try to load the CSR using OpenSSL for additional validation
        openssl_csr = OpenSSL.crypto.load_certificate_request(
            OpenSSL.crypto.FILETYPE_PEM, 
            csr_content
        )
        
        # Verify CSR signature
        if not openssl_csr.verify(openssl_csr.get_pubkey()):
            return {
                "is_valid": False,
                "error": "CSR signature verification failed"
            }

        # Extract CSR information
        subject = csr.subject
        subject_info = {}
        
        for attr in subject:
            if attr.oid._name == 'commonName':
                subject_info['common_name'] = attr.value
            elif attr.oid._name == 'organizationName':
                subject_info['organization'] = attr.value
            elif attr.oid._name == 'countryName':
                subject_info['country'] = attr.value
            elif attr.oid._name == 'stateOrProvinceName':
                subject_info['state'] = attr.value
            elif attr.oid._name == 'localityName':
                subject_info['locality'] = attr.value
            elif attr.oid._name == 'emailAddress':
                subject_info['email'] = attr.value

        # Get alternative names if present
        try:
            san = None
            for extension in csr.extensions:
                if extension.oid._name == 'subjectAltName':
                    san = extension.value
                    break
            
            if san:
                subject_info['alternative_names'] = [name.value for name in san]
        except x509.ExtensionNotFound:
            pass

        # Verify key size (minimum 2048 bits recommended)
        public_key = csr.public_key()
        if isinstance(public_key, rsa.RSAPublicKey):
            key_size = public_key.key_size
            if key_size < 2048:
                return {
                    "is_valid": False,
                    "error": f"RSA key size ({key_size} bits) is less than 2048 bits"
                }
        
        return {
            "is_valid": True,
            "subject": subject_info,
            "key_size": key_size if 'key_size' in locals() else None
        }

    except (ValueError, InvalidKey, OpenSSL.crypto.Error) as e:
        return {
            "is_valid": False,
            "error": f"Invalid CSR format: {str(e)}"
        }

def update_application_status(tracking_id: str, status: str, reason: str = None, certificate_path: str = None):
    """Update application status and related information"""
    conn = get_db_connection()
    c = conn.cursor()
    
    try:
        update_query = '''
            UPDATE applications 
            SET status = ?, 
                status_reason = ?,
                certificate_path = ?,
                last_updated = ?
            WHERE tracking_id = ?
        '''
        c.execute(update_query, (
            status,
            reason,
            certificate_path,
            dt.now().strftime("%Y%m%d_%H%M%S"),
            tracking_id
        ))
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        conn.close()

def validate_file(file: UploadFile) -> bool:
    """Validate file size and extension"""
    try:
        # Check file extension
        ext = file.filename.split('.')[-1].lower()
        allowed_extensions = eval(ALLOWED_EXTENSIONS)  # Convert string to list
        if ext not in allowed_extensions:
            raise HTTPException(
                status_code=400,
                detail=f"File extension not allowed. Allowed extensions are: {', '.join(allowed_extensions)}"
            )
        
        # Check file size
        file.file.seek(0, 2)  # Seek to end of file
        size = file.file.tell()
        file.file.seek(0)  # Reset file pointer
        
        if size > MAX_UPLOAD_SIZE:
            raise HTTPException(
                status_code=400,
                detail=f"File too large. Maximum size is {MAX_UPLOAD_SIZE / 1024 / 1024}MB"
            )
            
        return True
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/submit")
async def submit_application(
    fullName: str = Form(...),
    email: str = Form(...),
    phone: str = Form(...),
    organization: str = Form(...),
    domainName: str = Form(...),
    additionalDomains: str = Form(...),
    orgName: str = Form(...),
    businessRegNum: str = Form(...),
    registeredAddress: str = Form(...),
    city: str = Form(...),
    country: str = Form(...),
    contactName: str = Form(...),
    contactEmail: str = Form(...),
    contactPhone: str = Form(...),
    csrFile: UploadFile = File(...),
    subscription: str = Form(...)  # Add subscription level
):
    try:
        # Validate the uploaded file
        validate_file(csrFile)

        # First, verify the CSR file
        csr_content = await csrFile.read()
        csr_verification = verify_csr(csr_content)
        
        if not csr_verification["is_valid"]:
            return {
                "error": "Invalid CSR file",
                "details": csr_verification["error"]
            }

        # Reset file pointer for later use
        await csrFile.seek(0)
        
        # Generate tracking ID
        tracking_id = generate_tracking_id()
        
        # Create client-specific directory structure using environment paths
        client_dir = os.path.join(CLIENT_DIR, tracking_id)
        os.makedirs(client_dir, exist_ok=True)
        
        # Save CSR with correct naming
        csr_filename = f"{tracking_id}.csr"
        file_path = os.path.join(client_dir, csr_filename)
        
        # Save the CSR file
        try:
            with open(file_path, "wb") as f:
                content = await csrFile.read()
                f.write(content)
        except Exception as e:
            return {"error": f"Failed to save file: {str(e)}"}

        # Prepare data for database
        application_data = {
            'fullName': fullName,
            'email': email,
            'phone': phone,
            'organization': organization,
            'domainName': domainName,
            'additionalDomains': additionalDomains,
            'orgName': orgName,
            'businessRegNum': businessRegNum,
            'registeredAddress': registeredAddress,
            'city': city,
            'country': country,
            'contactName': contactName,
            'contactEmail': contactEmail,
            'contactPhone': contactPhone
        }

        # Save to database with initial pending status
        if save_application(application_data, file_path, tracking_id):
            try:
                # Update status to processing
                update_application_status(
                    tracking_id=tracking_id,
                    status="processing",
                    reason="Certificate generation in progress"
                )
                
                # Process the CSR with correct path format using environment paths
                result = process_csr(
                    tracking_id,
                    os.path.join(CLIENT_DIR, tracking_id, f"{tracking_id}.csr"),
                    subscription
                )
                
                # Update application status based on result
                update_application_status(
                    tracking_id=tracking_id,
                    status="completed",
                    certificate_path=result["local_dir"]
                )
                
                return {
                    "message": "Application submitted and processed successfully!",
                    "trackingId": tracking_id,
                    "csrVerification": csr_verification,
                    "certificatePath": result["local_dir"],
                    "files": result["files"]
                }
                
            except Exception as e:
                error_message = str(e)
                # Update application status with error
                update_application_status(
                    tracking_id=tracking_id,
                    status="failed",
                    reason=error_message
                )
                return {
                    "error": "Certificate generation failed",
                    "details": error_message,
                    "trackingId": tracking_id
                }
        else:
            # If database save fails, delete the uploaded file
            if os.path.exists(file_path):
                os.remove(file_path)
            return {"error": "Failed to save application data"}
            
    except Exception as e:
        error_message = str(e)
        if 'tracking_id' in locals():
            update_application_status(
                tracking_id=tracking_id,
                status="failed",
                reason=error_message
            )
        return {"error": f"Application submission failed: {error_message}"}

@app.get("/status/{tracking_id}")
async def get_application_status(tracking_id: str):
    conn = get_db_connection()
    c = conn.cursor()
    
    try:
        c.execute('''
            SELECT status, status_reason, certificate_path, submission_date, last_updated 
            FROM applications 
            WHERE tracking_id = ?
        ''', (tracking_id,))
        result = c.fetchone()
        
        if result is None:
            raise HTTPException(status_code=404, detail="Application not found")
            
        return {
            "status": result[0],
            "statusReason": result[1],
            "certificatePath": result[2],
            "submissionDate": result[3],
            "lastUpdated": result[4]
        }
    finally:
        conn.close()

@app.post("/track-status")
async def track_status(request: Request):
    data = await request.json()
    tracking_id = data.get('trackingId')
    email = data.get('email')
    
    if not tracking_id or not email:
        raise HTTPException(status_code=400, detail="Tracking ID and email are required")
    
    conn = get_db_connection()
    c = conn.cursor()
    
    try:
        c.execute('''
            SELECT status, status_reason, certificate_path, submission_date, last_updated, email 
            FROM applications 
            WHERE tracking_id = ?
        ''', (tracking_id,))
        result = c.fetchone()
        
        if not result:
            raise HTTPException(status_code=404, detail="Application not found")
            
        if result[5] != email:
            raise HTTPException(status_code=403, detail="Invalid email for this tracking ID")
            
        files = None
        if result[0] == 'completed' and result[2]:  # If status is completed and certificate_path exists
            base_path = result[2]
            files = {
                'crt': f"{base_path}/{tracking_id}.crt",
                'pem': f"{base_path}/{tracking_id}.pem"
            }
            
        return {
            "status": result[0],
            "statusReason": result[1],
            "certificatePath": result[2],
            "submissionDate": result[3],
            "lastUpdated": result[4],
            "files": files
        }
    finally:
        conn.close()

@app.post("/download-certificate")
async def download_certificate(request: Request):
    data = await request.json()
    tracking_id = data.get('trackingId')
    file_type = data.get('fileType')
    file_path = data.get('filePath')
    
    if not all([tracking_id, file_type, file_path]):
        raise HTTPException(status_code=400, detail="Missing required information")
        
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Certificate file not found")
        
    return FileResponse(
        file_path,
        media_type='application/octet-stream',
        filename=f"{tracking_id}.{file_type}"
    )

# Run this once to add new columns
def upgrade_db():
    conn = get_db_connection()
    c = conn.cursor()
    try:
        c.execute('ALTER TABLE applications ADD COLUMN status_reason TEXT')
        c.execute('ALTER TABLE applications ADD COLUMN certificate_path TEXT')
        c.execute('ALTER TABLE applications ADD COLUMN last_updated TEXT')
        conn.commit()
    except sqlite3.OperationalError:
        pass  # Columns might already exist
    finally:
        conn.close()
if __name__ == "__main__":
    upgrade_db()
    import uvicorn
    host = os.getenv('HOST', 'localhost')
    port = int(os.getenv('PORT', 5174))
    debug = os.getenv('DEBUG', 'True').lower() == 'true'
    log_level = os.getenv('LOG_LEVEL', 'info').lower()
    
    uvicorn.run("main:app", reload=debug, host=host, port=port, log_level=log_level)
