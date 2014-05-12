function runclient {
# Detect the current ditro
    echo "Detecting OS"
    distro=$(uname)

    case "$distro" in
	Linux)
	    ../nw-builds/nw ../nw-builds/client.nw
	    ;;
	Darwin)
	    ../nw-builds/node-webkit.app/Contents/MacOS/node-webkit ../nw-builds/client.nw
	    ;;
    esac
}

grunt build &&
runclient
