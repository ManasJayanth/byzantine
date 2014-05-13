function fetch_file () {
    baseUrl="http://$1:8123"
    curl "$baseUrl/$2" -o tmp.pem
    cp tmp.pem "../manager/keys/$2"
    cp tmp.pem "../server/keys/$2" 
    mv tmp.pem "../client/keys/$2"
}

echo "Enter Server's IP: "
read ip

echo "Downloading client keys"
fetch_file "$ip" "client-key.pem"
fetch_file "$ip" "client-cert.pem"

echo "Downloading client keys"
fetch_file "$ip" "server-key.pem"
fetch_file "$ip" "server-cert.pem"
