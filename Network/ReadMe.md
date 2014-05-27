# Byzantine Fault Tolerance
Enhanced Byzantine Fault Tolerance with membership service 

# Installation
`cd` into `install` folder and run `install.bash`

    bash install.bash

Open `client-cert.conf` and `server-cert.conf` in `keys` folder and change the `subjectAltName` to the server's IP address

    subjectAltName=IP:127.0.0.1

Generate the keys

    cd keys && create-keys.bash server && create-keys.bash client

Keys and certificates need to be exchanged between the client and the server before any communication can begin

Run `serve-keys.bash` on the server from the `install` directory

    bash serve-keys.bash

Run `fetch-keys.bash on the client side

    bash fetch-keys.bash

Run the server with the following (assuming the current working directory is project root)

    cd server && bash runserver.bash

Run the client with the following

    cd client && bash runclient.bash

