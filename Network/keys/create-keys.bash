############################################################
#
# Used to create certificates and keys for client
# and server
#
# -----------------------------------------
# To create server certificates and keys run the following:
#     $ bash create-keys.bash server
#
# -----------------------------------------
# To create client certificate and keys run the following:
#     $ bash create-key.bash client
#
#############################################################

if [[ $# -ne 1 || ($1 != 'client' && $1 != 'server') ]]
then
    echo "Invalid usage!"
    head -14 create-keys.bash
    exit 1
fi

path='.'

# echo "**************************"
# echo "Removing older .pem files"
# rm *.pem

echo "**************************"
echo "Creating key (rsa)"
openssl genrsa -out "$path/$1-key.pem" 1024

echo "**************************"
echo "Certificate request..."
openssl req -new -key "$path/$1-key.pem" -out "$path/$1-csr.pem"

echo "**************************"
echo "Generating certificate"
openssl x509 -req -in "$path/$1-csr.pem" -signkey "$path/$1-key.pem" -out "$path/$1-cert.pem" -extfile "$1-cert.conf"
