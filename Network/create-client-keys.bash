echo "**************************"
echo "Removing older .pem files"
rm -rf client-keys
mkdir client-keys

echo "**************************"
echo "Creating key (rsa)"
openssl genrsa -out "client-keys/client-key.pem" 1024

echo "**************************"
echo "Certificate request..."
openssl req -new -key "client-keys/client-key.pem" -out "client-keys/client-csr.pem"

echo "**************************"
echo "Generating certificate"
openssl x509 -req -in "client-keys/client-csr.pem" -signkey "client-keys/client-key.pem" -out "client-keys/client-cert.pem" -extfile client-cert.conf
