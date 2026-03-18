import paramiko
import os
from scp import SCPClient
from pathlib import Path
import logging
import subprocess
import time
# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

# SSH Configuration from environment variables
SSH_HOST = os.getenv('SSH_HOST')
SSH_PORT = int(os.getenv('SSH_PORT', 22))
SSH_USER = os.getenv('SSH_USER')
SSH_KEY = os.getenv('SSH_KEY')
SSH_PASSWORD = os.getenv('SSH_PASSWORD')

# Remote directories from environment variables
REMOTE_BASE_DIR = os.getenv('REMOTE_BASE_DIR')
REMOTE_TEMP_DIR = os.getenv('REMOTE_TEMP_DIR')
REMOTE_CLIENT_DIR = os.getenv('REMOTE_CLIENT_DIR')
SIGNING_SCRIPT_PATH = os.getenv('SIGNING_SCRIPT_PATH')

# Update the directory paths to use backend directory
BASE_DIR = Path(__file__).resolve().parent  # Gets the backend directory
LOCAL_BASE_DIR = BASE_DIR / "uploads"
LOCAL_CLIENT_DIR = LOCAL_BASE_DIR / "clients"

# Signing script path on remote server
SIGNING_SCRIPT_PATH = f'/home/{SSH_USER}/lab/sign_csr_with_pem.sh'

def ensure_remote_temp_directory(ssh_client):
    """Ensure temporary upload directory exists with proper permissions"""
    try:
        commands = [
            f"mkdir -p {REMOTE_TEMP_DIR}",
            f"chmod 777 {REMOTE_TEMP_DIR}",
            f"chown {SSH_USER}:{SSH_USER} {REMOTE_TEMP_DIR}"
        ]
        
        for cmd in commands:
            logger.info(f"Executing: {cmd}")
            stdin, stdout, stderr = ssh_client.exec_command(cmd)
            
            # print(stdin, stdout, stderr)
            # Write password to stdin
            stdin.write(f"{SSH_PASSWORD}\n")
            stdin.flush()
            # print(f"Password written to stdin: {SSH_PASSWORD}")
            # Wait for command to complete
            exit_status = stdout.channel.recv_exit_status()
            # print(f"Exit status: {exit_status}")
            error = stderr.read().decode()
            # print(f"Error: {error}")
            output = True#stdout.read().decode()
            # print(f"Output: {output}")
            
            logger.info(f"Command output: {output}")
            
            if exit_status != 0:
                logger.error(f"Command failed with status {exit_status}: {error}")
                raise Exception(f"Command failed: {cmd}")
            elif error and "password for kali" not in error.lower():
                logger.warning(f"Command warning: {error}")
                
            logger.info(f"Successfully executed: {cmd}")
            
    except Exception as e:
        logger.error(f"Failed to create temp directory: {e}")
        raise

def upload_file(ssh_client, local_file_path, remote_file_path):
    """Uploads a file from local to remote server"""
    try:
        logger.info(f"Uploading {local_file_path} to {remote_file_path}")
        with SCPClient(ssh_client.get_transport()) as scp:
            scp.put(str(local_file_path), remote_file_path)
        logger.info("Upload successful")
    except Exception as e:
        logger.error(f"Upload failed: {e}")
        raise

def download_files(remote_dir, local_dir):
    """Download files using scp command with key-based authentication"""
    try:
        # Get the client ID from the remote directory path
        client_id = os.path.basename(remote_dir)
        
        # List of expected files
        expected_files = [f"{client_id}.{ext}" for ext in ["crt", "pem", "csr"]]
        
        for filename in expected_files:
            remote_file = f"{remote_dir}/{filename}"
            local_file = f"{local_dir}/{filename}"
            
            # Check if remote file exists using SSH key
            check_command = [
                "ssh",
                "-i", SSH_KEY,  # Specify the private key
                "-p", str(SSH_PORT),
                "-o", "StrictHostKeyChecking=no",  # Skip host key checking
                "-o", "PasswordAuthentication=no",  # Disable password authentication
                f"{SSH_USER}@{SSH_HOST}",
                f"test -f {remote_file} && echo 'exists'"
            ]
            
            result = subprocess.run(check_command, capture_output=True, text=True)
            if "exists" in result.stdout:
                # File exists, download it using SCP with key
                scp_command = [
                    "scp",
                    "-i", SSH_KEY,  # Specify the private key
                    "-P", str(SSH_PORT),
                    "-o", "StrictHostKeyChecking=no",  # Skip host key checking
                    "-o", "PasswordAuthentication=no",  # Disable password authentication
                    f"{SSH_USER}@{SSH_HOST}:{remote_file}",
                    local_file
                ]
                
                result = subprocess.run(scp_command, capture_output=True, text=True)
                if result.returncode != 0:
                    raise Exception(f"Failed to download {filename}: {result.stderr}")
                logger.info(f"Successfully downloaded {filename}")
                time.sleep(1.5)

            else:
                logger.warning(f"Remote file not found: {remote_file}")
                
    except Exception as e:
        logger.error(f"Download failed: {e}")
        raise

def execute_remote_command(ssh_client, command):
    """Execute remote command using ssh"""
    try:
        logger.info(f"Executing remote command: {command}")
        stdin, stdout, stderr = ssh_client.exec_command(command)
        
        # Wait for command to complete
        exit_status = stdout.channel.recv_exit_status()
        output = stdout.read().decode()
        error = stderr.read().decode()
        
        # Log the outputs
        if output:
            logger.info(f"Command output: {output}")
        if error and "password for kali" not in error.lower():
            logger.info(f"Command stderr: {error}")
        
        # The CSR verification message appears in stderr but it's not an error
        if exit_status != 0 and not ("Certificate request self-signature ok" in error):
            logger.error(f"Command failed with status {exit_status}")
            raise Exception(f"Command failed: {error}")
            
        return output + error  # Return both output and error as they might contain important info
        
    except Exception as e:
        logger.error(f"Failed to execute remote command: {e}")
        raise

def process_csr(client_id, local_csr_path, subscription):
    """Main process to handle CSR signing"""
    logger.info(f"Starting CSR processing for client: {client_id}")
    
    # Convert relative path to absolute path
    local_csr_path = os.path.normpath(os.path.join(BASE_DIR, local_csr_path))
    local_csr_path = Path(local_csr_path)
    logger.info(f"Absolute CSR path: {local_csr_path}")
    
    # Ensure the CSR file exists
    if not local_csr_path.exists():
        logger.error(f"CSR file not found at: {local_csr_path}")
        # Try alternative path by removing extra 'backend' if present
        if 'backend\\backend' in str(local_csr_path):
            alt_path = Path(str(local_csr_path).replace('backend\\backend', 'backend'))
            if alt_path.exists():
                local_csr_path = alt_path
                logger.info(f"Found CSR at alternative path: {local_csr_path}")
            else:
                raise FileNotFoundError(f"CSR file not found: {local_csr_path}")
        else:
            raise FileNotFoundError(f"CSR file not found: {local_csr_path}")

    # Establish SSH connection
    ssh_client = paramiko.SSHClient()
    ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    
    try:
        # Connect to remote server
        logger.info(f"Connecting to {SSH_HOST}:{SSH_PORT}")
        ssh_client.connect(
            hostname=SSH_HOST,
            port=SSH_PORT,
            username=SSH_USER,
            password=SSH_PASSWORD,  
            key_filename=SSH_KEY
        )
        logger.info("SSH connection established")

        # Ensure temp directory exists
        ensure_remote_temp_directory(ssh_client)

        # Upload CSR file to temp directory
        temp_csr_path = f"{REMOTE_TEMP_DIR}/{local_csr_path.name}"
        upload_file(ssh_client, local_csr_path, temp_csr_path)

        # Execute signing script with temp file path
        signing_command = f"echo '{SSH_PASSWORD}' | sudo -S bash {SIGNING_SCRIPT_PATH} {temp_csr_path} {subscription}"
        signing_output = execute_remote_command(ssh_client, signing_command)

        # Create local client directory
        local_client_dir = LOCAL_CLIENT_DIR / client_id
        local_client_dir.mkdir(parents=True, exist_ok=True)

        # Download generated files from client directory
        remote_client_dir = f"{REMOTE_CLIENT_DIR}/{client_id}"
        download_files(remote_client_dir, local_client_dir)

        # Verify files exist
        crt_file = local_client_dir / f"{client_id}.crt"
        pem_file = local_client_dir / f"{client_id}.pem"
        
        if not crt_file.exists() or not pem_file.exists():
            raise Exception("Certificate files were not generated properly")

        # Clean up temp file
        execute_remote_command(ssh_client, f"rm -f {temp_csr_path}")

        logger.info("CSR processing completed successfully")
        return {
            "status": "success",
            "message": "Certificate signing completed",
            "local_dir": str(local_client_dir),
            "files": {
                "crt": str(crt_file),
                "pem": str(pem_file)
            },
            "signing_output": signing_output
        }

    except Exception as e:
        logger.error(f"Error during CSR processing: {e}")
        raise
    finally:
        ssh_client.close()
        logger.info("SSH connection closed")

if __name__ == "__main__":
    # Example tracking ID format: CERT-XXXXXXXX
    test_client_id = "CERT-TPJVKHUN"
    test_csr_path = f"uploads/clients/{test_client_id}/{test_client_id}.csr"
    test_subscription = "gold"

    try:
        result = process_csr(test_client_id, test_csr_path, test_subscription)
        logger.info("Process completed successfully!")
        logger.info(f"Result: {result}")
    except Exception as e:
        logger.error(f"Error: {e}")