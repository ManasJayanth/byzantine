tmux new-session -d 'mongod' &&
tmux split-window 'grunt watch' &&
tmux split-window 'node server' &&
tmux split-window './nw-builds/node-webkit.app/Contents/MacOS/node-webkit ./nw-builds/client.nw' &&
tmux select-layout even-horizontal &&
tmux attach
