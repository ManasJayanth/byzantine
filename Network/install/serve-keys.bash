cd ../keys
if [[ $(which http-server) = '' ]]
then
    echo "http-server not found"
    echo "Installing"
    sudo npm install -g http-server
    echo "Done"
fi
http-server -p 8123
