if [[ $(which http-server) = '' ]]
then
    echo "http-server not found"
    echo "Installing"
    npm install http-server
    echo "Done"
fi
http-server -p 8123
