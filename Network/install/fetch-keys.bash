function fetch_file () {
    curl "$baseUrl/$1" -O tmp.pem
    cp tmp.pem "../manager/keys/$file"
    mv tmp.pem "../client/keys/$file"
}

echo "Enter Server's IP: "
read ip

echo "Downloading client keys"
baseUrl="http://$ip:8123/keys/"

fetch_file "client-key.pem"
fetch_file "client-cert.pem"
fetch_file "server-key.pem"
fetch_file "server-cert.pem"
