echo "**************************"
echo "Removing older .pem files"
rm *.pem

echo "**************************"
echo "Creating key (rsa)"
openssl genrsa -out ryans-key.pem 1024

echo "**************************"
echo "Certificate request..."
openssl req -new -key ryans-key.pem -out ryans-csr.pem

echo "**************************"
echo "Generating certificate"
openssl x509 -req -in ryans-csr.pem -signkey ryans-key.pem -out ryans-cert.pem -extfile server-cert.conf
