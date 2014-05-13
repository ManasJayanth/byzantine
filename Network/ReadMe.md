# Byzantine Fault Tolerance
Enhanced Byzantine Fault Tolerance with membership service 

# Installation
`cd` into `install` folder and run `install.bash`

    bash install.bash

Fill in the details for certificates

Keys and certificates need to be exchanged between the client and the server before any communication can begin

Run `serve-keys.bash` on the server from the `install` directory

    bash serve-keys.bash

Run `fetch-keys.bash on the client side

    bash fetch-keys.bash

Run the server with the following (assuming the current working directory is project root)

    cd server && bash runserver.bash

Run the client with the following

    cd client && bash runclient.bash

