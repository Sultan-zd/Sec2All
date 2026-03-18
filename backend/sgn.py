import paramiko
import os
from dotenv import load_dotenv

def execute_remote_command_safe(ssh_client, command):
    stdin, stdout, stderr = ssh_client.exec_command(command)

    # Read the outputs incrementally to avoid blocking
    while not stdout.channel.exit_status_ready():
        if stdout.channel.recv_ready():
            print(stdout.read().decode(), end="")  # Print stdout incrementally
        if stdout.channel.recv_stderr_ready():
            print(stderr.read().decode(), end="")  # Print stderr incrementally

# Usage
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
# Load environment variables from .env file
load_dotenv()

# Retrieve connection details from environment variables
hostname = os.getenv('SIGNING_SERVER_IP')
username = os.getenv('SSH_USERNAME')
key_filename = os.getenv('SSH_PRIVATE_KEY_PATH')
password = os.getenv('SSH_PASSWORD')
port = int(os.getenv('SSH_PORT', 22))  # Default to port 22 if not specified

# Connect using the retrieved details
ssh.connect(hostname=hostname, username=username, key_filename=key_filename, password=password, port=port)

try:
    execute_remote_command_safe(ssh, f"ls -l /home/{username}/lab")
finally:
    ssh.close()
