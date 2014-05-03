# Detect the current ditro
echo "Detecting OS"
distro=$(uname)

# if [ $distro == 'Linux' ]
# then
#     distro=$(grep '^NAME=' /etc/os-release | sed -e s/NAME=//g -e s/\"//g)
# fi

uname -a | grep "x86_64" > /dev/null
if [[ $? -eq 0 ]]
then
    arch="64"
else
    arch="32"
fi

case "$distro" in
    Linux)
        filename="downloaded.tar.gz"
        case $arch in
            32)
                url="http://dl.node-webkit.org/v0.8.6/node-webkit-v0.9.2-linux-ia32.tar.gz";;
            64)
                url="http://dl.node-webkit.org/v0.8.6/node-webkit-v0.9.2-linux-x64.tar.gz";;
        esac;;
    Darwin)
        filename="downloaded.zip"
        case $arch in
            32)
                url="http://dl.node-webkit.org/v0.8.6/node-webkit-v0.9.2-osx-ia32.zip";;
            64)
                url="http://dl.node-webkit.org/v0.8.6/node-webkit-v0.9.2-osx-ia32.zip";;
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
if [[ ! -f downloaded.tar.gz ]] 
# false positive if file isn't downloaded completely
# need to check md5 hash
then
    echo "Downloading node-webkit"
    curl -o $filename $url
fi
case "$distro" in
    Linux)
        tar -zxvf downloaded.tar.gz
        cp node-webkit-v0.8.6-linux-ia32/nw ../nw-builds/
        cp node-webkit-v0.8.6-linux-ia32/nw.pak ../nw-builds/
	;;
    Darwin)
        unzip downloaded.zip node-webkit.app/* -d "../nw-builds/"
	;;
esac

echo "Back to project root"
cd ../
echo "Installing npm dependencies"
sudo npm install
mkdir data
bash create-server-keys.bash
bash create-client-keys.bash
##  node, npm install, tmux, curl, brew, grunt-cli, libnss3-tools















