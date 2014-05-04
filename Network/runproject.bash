function runmongod {
    mongodpid=$(ps -ae | grep mongod | cut -d " " -f 1,7 | grep mongod | cut -d " " -f 1)
    if [[ $mongodpid != '' ]]
    then	
	sudo kill $mongodpid
    fi
    LOCK_FILE="data/mongod.lock"
    if [[ -f $LOCK_FILE ]]
    then
        rm $LOCK_FILE
    fi
    tmux new-session -d 'mongod --dbpath="data"'
}
function runclient {
# Detect the current ditro
    echo "Detecting OS"
    distro=$(uname)

    case "$distro" in
	Linux)
	    tmux split-window './nw-builds/nw ./nw-builds/manager.nw'
	    ;;
	Darwin)
	    tmux split-window './nw-builds/node-webkit.app/Contents/MacOS/node-webkit ./nw-builds/manager.nw'
	    ;;
    esac
}
runmongod &&
tmux split-window 'node server' &&
grunt build &&
runclient &&
tmux select-layout even-horizontal &&
tmux attach
