#!/bin/bash

# Directory paths
ROOT_DIR=/home/kali/lab/root
INTER_DIR=/home/kali/lab/inter
CLIENT_DIR=/home/kali/lab/client
TEMP_DIR=/home/kali/lab/temp_uploads

# Set umask for new files
umask 022

# Subscription levels, validity periods, and security measures
SILVER_DAYS=730 # 2 years
GOLD_DAYS=1825  # 5 years
PLATINUM_DAYS=1825 # 5 years (highest security)

SILVER_CIPHER="sha256"
GOLD_CIPHER="sha384"
PLATINUM_CIPHER="sha512"

# Ensure directories exist with proper permissions
ensure_directories() {
    local dirs=("$ROOT_DIR" "$INTER_DIR" "$CLIENT_DIR" "$TEMP_DIR")
    for dir in "${dirs[@]}"; do
        if [ ! -d "$dir" ]; then
            sudo mkdir -p "$dir"
        fi
        sudo chown -R kali:kali "$dir"
        sudo chmod 755 "$dir"
    done
    echo "Directory permissions set successfully"
}

# Usage function
usage() {
    echo "Usage: $0 <csr-file> <subscription-level>"
    echo "Subscription levels: silver, gold, platinum"
    exit 1
}

# Display benefits function
display_benefits() {
    case $1 in
        silver)
            echo "Silver Wildcard Certificate Benefits:"
            echo "- Secure your domains with affordability and reliable protection."
            echo "- Protect unlimited subdomains with a single certificate."
            echo "- Simplified SSL management."
            echo "- Trusted by most major browsers."
            echo "- Valid for 2-3 years."
            ;;
        gold)
            echo "Gold Wildcard Certificate Benefits:"
            echo "- Robust protection for valuable domains with premium security."
            echo "- Secure unlimited subdomains with strong encryption."
            echo "- Simplify SSL management with one certificate for all subdomains."
            echo "- Trusted by most major browsers."
            echo "- Valid for up to 5 years."
            ;;
        platinum)
            echo "Platinum Wildcard Certificate Benefits:"
            echo "- Maximum security and unmatched trust for high-value domains."
            echo "- Secure unlimited subdomains with cutting-edge encryption."
            echo "- Simplified SSL management with the highest protection."
            echo "- Trusted by all major browsers."
            echo "- Valid for up to 5 years."
            ;;
        *)
            echo "Invalid subscription level."
            ;;
    esac
}

# Log function
log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# Check input arguments
if [ $# -ne 2 ]; then
    usage
fi

TEMP_CSR_FILE=$1
SUBSCRIPTION=$2

# Ensure directories exist with proper permissions
ensure_directories

# Check if the CSR file exists in temp directory
if [ ! -f "$TEMP_CSR_FILE" ]; then
    log_message "Error: CSR file '$TEMP_CSR_FILE' not found in temp directory."
    exit 1
fi

# Extract client ID from filename
CLIENT_ID=$(basename "$TEMP_CSR_FILE" | cut -d'.' -f1)
log_message "Processing certificate for client: $CLIENT_ID"

# Create and secure client-specific directory
CLIENT_SPECIFIC_DIR="$CLIENT_DIR/$CLIENT_ID"
sudo mkdir -p "$CLIENT_SPECIFIC_DIR"
sudo chown kali:kali "$CLIENT_SPECIFIC_DIR"
sudo chmod 755 "$CLIENT_SPECIFIC_DIR"
log_message "Created client directory: $CLIENT_SPECIFIC_DIR"

# Move CSR file from temp to client directory with correct name
CSR_FILE="$CLIENT_SPECIFIC_DIR/${CLIENT_ID}.csr"
mv "$TEMP_CSR_FILE" "$CSR_FILE"
sudo chown kali:kali "$CSR_FILE"
sudo chmod 644 "$CSR_FILE"
log_message "Moved CSR file to: $CSR_FILE"

if [ ! -f "$CSR_FILE" ]; then
    log_message "Error: Failed to move CSR file to client directory."
    exit 1
fi

# Determine validity period and security options based on subscription level
case $SUBSCRIPTION in
    silver)
        VALIDITY_DAYS=$SILVER_DAYS
        CIPHER=$SILVER_CIPHER
        ;;
    gold)
        VALIDITY_DAYS=$GOLD_DAYS
        CIPHER=$GOLD_CIPHER
        ;;
    platinum)
        VALIDITY_DAYS=$PLATINUM_DAYS
        CIPHER=$PLATINUM_CIPHER
        ;;
    *)
        log_message "Error: Invalid subscription level '$SUBSCRIPTION'."
        usage
        ;;
esac

log_message "Using subscription level: $SUBSCRIPTION with cipher: $CIPHER"

# Output certificate and PEM files with proper permissions
OUTPUT_CRT="$CLIENT_SPECIFIC_DIR/${CLIENT_ID}.crt"
OUTPUT_PEM="$CLIENT_SPECIFIC_DIR/${CLIENT_ID}.pem"

# Apply security options for Platinum
if [ "$SUBSCRIPTION" == "platinum" ]; then
    EXTENSIONS_FILE="/tmp/${CLIENT_ID}_ext.cnf"
    cat > "$EXTENSIONS_FILE" <<EOF
[ v3_ext ]
keyUsage = critical, digitalSignature, keyEncipherment
extendedKeyUsage = clientAuth, serverAuth
EOF
    EXTENSIONS_FLAG="-extfile $EXTENSIONS_FILE -extensions v3_ext"
    sudo chmod 600 "$EXTENSIONS_FILE"
else
    EXTENSIONS_FLAG=""
fi

# Sign the CSR using the Intermediate CA
log_message "Signing certificate..."
openssl x509 -req -in "$CSR_FILE" \
    -CA "$INTER_DIR/intermediateCA.crt" \
    -CAkey "$INTER_DIR/intermediateCA.key" \
    -CAcreateserial \
    -out "$OUTPUT_CRT" \
    -days "$VALIDITY_DAYS" \
    -$CIPHER $EXTENSIONS_FLAG

# Check result and set permissions
if [ $? -eq 0 ]; then
    log_message "Certificate successfully signed!"
    
    # Set proper ownership and permissions for certificate
    sudo chown kali:kali "$OUTPUT_CRT"
    sudo chmod 644 "$OUTPUT_CRT"
    log_message "Certificate saved as: $OUTPUT_CRT"

    # Create PEM file with certificate chain and set permissions
    cat "$OUTPUT_CRT" "$INTER_DIR/intermediateCA.crt" "$ROOT_DIR/rootCA.crt" > "$OUTPUT_PEM"
    sudo chown kali:kali "$OUTPUT_PEM"
    sudo chmod 644 "$OUTPUT_PEM"
    log_message "Certificate chain saved as: $OUTPUT_PEM"

    # Create subscription-specific symbolic links
    ln -sf "$OUTPUT_CRT" "$CLIENT_SPECIFIC_DIR/${CLIENT_ID}_${SUBSCRIPTION}.crt"
    ln -sf "$OUTPUT_PEM" "$CLIENT_SPECIFIC_DIR/${CLIENT_ID}_${SUBSCRIPTION}.pem"

    # Make all files in client directory readable
    sudo find "$CLIENT_SPECIFIC_DIR" -type f -exec chmod 644 {} \;
    sudo find "$CLIENT_SPECIFIC_DIR" -type d -exec chmod 755 {} \;
    sudo chown -R kali:kali "$CLIENT_SPECIFIC_DIR"
    
    [ "$SUBSCRIPTION" == "platinum" ] && rm -f "$EXTENSIONS_FILE"

    # Display subscription benefits
    display_benefits "$SUBSCRIPTION"
    
    # List the generated files and their permissions
    echo -e "\nGenerated files and permissions:"
    ls -l "$CLIENT_SPECIFIC_DIR"

    # Verify files exist and are readable
    log_message "Verifying generated files..."
    for file in "$OUTPUT_CRT" "$OUTPUT_PEM" "$CSR_FILE"; do
        if [ ! -f "$file" ]; then
            log_message "Error: File $file was not created"
            exit 1
        fi
        sudo chmod 644 "$file"
        sudo chown kali:kali "$file"
    done

    # Create a manifest file
    MANIFEST_FILE="$CLIENT_SPECIFIC_DIR/manifest.txt"
    {
        echo "Certificate Generation Manifest"
        echo "Generated on: $(date)"
        echo "Client ID: $CLIENT_ID"
        echo "Subscription Level: $SUBSCRIPTION"
        echo "Validity Period: $VALIDITY_DAYS days"
        echo "Cipher: $CIPHER"
        echo "Files Generated:"
        ls -l "$CLIENT_SPECIFIC_DIR"
    } > "$MANIFEST_FILE"
    sudo chown kali:kali "$MANIFEST_FILE"
    sudo chmod 644 "$MANIFEST_FILE"

else
    log_message "Error: Failed to sign the certificate."
    [ "$SUBSCRIPTION" == "platinum" ] && rm -f "$EXTENSIONS_FILE"
    exit 1
fi

# Final verification of permissions
log_message "Verifying file permissions..."
find "$CLIENT_SPECIFIC_DIR" -ls

log_message "Certificate generation process completed successfully"
