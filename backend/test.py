import paramiko
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# SSH Configuration from environment variables
SSH_HOST = os.getenv('SSH_HOST')
SSH_PORT = int(os.getenv('SSH_PORT', 22))
SSH_USER = os.getenv('SSH_USER')
SSH_KEY = os.getenv('SSH_KEY')
SSH_PASSWORD = os.getenv('SSH_PASSWORD')

def execute_remote_command(command):
    """Connects to the remote server and executes a single command."""
    ssh_client = paramiko.SSHClient()
    ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        ssh_client.connect(
            hostname=SSH_HOST,
            port=SSH_PORT,
            username=SSH_USER,            key_filename=SSH_KEY,
            password=SSH_PASSWORD
        )
        print("Connected to the remote server")
        print("execute command")
        stdin, stdout, stderr = ssh_client.exec_command(command)
        print("command executed")
        # Read command outputs
        print(stdin, stdout, stderr)
        output = stdout.read().decode()
        error = stderr.read().decode()
        
        if output:
            print(f"Command Output:\n{output}")
        if error:
            print(f"Command Error:\n{error}")
        
    finally:
        ssh_client.close()

if __name__ == "__main__":
    # Test command
    command_to_execute = f"ls -l /home/{SSH_USER}/lab"  # Replace with the command you want to test
    execute_remote_command(command_to_execute)
