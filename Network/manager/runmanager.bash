function runmanager {
# Detect the current ditro
    echo "Detecting OS"
    distro=$(uname)

    case "$distro" in
	Linux)
	    ../nw-builds/nw ../nw-builds/manager.nw
	    ;;
	Darwin)
	    ../nw-builds/node-webkit.app/Contents/MacOS/node-webkit ../nw-builds/manager.nw
	    ;;
    esac
}

grunt build &&
runmanager &&
