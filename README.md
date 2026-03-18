# Sec2All - Comprehensive Security Certificate Management System

## Overview
Sec2All is a full-stack web application that provides certificate management and cryptographic services. It offers three tiers of SSL/TLS certificates (Silver, Gold, and Platinum) along with a suite of cryptographic tools for file encryption, digital signatures, secure QR codes, and more.

## Features

### Certificate Services
- **Silver Certificate**: Basic wildcard certificate with 2-year validity
- **Gold Certificate**: Enhanced security features with 5-year validity
- **Platinum Certificate**: Maximum security with extended validation and 5-year validity

### Cryptographic Services
1. **File Operations**
   - Encryption/Decryption (AES-256-CBC, AES-256-GCM, ChaCha20-Poly1305)
   - File hashing
   - Batch processing

2. **Text Services**
   - Text encryption/decryption
   - Hashing
   - Base64 encoding
   - URL encoding

3. **Media Services**
   - Image/video watermarking
   - Secure media encryption
   - Format conversion

4. **Additional Services**
   - Digital signatures
   - Timestamp services
   - Secure QR code generation

## Technical Stack

### Frontend
- React.js with Vite
- React Router for navigation
- Tailwind CSS for styling
- Axios for API communication

### Backend
- FastAPI (Python)
- SQLite for database
- OpenSSL for certificate operations
- Cryptography library for security operations
- Python-dotenv for configuration management

## Prerequisites
- Python 3.8+
- Node.js 14+
- OpenSSL
- Git

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/LahsenAitOiahmane/Sec2All.git
cd Sec2All
```

### 2. Automated Setup

#### Windows Setup
Run the PowerShell setup script:
```powershell
.\setup.ps1
```
This script will:
- Verify Python and Node.js installations
- Create and activate Python virtual environment
- Install Python dependencies
- Install Node.js dependencies
- Create necessary directories
- Set up initial configuration

#### Signing Server Setup (Linux)
On your certificate signing server (Kali Linux recommended):
1. Copy the setup script:
```bash
scp backend/setup_signing_server.sh username@signing_server:~/
```

2. Run the setup script:
```bash
sudo bash setup_signing_server.sh
```

This script will:
- Create required directory structure
- Set up OpenSSL configuration
- Configure proper permissions
- Initialize CA directories
- Create necessary certificate directories
- Set up signing scripts

### 3. Manual Setup (Alternative)
If you prefer manual setup, follow these steps:

#### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

#### Frontend Setup
```bash
npm install
```

### 4. Configuration

#### Backend Configuration
Create a `.env` file in the backend directory with the following parameters:

```env
# SSH Configuration
SSH_HOST=your_signing_server_ip
SSH_PORT=your_ssh_port
SSH_USER=your_username
SSH_KEY=/path/to/your/ssh/private_key
SSH_PASSWORD=your_ssh_password

# Server Configuration
HOST=0.0.0.0
PORT=5174
DEBUG=True

# Security
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Database
DATABASE_URL=sqlite:///applications.db

# Certificate Paths
REMOTE_BASE_DIR=/path/to/remote/base/dir
REMOTE_TEMP_DIR=/path/to/remote/temp/dir
REMOTE_CLIENT_DIR=/path/to/remote/client/dir
SIGNING_SCRIPT_PATH=/path/to/signing/script.sh

# File Upload Settings
MAX_UPLOAD_SIZE=10485760  # 10MB
ALLOWED_EXTENSIONS=["csr", "pem", "crt", "key"]

# Logging
LOG_LEVEL=INFO
LOG_FILE=app.log
```

#### Environment Variables Description
- **SSH Configuration**: Required for connecting to the remote signing server
- **Server Configuration**: FastAPI server settings
- **Security**: JWT and authentication settings
- **Database**: SQLite database connection string
- **Certificate Paths**: Remote server paths for certificate operations
- **File Upload Settings**: File size limits and allowed extensions
- **Logging**: Application logging configuration

### 5. Database Setup
The application uses SQLite by default. The database will be created automatically on first run.

### 6. Starting the Application

#### Start the Backend
```bash
cd backend
uvicorn main:app --reload --host 0.0.0.0 --port 5174
```

#### Start the Frontend
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5174

## Setup Scripts

### setup.ps1 (Windows Development Environment)
PowerShell script for setting up the development environment on Windows:
- Verifies Python (3.8+) and Node.js (14+) installations
- Creates and activates Python virtual environment
- Installs all Python dependencies from requirements.txt
- Installs Node.js dependencies
- Sets up directory structure
- Creates initial .env file from template

### setup_signing_server.sh (Certificate Signing Server)
Bash script for setting up the certificate signing server on Linux:
- Creates required directory structure:
  ```
  /home/kali/lab/
  ├── root/          # Root CA certificates
  ├── inter/         # Intermediate certificates
  ├── client/        # Client certificates
  └── temp_uploads/  # Temporary CSR storage
  ```
- Configures OpenSSL for CA operations
- Sets up proper file permissions
- Initializes CA directories and databases
- Creates certificate signing scripts
- Configures security parameters

Requirements for signing server:
- Linux system (Kali Linux recommended)
- Root access for initial setup
- OpenSSL installed
- Proper network security measures

## Security Configuration

### Certificate Signing Server
1. Ensure the signing server (Kali Linux recommended) has OpenSSL installed
2. Copy the signing script to the server:
```bash
scp sign_csr_with_pem.sh username@signing_server:/home/username/lab/
```
3. Set proper permissions:
```bash
chmod 700 /home/username/lab/sign_csr_with_pem.sh
```

### Required Directory Structure
```
/home/username/lab/
├── root/          # Root CA directory
├── inter/         # Intermediate CA directory
├── client/        # Client certificates
└── temp_uploads/  # Temporary CSR uploads
```

## Project Structure
```
Sec2All/
├── backend/
│   ├── routes/          # API routes
│   ├── uploads/         # Certificate storage
│   ├── main.py         # Main application
│   ├── sign.py         # Certificate signing logic
│   ├── setup_signing_server.sh  # Signing server setup
│   └── requirements.txt # Python dependencies
├── setup.ps1           # Windows development setup
├── src/               # React frontend
│   ├── components/    # Reusable components
│   ├── pages/         # Page components
│   └── assets/        # Static assets
└── public/            # Public assets
```

## Production Deployment

### Backend
1. Use Gunicorn with Uvicorn workers
2. Set up SSL/TLS
3. Configure proper firewalls
4. Use environment variables for sensitive data

### Frontend
1. Build the production version:
```bash
npm run build
```
2. Serve using Nginx or similar

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Security Notes
- Regularly update dependencies
- Keep OpenSSL updated
- Monitor certificate expiration dates
- Regularly backup the database
- Review SSH key access
- Keep signing server isolated

## Security Considerations
1. Never commit the `.env` file to version control
2. Use strong, unique values for SECRET_KEY
3. In production, set DEBUG=False
4. Regularly rotate SSH keys and passwords
5. Configure proper file permissions for certificate storage
6. Use HTTPS in production
7. Implement proper backup procedures for the database and certificates

## API Documentation
Once the backend is running, visit `http://localhost:5174/docs` for the interactive API documentation.

