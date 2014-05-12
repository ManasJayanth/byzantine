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
function copyKeys {
    cp ../keys/*.pem keys/
}

copyKeys
runmongod &&
tmux split-window 'nodemon server' &&
tmux select-layout even-horizontal &&
tmux attach
