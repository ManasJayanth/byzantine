var net = require('net');
var clients = [];
var rsa = require('./rsa');

function handleData (data) {
    // console.log(data + ' from ' + conn.remoteAddress + ' ' +
    //             conn.remotePort);
    console.log('Decrypting..');
    var encrypted = data.toString(),
        key =  rsa.getPrivateKey();
    var decryptedText = rsa.process(encrypted, key);
    console.log("Received text:" + decryptedText);
}
var server = net.createServer(function(conn) {
    console.log('Connected - sending pubilc key');
    conn.write(rsa.getPublicKey().toString());
    conn.on('data', handleData);
    conn.on('close', function() {
        console.log('client closed connection');
    });
}).listen(8124);
console.log('listening on port 8124');
