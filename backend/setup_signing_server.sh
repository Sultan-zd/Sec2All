#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Setting up Sec2All Certificate Signing Server...${NC}"

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Please run as root${NC}"
    exit 1
fi

# Base directory for certificate operations
BASE_DIR="/home/kali/lab"
USERNAME="kali"
GROUPNAME="kali"

# Create directory structure
echo -e "${YELLOW}Creating directory structure...${NC}"
directories=(
    "$BASE_DIR"
    "$BASE_DIR/root"
    "$BASE_DIR/inter"
    "$BASE_DIR/client"
    "$BASE_DIR/temp_uploads"
)

for dir in "${directories[@]}"; do
    mkdir -p "$dir"
    chown $USERNAME:$GROUPNAME "$dir"
    chmod 755 "$dir"
done

# Set up OpenSSL configuration
echo -e "${YELLOW}Setting up OpenSSL configuration...${NC}"
cat > "$BASE_DIR/root/openssl.cnf" << EOL
[ ca ]
default_ca = CA_default

[ CA_default ]
dir               = $BASE_DIR/root
certs            = \$dir/certs
crl_dir          = \$dir/crl
new_certs_dir    = \$dir/newcerts
database         = \$dir/index.txt
serial           = \$dir/serial
RANDFILE         = \$dir/private/.rand

private_key       = \$dir/private/ca.key
certificate       = \$dir/certs/ca.crt

crlnumber        = \$dir/crlnumber
crl              = \$dir/crl/ca.crl
crl_extensions    = crl_ext
default_crl_days = 30

default_md        = sha256
name_opt         = ca_default
cert_opt         = ca_default
default_days     = 375
preserve         = no
policy           = policy_strict

[ policy_strict ]
countryName             = match
stateOrProvinceName     = match
organizationName        = match
organizationalUnitName  = optional
commonName             = supplied
emailAddress           = optional

[ req ]
default_bits        = 2048
distinguished_name  = req_distinguished_name
string_mask        = utf8only
default_md         = sha256
x509_extensions    = v3_ca

[ req_distinguished_name ]
countryName                     = Country Name (2 letter code)
stateOrProvinceName            = State or Province Name
localityName                   = Locality Name
0.organizationName             = Organization Name
organizationalUnitName         = Organizational Unit Name
commonName                     = Common Name
emailAddress                   = Email Address

[ v3_ca ]
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid:always,issuer
basicConstraints = critical, CA:true
keyUsage = critical, digitalSignature, cRLSign, keyCertSign

[ v3_intermediate_ca ]
subjectKeyIdentifier = hash
authorityKeyIdentifier = keyid:always,issuer
basicConstraints = critical, CA:true, pathlen:0
keyUsage = critical, digitalSignature, cRLSign, keyCertSign
EOL

# Initialize CA directories
echo -e "${YELLOW}Initializing CA directories...${NC}"
cd "$BASE_DIR/root"
mkdir -p certs crl newcerts private
chmod 700 private
touch index.txt
echo 1000 > serial

# Generate Root CA
echo -e "${YELLOW}Generating Root CA...${NC}"
openssl genrsa -aes256 -out private/ca.key 4096
chmod 400 private/ca.key

echo -e "${GREEN}Root CA setup complete!${NC}"
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Complete the Root CA creation by running:"
echo "   openssl req -config openssl.cnf -key private/ca.key -new -x509 -days 7300 -sha256 -extensions v3_ca -out certs/ca.crt"
echo
echo "2. Create the Intermediate CA"
echo "3. Update permissions for the signing script:"
echo "   chmod 700 $BASE_DIR/sign_csr_with_pem.sh"
echo
echo "4. Verify the setup with:"
echo "   openssl verify -CAfile root/certs/ca.crt intermediate/certs/intermediate.crt"
