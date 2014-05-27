# Changing back to project root
cd ..

# Detect the current ditro
echo "Detecting OS"
distro=$(uname)

uname -a | grep "x86_64" > /dev/null
if [[ $? -eq 0 ]]
then
    arch="64"
else
    arch="32"
fi

case "$distro" in
    Linux)
        filename="downloaded.tar"
        case $arch in
            32)
                url="http://dl.node-webkit.org/v0.8.6/node-webkit-v0.8.6-linux-ia32.tar.gz";;
            64)
                url="http://dl.node-webkit.org/v0.8.6/node-webkit-v0.8.6-linux-x64.tar.gz";;
        esac;;
    Darwin)
        filename="downloaded.zip"
        case $arch in
            32)
                url="http://dl.node-webkit.org/v0.8.6/node-webkit-v0.8.6-osx-ia32.zip";;
            64)
                url="http://dl.node-webkit.org/v0.8.6/node-webkit-v0.8.6-osx-ia32.zip";;
            ## might get updated in future
        esac;;
esac

echo "Changing to temporary directory"
if [[ ! -d tmp ]]
then
    echo "Not present...making one"
    mkdir tmp
fi

cd tmp
if [[ ! -f "$filename" ]] 
# false positive if file isn't downloaded completely
# need to check md5 hash
then
    echo "Downloading node-webkit"
    curl -o "$filename" "$url"
fi
case "$distro" in
    Linux)
        tar -xvf "$filename"
        cp node-webkit-v0.8.6-linux-ia32/nw ../nw-builds/
        cp node-webkit-v0.8.6-linux-ia32/nw.pak ../nw-builds/
	;;
    Darwin)
        unzip "$filename" node-webkit.app/* -d "../nw-builds/"
	;;
esac

echo "Back to project root"
cd ../
echo "Installing npm dependencies"
sudo npm install

echo "Creating data folder for database"
mkdir "server/data"

echo "Creating directory for user uploaded files"
mkdir "server/user-files"

echo "Making directories for keys..."
mkdir server/keys
mkdir client/keys
mkdir manager/keys

echo "Creating config file for manager-code and client-code"
echo "{ \"path\": \"$(pwd)\", \"ip\": \"127.0.0.1\" }" > manager/src/config.json
echo "{ \"path\": \"$(pwd)\", \"ip\": \"127.0.0.1\" }" > client/src/config.json
##  node, npm install, tmux, curl, brew, grunt-cli, libnss3-tools
