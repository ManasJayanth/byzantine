echo "**************************"
echo "Removing older .pem files"
rm -rf server-keys
mkdir server-keys

echo "**************************"
echo "Creating key (rsa)"
openssl genrsa -out "server-keys/server-key.pem" 1024

echo "**************************"
echo "Certificate request..."
openssl req -new -key "server-keys/server-key.pem" -out "server-keys/server-csr.pem"

echo "**************************"
echo "Generating certificate"
openssl x509 -req -in "server-keys/server-csr.pem" -signkey "server-keys/server-key.pem" -out "server-keys/server-cert.pem" -extfile server-cert.conf
