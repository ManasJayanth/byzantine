var net = require('net');
var client = new net.Socket();
var rsa = require('./rsa');

client.setEncoding('utf8');

function handleData (key) {
    console.log('Received key: ' + key);
    console.log('Encrypting...');
    var str = "diamondhead";
    data = rsa.process(str, parseInt(key));
    console.log(data);
    client.write(data);
}
// connect to server
client.connect ('8124','localhost', function () {
    console.log('connected to server');
});

// when receive data back, print to console 
client.on('data', handleData);

// when server closed 
client.on('close',function() {
    console.log('connection is closed');
});
